import { GetData } from "./api.js";
import { Logout } from "./logout.js";

export async function Home() {

    let user = await GetData('user');
    let level = await GetData('level');
    let xPtotal = await GetData('XP');

    user = user.data.user[0];
    level = level.data.transaction[0].amount;
    xPtotal = xPtotal.data.transaction_aggregate.aggregate.sum.amount;
    xPtotal = Math.round(xPtotal / 1000); 

    let XPAmountModule = await Graph1();
    let chartComponents = generateSvgChart(XPAmountModule);

    let skillsData = await Graph2();
    let chart3DHtml = generate3DBarChart(skillsData);

    let main = document.getElementById('content');
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

                <div class="header-title">
                    <span class="brand-badge">${user.login}</span>
                </div>

                <div class="header-actions">
                    <div class="status-indicator">
                        <span class="dot"></span> Online
                    </div>
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
                        <div class="level-display">
                            <span class="level-number">${level}</span>
                        </div>
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
                        <span class="xp-badge-tag">Event 41</span>
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
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            
                            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6"/>
                            </filter>
                        </defs>

                        <!-- Piste HUD arrière-plan (Agrandie) -->
                        <circle cx="270" cy="270" r="150" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="32" />
                        <circle cx="270" cy="270" r="185" fill="none" stroke="rgba(0, 242, 254, 0.12)" stroke-width="1.5" stroke-dasharray="4 8" />

                        <!-- Arcs extérieurs stylisés -->
                        ${chartComponents.outerArcsHtml}

                        <!-- Anneau Donut Principal -->
                        ${chartComponents.mainSegmentsHtml}

                        <!-- Pourcentages intégrés -->
                        ${chartComponents.innerLabelsHtml}

                        <!-- Pointeurs Laser et Textes -->
                        ${chartComponents.calloutsHtml}

                        <!-- Noyau Central HUD (Agrandi) -->
                        <g filter="url(#softShadow)">
                            <circle cx="270" cy="270" r="85" fill="#090a10" stroke="url(#coreBorderGrad)" stroke-width="2" />
                            <text x="270" y="252" fill="rgba(255, 255, 255, 0.45)" font-size="10" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="2" text-anchor="middle">MODULES XP</text>
                            <text x="270" y="278" fill="#ffffff" font-size="26" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" filter="drop-shadow(0 0 8px rgba(0,242,254,0.4))">${xPtotal}</text>
                            <text x="270" y="296" fill="#00f2fe" font-size="11" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1" text-anchor="middle">kB TOTAL</text>
                        </g>
                    </svg>
                </div>
            </section>

            <!-- Section Latérale Droite (Nouveau Graphique 3D) -->
            <aside class="side-column-right">
                <div class="card skills-card-v2">
                    <div class="skills-card-header">
                        <div class="skills-icon-wrapper">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                            </svg>
                        </div>
                        <span class="skills-badge-tag">SKILLS BREAKDOWN</span>
                    </div>
                    <div class="skills-chart-container">
                        ${chart3DHtml}
                    </div>
                </div>
            </aside>

        </div>
    `;

    Logout();
}

function generateSvgChart(groupsData) {
    const cx = 270, cy = 270;
    const radius = 135; 
    const circumference = 2 * Math.PI * radius; 
    
    const outerRadius = 170; 
    const outerCircumference = 2 * Math.PI * outerRadius;

    const colors = ['#00f2fe', '#ff0080', '#a855f7', '#38ef7d', '#ffb703', '#3b82f6'];

    let currentAngle = -90;
    let mainSegmentsHtml = '';
    let outerArcsHtml = '';
    let innerLabelsHtml = '';
    let calloutsHtml = '';
    let colorIndex = 0;

    groupsData.forEach((data, moduleName) => {
        if (!moduleName || moduleName === "undefined" || moduleName.trim() === "") {
            moduleName = "others";
        }
        if (data.percentage <= 0) return;

        const color = colors[colorIndex % colors.length];
        const angle = data.angle;
        const midAngle = currentAngle + angle / 2;
        const rad = (midAngle * Math.PI) / 180;

        const gap = groupsData.size > 1 ? 6 : 0;
        const dashLength = Math.max(0, (data.percentage / 100) * circumference - gap);

        mainSegmentsHtml += `
            <circle
                cx="${cx}" cy="${cy}" r="${radius}"
                fill="none"
                stroke="${color}"
                stroke-width="28"
                stroke-linecap="round"
                stroke-dasharray="${dashLength} ${circumference}"
                transform="rotate(${currentAngle} ${cx} ${cy})"
                filter="url(#glowNeon)"
                opacity="0.95"
            >
                <title>${moduleName}: ${Math.round(data.percentage)}% (${Math.round(data.amount / 1000)} kB)</title>
            </circle>
        `;

        const outerDash = Math.max(0, (data.percentage / 100) * outerCircumference - 10);
        outerArcsHtml += `
            <circle
                cx="${cx}" cy="${cy}" r="${outerRadius}"
                fill="none"
                stroke="${color}"
                stroke-width="2"
                stroke-linecap="round"
                stroke-dasharray="${outerDash} ${outerCircumference}"
                transform="rotate(${currentAngle} ${cx} ${cy})"
                opacity="0.5"
            />
        `;

        if (data.percentage >= 5) {
            const labelX = cx + radius * Math.cos(rad);
            const labelY = cy + radius * Math.sin(rad);
            innerLabelsHtml += `
                <text 
                    x="${labelX}" y="${labelY}" 
                    fill="#ffffff" font-size="11" font-weight="800" 
                    font-family="'Syne', sans-serif" text-anchor="middle" dominant-baseline="central"
                    style="pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.9);"
                >
                    ${Math.round(data.percentage)}%
                </text>
            `;
        }

        const p0X = cx + (radius + 16) * Math.cos(rad);
        const p0Y = cy + (radius + 16) * Math.sin(rad);

        const p1X = cx + (outerRadius + 8) * Math.cos(rad);
        const p1Y = cy + (outerRadius + 8) * Math.sin(rad);

        const isRight = p1X >= cx;
        const p2X = p1X + (isRight ? 20 : -20);
        const p2Y = p1Y;

        const badgeX = p2X + (isRight ? 6 : -6);

        calloutsHtml += `
            <g class="chart-callout">
                <circle cx="${p0X}" cy="${p0Y}" r="2" fill="${color}" filter="url(#glowNeon)"/>
                <path d="M ${p0X} ${p0Y} L ${p1X} ${p1Y} L ${p2X} ${p2Y}" fill="none" stroke="${color}" stroke-width="1.2" opacity="0.75"/>
                <circle cx="${p2X}" cy="${p2Y}" r="2.5" fill="${color}" />

                <text x="${badgeX}" y="${p2Y - 4}" fill="#ffffff" font-size="11" font-weight="700" font-family="'Syne', sans-serif" text-anchor="${isRight ? 'start' : 'end'}">
                    ${moduleName}
                </text>
                <text x="${badgeX}" y="${p2Y + 10}" fill="${color}" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="${isRight ? 'start' : 'end'}">
                    ${Math.round(data.amount / 1000)} kB (${Math.round(data.percentage)}%)
                </text>
            </g>
        `;

        currentAngle += angle;
        colorIndex++;
    });

    return { mainSegmentsHtml, outerArcsHtml, innerLabelsHtml, calloutsHtml };
}

function generate3DBarChart(skillsMap) {
    const svgWidth = 340;
    const svgHeight = 300;
    const padding = { top: 40, right: 25, bottom: 65, left: 25 };
    const chartWidth = svgWidth - padding.left - padding.right;
    const chartHeight = svgHeight - padding.top - padding.bottom;

    const skills = Array.from(skillsMap, ([name, value]) => ({ name, value }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 6);

    const maxVal = Math.max(...skills.map(s => s.value), 1);
    const barWidth = 20;
    const depth = 8;
    const gap = (chartWidth - (skills.length * (barWidth + depth))) / (skills.length + 1);

    const colors = [
        { front: '#00f2fe', top: '#80f9ff', side: '#00b3bd' },
        { front: '#ff0080', top: '#ff80c0', side: '#b30059' },
        { front: '#a855f7', top: '#d8b4fe', side: '#7e22ce' },
        { front: '#38ef7d', top: '#9bfabf', side: '#1d9e4e' },
        { front: '#ffb703', top: '#ffdb80', side: '#b38002' },
        { front: '#3b82f6', top: '#93c5fd', side: '#1d4ed8' }
    ];

    let barsHtml = '';

    skills.forEach((skill, index) => {
        const color = colors[index % colors.length];
        const h = Math.max((skill.value / maxVal) * chartHeight, 4);
        const x = padding.left + gap + index * (barWidth + depth + gap);
        const y = padding.top + chartHeight - h;

        // Front Face
        const front = `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" fill="${color.front}" opacity="0.85" />`;

        // Top Face (Isometric polygon)
        const topPoly = `${x},${y} ${x + depth},${y - depth} ${x + barWidth + depth},${y - depth} ${x + barWidth},${y}`;
        const top = `<polygon points="${topPoly}" fill="${color.top}" />`;

        // Side Face (Isometric polygon)
        const sidePoly = `${x + barWidth},${y} ${x + barWidth + depth},${y - depth} ${x + barWidth + depth},${y + h - depth} ${x + barWidth},${y + h}`;
        const side = `<polygon points="${sidePoly}" fill="${color.side}" />`;

        const textX = x + (barWidth + depth) / 2;

        barsHtml += `
            <g class="bar-3d-group">
                ${front}
                ${side}
                ${top}
                <text x="${textX}" y="${y - depth - 6}" fill="${color.front}" font-size="10" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle">${skill.value}</text>
                <text x="${textX}" y="${padding.top + chartHeight + 20}" fill="#ffffff" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle">${skill.name}</text>
            </g>
        `;
    });

    return `
        <svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">
            <!-- Grille de fond en perspective 3D -->
            <line x1="${padding.left}" y1="${padding.top + chartHeight}" x2="${svgWidth - padding.right}" y2="${padding.top + chartHeight}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" />
            <line x1="${padding.left + depth}" y1="${padding.top + chartHeight - depth}" x2="${svgWidth - padding.right + depth}" y2="${padding.top + chartHeight - depth}" stroke="rgba(255, 255, 255, 0.05)" stroke-width="1" stroke-dasharray="3 3" />
            
            ${barsHtml}
        </svg>
    `;
}

async function Graph1(){
    let data = await GetData('Graph1');
    let groupsData = new Map();

    data.data.transaction.forEach((i)=>{
        groupsData.set(i.object.attrs, [...groupsData.get(i.object.attrs) || [], i.amount]);
    });

    for (let [mod, _] of groupsData){
        let totalAmountModule = groupsData.get(mod).reduce((total, amount)=>{
            return total += amount;
        }, 0);
        groupsData.set(mod, totalAmountModule);
    }

    let totalVal = 0;
    for (let [mod, amount] of groupsData) {
        totalVal += amount;
    }

    for (let [mod, amount] of groupsData) {
        const percentage = amount / totalVal * 100;
        const angle = amount / totalVal * 360;

        groupsData.set(mod, { amount, percentage, angle });
    }

    return groupsData;
}

async function Graph2(){
    let data = await GetData('Graph2');
    let skillsMap = new Map();

    if (data && data.data && data.data.transaction) {
        data.data.transaction.forEach((item) => {
            let skillName = item.type.replace('skill_', '').toUpperCase();
            skillsMap.set(skillName, (skillsMap.get(skillName) || 0) + item.amount);
        });
    }

    return skillsMap;
}