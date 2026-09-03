export function processGraph1Data(transactions) {
    const groupsData = new Map();
    let totalVal = 0;

    transactions.forEach((i) => {
        const key = i.object?.attrs?.language || i.object?.attrs || "others";
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
};


export function generateSvgChart(groupsData) {
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
        <g>
            <circle cx="${c.p0X}" cy="${c.p0Y}" r="2" fill="${c.color}" filter="url(#glowNeon)"/>
            <path d="M ${c.p0X} ${c.p0Y} L ${c.p1X} ${p2Y} L ${p2X} ${p2Y}" fill="none" stroke="${c.color}" stroke-width="1.2" opacity="0.75"/>
            <circle cx="${p2X}" cy="${p2Y}" r="2.5" fill="${c.color}" />
            <text x="${badgeX}" y="${p2Y - 4}" fill="#ffffff" font-size="11" font-weight="700" font-family="'Syne', sans-serif" text-anchor="${c.isRight ? 'start' : 'end'}">${c.name}</text>
            <text x="${badgeX}" y="${p2Y + 10}" fill="${c.color}" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="${c.isRight ? 'start' : 'end'}">${Math.round(c.amount / 1000)} kB (${Math.round(c.percentage)}%)</text>
        </g>`;
    });

    return { mainSegmentsHtml, outerArcsHtml, innerLabelsHtml, calloutsHtml };
};