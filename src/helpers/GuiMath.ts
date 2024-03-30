import {Point} from "@pixi/math";

export function getCirclePolygons(opt:{
    radius:number,
    steps:number,
    startAngle?:number,
    paddingX?:number,
    paddingY?:number,
    precision?:number,
}):Array<number> {
    const radius:number = opt.radius;
    const steps:number = opt.steps;
    const startAngle:number = opt.startAngle ? opt.startAngle : 0.0;
    const paddingX:number = opt.paddingX ? opt.paddingX : 0.0;
    const paddingY:number = opt.paddingY ? opt.paddingY : 0.0;
    const precision:number = opt.precision ? opt.precision : 1e2;
    const polygons:Array<number> = [];
    let angle = startAngle;
    const angleStep = 2 * Math.PI / steps;
    for (let i = 0; i < steps; i++) {
        const point = new Point(Math.cos(angle) * radius, Math.sin(angle) * radius);
        polygons.push(Math.round((point.x + radius + paddingX) * precision) / precision);
        polygons.push(Math.round((point.y + radius + paddingY) * precision) / precision);
        angle += angleStep;
    }
    return polygons;
}

export function hexToRgb(hex:string):RGB {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        throw new Error(`cannot convert hex: ${hex} to RGBa`);
    }
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    };
}

export type RGB = {
    r:number;
    g:number;
    b:number;
    a?:number;
};
