
export function processAuditData(transactions) {
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
};

export function generateAuditSvg(audit = {}) {
    const up = +audit.upMB || 0;
    const down = +audit.downMB || 0;
    const ratio = +audit.ratio || 0;

    const isOptimal = ratio >= 1.0;
    const color = isOptimal ? "#38ef7d" : "#ff0080";
    const maxVal = Math.max(up, down, 1);

    const bars = [
        { label: "DONE", sub: "UP", val: up, color: "#00f2fe", x: 80 },
        { label: "RECEIVED", sub: "DOWN", val: down, color: "#ffb703", x: 190 }
    ];

    const barsHtml = bars.map(({ label, sub, val, color, x }) => {
        const h = Math.max(10, (val / maxVal) * 110);
        const cx = x + 25;
        const y = 230 - h;
        
        return `
            <g font-family="'Plus Jakarta Sans', sans-serif" text-anchor="middle">
                <rect x="${x}" y="${y}" width="50" height="${h}" fill="${color}" rx="6" />
                <text x="${cx}" y="${y - 10}" fill="${color}" font-size="11" font-weight="800" font-family="'Syne', sans-serif">${val} MB</text>
                <text x="${cx}" y="252" fill="#ffffff" font-size="12" font-weight="800" letter-spacing="0.5">${label}</text>
                <text x="${cx}" y="266" fill="rgba(255, 255, 255, 0.45)" font-size="9" font-weight="700" letter-spacing="1">${sub}</text>
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

    <g transform="translate(160, 42)" text-anchor="middle">
        <line x1="-120" y1="0" x2="-40" y2="0" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3 3"/>
        <line x1="40" y1="0" x2="120" y2="0" stroke="rgba(255, 255, 255, 0.1)" stroke-dasharray="3 3"/>
        <text y="-8" fill="rgba(255, 255, 255, 0.45)" font-size="9" font-weight="700" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1.5">RATIO SCORE</text>
        <text y="16" fill="${color}" font-size="24" font-weight="800" font-family="'Syne', sans-serif" filter="url(#ratioGlow)">${ratio}</text>
        <text y="30" fill="${color}" font-size="8" font-weight="800" font-family="'Plus Jakarta Sans', sans-serif" letter-spacing="1">${isOptimal ? "OPTIMAL" : "CRITICAL"}</text>
    </g>

    <line x1="30" y1="230" x2="290" y2="230" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.5" stroke-dasharray="4 4" />
    ${barsHtml}
</svg>`;
}