import { GetData } from "./api.js";
import { Logout } from "./logout.js";

export async function Home() {
    const [userRaw, levelRaw, xpRaw, xpAmountModule, auditData] = await Promise.all([
        GetData('user'),
        GetData('level'),
        GetData('XP'),
        Graph1(),
        GraphAudit()
    ]);

    const user = userRaw?.data?.user?.[0] || { firstName: "User", lastName: "", login: "guest" };
    const level = levelRaw?.data?.transaction?.[0]?.amount || 0;
    const rawXP = xpRaw?.data?.transaction_aggregate?.aggregate?.sum?.amount || 0;
    const xPtotal = Math.round(rawXP / 1000);
    
    console.log(user)
    const cohort = user?.events?.[0]?.cohorts?.[0]?.labelName || "No Cohort";

    const chartComponents = generateSvgChart(xpAmountModule);
    const auditSvg = generateAuditSvg(auditData);

    const main = document.getElementById('content');
    if (!main) return;

    main.innerHTML = `
<div class="dashboard">
    <header class="header">
        <div class="header-profile">
            <div class="avatar">${user.firstName.charAt(0).toUpperCase()}</div>
            <div class="user-info">
                <span class="welcome-text">Welcome</span>
                <span class="user-name">${user.firstName} ${user.lastName}</span>
            </div>
        </div>
        <div class="header-title" style="display: flex; align-items: center; gap: 10px;">
            <span class="brand-badge">${user.login}</span>
            
            <!-- Zone Cohort Stylisée -->
            <div class="cohort-badge" style="
                display: inline-flex; 
                align-items: center; 
                gap: 6px; 
                padding: 4px 12px; 
                background: rgba(168, 85, 247, 0.12); 
                border: 1px solid rgba(168, 85, 247, 0.35); 
                border-radius: 20px; 
                font-family: 'Plus Jakarta Sans', sans-serif; 
                font-size: 11px; 
                font-weight: 700; 
                color: #a855f7; 
                letter-spacing: 0.5px; 
                box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
                backdrop-filter: blur(4px);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>${cohort}</span>
            </div>
        </div>
        <div class="header-actions">
            <div class="status-indicator"><span class="dot"></span> Online</div>
            <button id="logoutBtn">
                <span>Log Out</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
            </button>
        </div>
    </header>

    <aside class="side-column">
        <div class="card level-card-v2">
            <div class="level-card-header">
                <div class="level-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00f2fe" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </div>
                <span class="level-badge-tag">RANK PROGRESS</span>
            </div>
            <div class="level-card-content">
                <span class="level-sub-title">CURRENT LEVEL</span>
                <div class="level-display"><span class="level-number">${level}</span></div>
            </div>
            <div class="level-progress-wrapper">
                <div class="level-progress-bar" style="width: 70%;"></div>
            </div>
        </div>

        <div class="card xp-card-v2">
            <div class="xp-card-header">
                <div class="xp-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff0080" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                </div>
                <span class="xp-badge-tag">${cohort}</span>
            </div>
            <div class="xp-card-content">
                <span class="xp-sub-title">CUMULATIVE XP</span>
                <div class="xp-display">
                    <span class="xp-number">${xPtotal}</span>
                    <span class="xp-unit">kB</span>
                </div>
            </div>
            <div class="xp-progress-wrapper">
                <div class="xp-progress-bar" style="width: 85%;"></div>
            </div>
        </div>
    </aside>

    <section class="center-column">
        <div class="center-svg-g1">
            <svg width="100%" height="100%" viewBox="0 0 540 540" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="coreBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.8"/>
                        <stop offset="50%" stop-color="#7928ca" stop-opacity="0.3"/>
                        <stop offset="100%" stop-color="#ff0080" stop-opacity="0.8"/>
                    </linearGradient>
                    <filter id="glowNeon" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
                    </filter>
                </defs>
                <circle cx="270" cy="270" r="150" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="32" />
                <circle cx="270" cy="270" r="185" fill="none" stroke="rgba(0, 242, 254, 0.12)" stroke-width="1.5" stroke-dasharray="4 8" />
                ${chartComponents.outerArcsHtml}
                ${chartComponents.mainSegmentsHtml}
                ${chartComponents.innerLabelsHtml}
                ${chartComponents.calloutsHtml}
                <g filter="url(#softShadow)">
                    <circle cx="270" cy="270" r="85" fill="#090a10" stroke="url(#coreBorderGrad)" stroke-width="2" />
                    <text x="270" y="252" fill="rgba(255, 255, 255, 0.45)" font-size="10" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="2" text-anchor="middle">MODULES XP</text>
                    <text x="270" y="278" fill="#ffffff" font-size="26" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" filter="drop-shadow(0 0 8px rgba(0,242,254,0.4))">${xPtotal}</text>
                    <text x="270" y="296" fill="#00f2fe" font-size="11" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1" text-anchor="middle">kB TOTAL</text>
                </g>
            </svg>
        </div>
    </section>

    <aside class="side-column-right">
        <div class="card audit-card-v2">
            <div class="audit-card-header">
                <div class="audit-icon-wrapper">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38ef7d" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                </div>
                <span class="audit-badge-tag">AUDIT RATIO</span>
            </div>
            <div class="audit-chart-container">
                ${auditSvg}
            </div>
        </div>
    </aside>
</div>
`;

    Logout();
}

async function GraphAudit() {
    const rawData = await GetData('audit');
    const transactions = rawData?.data?.transaction || [];

    let totalUp = 0, totalDown = 0, ratio = 0;

    transactions.forEach((t) => {
        if (t.type === 'up') totalUp += t.amount;
        if (t.type === 'down') totalDown += t.amount;
        if (t.user?.auditRatio !== undefined) ratio = t.user.auditRatio;
    });

    if (!ratio && totalDown > 0) ratio = totalUp / totalDown;

    return {
        upMB: (totalUp / 1000000).toFixed(2),
        downMB: (totalDown / 1000000).toFixed(2),
        ratio: Number(ratio).toFixed(1)
    };
}

function generateAuditSvg(audit) {
    const upMB = parseFloat(audit?.upMB) || 0;
    const downMB = parseFloat(audit?.downMB) || 0;
    const ratio = parseFloat(audit?.ratio) || 0;

    const ratioColor = ratio >= 1.0 ? "#38ef7d" : "#ff0080";
    const statusText = ratio >= 1.0 ? "OPTIMAL" : "CRITICAL";

    const barsData = [
        { label: "DONE", subLabel: "UPLOAD", valText: `${upMB} MB`, rawVal: upMB, front: "#00f2fe", side: "#00778a", top: "#80f9ff", glow: "#00f2fe" },
        { label: "RECEIVED", subLabel: "DOWNLOAD", valText: `${downMB} MB`, rawVal: downMB, front: "#ffb703", side: "#c79004", top: "#f6c447", glow: "#ffb703" }
    ];

    const maxVal = Math.max(upMB, downMB, 1);
    const maxHeight = 105, y0 = 245, barWidth = 48, dx = 14, dy = 12, startX = 75, gap = 70;

    const barsHtml = barsData.map((bar, index) => {
        const h = Math.max(22, (bar.rawVal / maxVal) * maxHeight);
        const x = startX + index * (barWidth + gap);

        return `
            <g class="bar-3d-group">
                <ellipse cx="${x + barWidth / 2 + dx / 2}" cy="${y0 + 2}" rx="${barWidth / 1.3}" ry="6" fill="${bar.glow}" opacity="0.25" filter="blur(6px)" />
                <path d="M ${x} ${y0 - h} L ${x + barWidth} ${y0 - h} L ${x + barWidth + dx} ${y0 - h - dy} L ${x + dx} ${y0 - h - dy} Z" fill="${bar.top}" opacity="0.9" />
                <path d="M ${x + barWidth} ${y0} L ${x + barWidth + dx} ${y0 - dy} L ${x + barWidth + dx} ${y0 - h - dy} L ${x + barWidth} ${y0 - h} Z" fill="${bar.side}" opacity="0.95" />
                <path d="M ${x} ${y0} L ${x + barWidth} ${y0} L ${x + barWidth} ${y0 - h} L ${x} ${y0 - h} Z" fill="${bar.front}" />
                <text x="${x + (barWidth + dx) / 2}" y="${y0 - h - dy - 12}" fill="${bar.front}" font-size="11" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" style="filter: drop-shadow(0 0 6px ${bar.glow});">${bar.valText}</text>
                <text x="${x + barWidth / 2}" y="${y0 + 25}" fill="#ffffff" font-size="12" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" letter-spacing="0.5">${bar.label}</text>
                <text x="${x + barWidth / 2}" y="${y0 + 39}" fill="rgba(255, 255, 255, 0.45)" font-size="9" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" letter-spacing="1">${bar.subLabel}</text>
            </g>`;
    }).join('');

    return `
<svg width="100%" height="100%" viewBox="0 0 320 310" preserveAspectRatio="xMidYMid meet">
    <defs>
        <filter id="ratioGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
    </defs>
    <g transform="translate(160, 42)">
        <line x1="-120" y1="0" x2="-40" y2="0" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3 3"/>
        <line x1="40" y1="0" x2="120" y2="0" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3 3"/>
        <text x="0" y="-8" fill="rgba(255, 255, 255, 0.45)" font-size="9" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" letter-spacing="1.5">RATIO SCORE</text>
        <text x="0" y="16" fill="${ratioColor}" font-size="24" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" filter="url(#ratioGlow)">${ratio}</text>
        <text x="0" y="30" fill="${ratioColor}" font-size="8" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle" letter-spacing="1">${statusText}</text>
    </g>
    <line x1="30" y1="${y0}" x2="290" y2="${y0}" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" stroke-dasharray="4 4" />
    ${barsHtml}
</svg>`;
}

function generateSvgChart(groupsData) {
    const cx = 270, cy = 270, radius = 135, circumference = 2 * Math.PI * radius;
    const outerRadius = 170, outerCircumference = 2 * Math.PI * outerRadius;
    const colors = ['#00f2fe', '#ff0080', '#a855f7', '#38ef7d', '#ffb703', '#3b82f6', '#ec4899', '#10b981'];

    let currentAngle = -90, colorIndex = 0;
    let mainSegmentsHtml = '', outerArcsHtml = '', innerLabelsHtml = '', calloutsHtml = '';

    const calloutList = [];

    groupsData.forEach((data, moduleName) => {
        const name = (!moduleName || moduleName === "undefined" || !moduleName.trim()) ? "others" : moduleName;
        if (data.percentage <= 0) return;

        const color = colors[colorIndex % colors.length];
        const angle = data.angle;
        const midAngle = currentAngle + angle / 2;
        const rad = (midAngle * Math.PI) / 180;
        const gap = groupsData.size > 1 ? 6 : 0;
        const dashLength = Math.max(0, (data.percentage / 100) * circumference - gap);
        const outerDash = Math.max(0, (data.percentage / 100) * outerCircumference - 10);

        mainSegmentsHtml += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="28" stroke-linecap="round" stroke-dasharray="${dashLength} ${circumference}" transform="rotate(${currentAngle} ${cx} ${cy})" filter="url(#glowNeon)" opacity="0.95"><title>${name}: ${Math.round(data.percentage)}% (${Math.round(data.amount / 1000)} kB)</title></circle>`;
        outerArcsHtml += `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${outerDash} ${outerCircumference}" transform="rotate(${currentAngle} ${cx} ${cy})" opacity="0.5"/>`;

        if (data.percentage >= 5) {
            innerLabelsHtml += `<text x="${cx + radius * Math.cos(rad)}" y="${cy + radius * Math.sin(rad)}" fill="#ffffff" font-size="11" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.9);">${Math.round(data.percentage)}%</text>`;
        }

        const p0X = cx + (radius + 16) * Math.cos(rad);
        const p0Y = cy + (radius + 16) * Math.sin(rad);
        const p1X = cx + (outerRadius + 8) * Math.cos(rad);
        const p1Y = cy + (outerRadius + 8) * Math.sin(rad);
        const isRight = p1X >= cx;

        calloutList.push({
            name,
            amount: data.amount,
            percentage: data.percentage,
            color,
            p0X,
            p0Y,
            p1X,
            p1Y,
            adjustedY: p1Y,
            isRight
        });

        currentAngle += angle;
        colorIndex++;
    });

    const resolveOverlaps = (items) => {
        items.sort((a, b) => a.p1Y - b.p1Y);
        const minGap = 28;
        const minY = 30, maxY = 510;

        for (let i = 1; i < items.length; i++) {
            if (items[i].adjustedY < items[i - 1].adjustedY + minGap) {
                items[i].adjustedY = items[i - 1].adjustedY + minGap;
            }
        }

        if (items.length > 0 && items[items.length - 1].adjustedY > maxY) {
            items[items.length - 1].adjustedY = maxY;
            for (let i = items.length - 2; i >= 0; i--) {
                if (items[i].adjustedY > items[i + 1].adjustedY - minGap) {
                    items[i].adjustedY = items[i + 1].adjustedY - minGap;
                }
            }
        }
    };

    const rightCallouts = calloutList.filter(c => c.isRight);
    const leftCallouts = calloutList.filter(c => !c.isRight);

    resolveOverlaps(rightCallouts);
    resolveOverlaps(leftCallouts);

    calloutList.forEach(c => {
        const p2X = c.p1X + (c.isRight ? 20 : -20);
        const p2Y = c.adjustedY;
        const badgeX = p2X + (c.isRight ? 6 : -6);

        calloutsHtml += `
        <g class="chart-callout">
            <circle cx="${c.p0X}" cy="${c.p0Y}" r="2" fill="${c.color}" filter="url(#glowNeon)"/>
            <path d="M ${c.p0X} ${c.p0Y} L ${c.p1X} ${p2Y} L ${p2X} ${p2Y}" fill="none" stroke="${c.color}" stroke-width="1.2" opacity="0.75"/>
            <circle cx="${p2X}" cy="${p2Y}" r="2.5" fill="${c.color}" />
            <text x="${badgeX}" y="${p2Y - 4}" fill="#ffffff" font-size="11" font-weight="700" font-family="'Syne', sans-serif" text-anchor="${c.isRight ? 'start' : 'end'}">${c.name}</text>
            <text x="${badgeX}" y="${p2Y + 10}" fill="${c.color}" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="${c.isRight ? 'start' : 'end'}">${Math.round(c.amount / 1000)} kB (${Math.round(c.percentage)}%)</text>
        </g>`;
    });

    return { mainSegmentsHtml, outerArcsHtml, innerLabelsHtml, calloutsHtml };
}

async function Graph1() {
    const data = await GetData('Graph1');
    const transactions = data?.data?.transaction || [];
    const groupsData = new Map();
    let totalVal = 0;

    transactions.forEach((i) => {
        const key = i.object?.attrs || "others";
        const amount = i.amount || 0;
        groupsData.set(key, (groupsData.get(key) || 0) + amount);
        totalVal += amount;
    });

    groupsData.forEach((amount, mod) => {
        const percentage = totalVal > 0 ? (amount / totalVal) * 100 : 0;
        const angle = totalVal > 0 ? (amount / totalVal) * 360 : 0;
        groupsData.set(mod, { amount, percentage, angle });
    });

    return groupsData;
}