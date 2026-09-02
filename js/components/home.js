import { router } from "../router.js";
import { generateAuditSvg, processAuditData } from "./graphAudit.js";
import { generateSvgChart, processGraph1Data } from "./graphXPModule.js";
import { Logout } from "./logout.js";


export async function Home(rawData) {

    if (!localStorage.getItem('token')) {
        router('/')
        return
    }

    const data = rawData?.data || {};

    const user = data.user?.[0] || { firstName: "", lastName: "", login: "" };
    const level = data.level?.[0]?.amount || 0;
    const xPtotal = Math.round((data.XP?.aggregate?.sum?.amount || 0 )/ 1000);
    const cohort = user?.events?.[0]?.cohorts?.[0]?.labelName || "No Cohort";

    const xpAmountModule = processGraph1Data(data.xpModule || []);
    const chartComponents = generateSvgChart(xpAmountModule);

    const auditData = processAuditData(data.audit || []);
    const auditSvg = generateAuditSvg(auditData);
    const main = document.getElementById('content');

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
        <div style="display: flex; align-items: center; gap: 10px;">
            <span class="brand-badge">${user.login}</span>
            
            <div style="
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
