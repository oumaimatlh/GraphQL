export function processGraph1Data(modulesXP) {
    const groupsData = new Map();
    let totalVal = 0;

    modulesXP.forEach((i) => {
        const key = i.object?.attrs?.toLowerCase() || "others";
        const amount = i.amount || 0;
        groupsData.set(key, (groupsData.get(key) || 0) + amount);
        totalVal += amount;
    
    });

    groupsData.forEach((amount, mod) => {
        const percentage = (amount / totalVal) * 100 
        const angle = (amount / totalVal) * 360 
        groupsData.set(mod, { amount, percentage, angle });
    });
    console.log(groupsData)
    return groupsData;
};

export function generateSvgModules(groupsData) {
    const cx = 270, cy = 270, radius = 135, outerRadius = 170;
    const circumference = 2 * Math.PI * radius;
    const outerCircumference = 2 * Math.PI * outerRadius;

    const colors = ['#00f2fe', '#ff0080', '#a855f7', '#38ef7d', '#ffb703', '#3b82f6', '#ec4899', '#10b981'];

    const getPoint = (r, deg) => {
        // cette func sert a donner x, y position exact du point afin de dessiner ds le svg
        const rad = (deg * Math.PI) / 180;
        return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    };

    let currentAngle = -90, colorIndex = 0;
    let mainSegmentsHtml = '', outerArcsHtml = '', innerLabelsHtml = '';
    const calloutList = [];
    for (const [moduleName, data] of groupsData) {
        if (data.percentage <= 0) continue;
        const name = moduleName?.trim() && moduleName !== "undefined" ? moduleName : "others";
        const color = colors[colorIndex++ % colors.length];
        const midAngle = currentAngle + data.angle / 2; //Afin de deplacer le nom + prcnt en milieu d angle
        const pct = Math.round(data.percentage);
        const kb = Math.round(data.amount / 1000); // round pour eviter le decimal ect
        const gap = groupsData.size > 1 ? 6 : 0; //gap c est l espace qui est entre les segments du graph et paths ect
        const dash = Math.max(0, (data.percentage / 100) * circumference - gap); // pour chaque module on calculer la longueur du module qui represente le pourcentage de l angle total du graphb
        const outerDash = Math.max(0, (data.percentage / 100) * outerCircumference - 10); //Math.Max pour eviter les valeurs negatives si le pourcentage est trop petit


        mainSegmentsHtml += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="${color}" stroke-width="28" stroke-linecap="round" stroke-dasharray="${dash} ${circumference}" transform="rotate(${currentAngle} ${cx} ${cy})" filter="url(#glowNeon)" opacity="0.95"><title>${name}: ${pct}% (${kb} kB)</title></circle>`;
        outerArcsHtml += `<circle cx="${cx}" cy="${cy}" r="${outerRadius}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-dasharray="${outerDash} ${outerCircumference}" transform="rotate(${currentAngle} ${cx} ${cy})" opacity="0.5"/>`;
        if (data.percentage >= 5) {// cette condition permet d 'afficher le pourcentage au milieu d angle pour les modules qui ont un prcnt plus de 5 %
            const [x, y] = getPoint(radius, midAngle);
            innerLabelsHtml += `<text x="${x}" y="${y}" fill="#ffffff" font-size="11" font-weight="800" font-family="'Syne', sans-serif" text-anchor="middle" dominant-baseline="central" style="pointer-events: none; text-shadow: 0 2px 4px rgba(0,0,0,0.9);">${pct}%</text>`;
        }

        const [p0X, p0Y] = getPoint(radius + 16, midAngle);
        const [p1X, p1Y] = getPoint(outerRadius + 8, midAngle);

        calloutList.push({ name, color, pct, kb, p0X, p0Y, p1X, y: p1Y, isRight: p1X >= cx });
        currentAngle += data.angle;
    }


    const adjustY = (items) => {
        items.sort((a, b) => a.y - b.y);
        for (let i = 1; i < items.length; i++) {
            if (items[i].y < items[i - 1].y + 28) items[i].y = items[i - 1].y + 28;
        }
        if (items.length && items[items.length - 1].y > 510) {
            items[items.length - 1].y = 510;
            for (let i = items.length - 2; i >= 0; i--) {
                if (items[i].y > items[i + 1].y - 28) items[i].y = items[i + 1].y - 28;
            }
        }
    };
    adjustY(calloutList.filter(c => c.isRight));
    adjustY(calloutList.filter(c => !c.isRight));
    const calloutsHtml = calloutList.map(c => {
        const dir = c.isRight ? 1 : -1;
        const p2X = c.p1X + dir * 20;
        const badgeX = p2X + dir * 6; // name of module
        const align = c.isRight ? 'start' : 'end';
        return `<g>
                <circle cx="${c.p0X}" cy="${c.p0Y}" r="2" fill="${c.color}" filter="url(#glowNeon)"/>
                <path d="M ${c.p0X} ${c.p0Y} L ${c.p1X} ${c.y} L ${p2X} ${c.y}" fill="none" stroke="${c.color}" stroke-width="1.2" opacity="0.75"/>
                <circle cx="${p2X}" cy="${c.y}" r="2.5" fill="${c.color}" />
                <text x="${badgeX}" y="${c.y - 4}" fill="#ffffff" font-size="11" font-weight="700" font-family="'Syne', sans-serif" text-anchor="${align}">${c.name}</text>
                <text x="${badgeX}" y="${c.y + 10}" fill="${c.color}" font-size="10" font-weight="600" font-family="'Plus Jakarta Sans', sans-serif" text-anchor="${align}">${c.kb} kB (${c.pct}%)</text>
                </g>`;
    }).join('');
    return { mainSegmentsHtml, outerArcsHtml, innerLabelsHtml, calloutsHtml };
}