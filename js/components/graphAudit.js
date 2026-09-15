
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
}



export function generateAuditSvg(audit) {
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
            <g>
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
