export interface VectorData {
    x: number;
    y: number;
}

export class Vector implements VectorData {
    public x: number;
    public y: number;

    constructor(x: VectorData | number, y?: number) {
        this.x = typeof x == "number" ? x : x.x;
        this.y = typeof x == "number" ? y ?? 0 : x.y;
    }

    data():VectorData {
        return {
            x: this.x, y: this.y,
        };
    }

    add(v: VectorData) {
        this.y = this.y + v.y;
        this.x = this.x + v.x;
        return this;
    }

    merge(v: VectorData) {
        this.y = (this.y + v.y)*0.5;
        this.x = (this.x + v.x)*0.5;
        return this;
    }

    sub(v: VectorData) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        return this;
    }

    scale(n: number) {
        this.x = this.x * n;
        this.y = this.y * n;
        return this;
    }

    scaleDown(n: number) {
        this.x = this.x / n;
        this.y = this.y / n;
        return this;
    }

    dotProduct(v: VectorData): number {
        return this.x * v.x + this.y * v.y;
    }

    project(v: Vector) {
        const normalized = v.clone().normalize();
        return normalized.scale(this.dotProduct(normalized));
    }

    copyFrom(v: VectorData) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }

    negate() {
        return this.scale(-1);
    }

    mult(v: VectorData) {
        this.x = this.x * v.x;
        this.y = this.y * v.y;
        return this;
    }

    div(v: VectorData) {
        this.x = this.x / v.x;
        this.y = this.y / v.y;
        return this;
    }

    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    normalize() {
        const m = this.mag();
        this.scaleDown(m);
        return this;
    }

    clone(): Vector {
        return new Vector(this);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export function distance(p1: {x: number, y: number}, p2: {x: number, y: number}): number {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function randomInt(upperBound: number) {
    return Math.floor(Math.random() * (upperBound + 1));
}
export function randomPointOnUnitCircle(): Vector {
    const angle = Math.random() * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    return new Vector(x, y);
}

