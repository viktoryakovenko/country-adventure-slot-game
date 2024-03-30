import {Renderer, Texture} from "@pixi/core";
import {Rectangle} from "@pixi/math";
import {SCALE_MODES} from "@pixi/constants";
import {Graphics} from "@pixi/graphics";

export function getCircleTexture(renderer:Renderer, radius:number, color = 0xff0000, alpha = 1):Texture {
    const circle = getCircle(radius, color, alpha);
    const rectangle = new Rectangle(-radius-2, -radius-2, radius * 2, radius * 2);
    return renderer.generateTexture(circle, {
        region: rectangle,
        scaleMode: SCALE_MODES.LINEAR,
        multisample: 10,
    });
}

export function getCircle(radius:number, color = 0xff0000, alpha = 1):Graphics {
    const result:Graphics = new Graphics();
    result.beginFill(color, alpha);
    result.drawCircle(0, 0, radius);
    result.endFill();
    return result;
}

export function getRect(w:number, h:number, color = 0xff0000, alpha = 1):RoundRect {
    return new RoundRect(w, h, 0, color, alpha);
}

export class RoundRect extends Graphics {
    private __width = 0;
    private __height = 0;
    private _radius = 0;
    private _bgColor = 0;
    private _alpha = 0;

    constructor(width:number, height:number, radius = 5, bgColor = 0xebeced, alpha = 1) {
        super();
        this
            .updateWidth(width)
            .updateHeight(height)
            .updateRadius(radius)
            .updateBgColor(bgColor)
            .updateAlpha(alpha);
        this.update();
    }

    update():RoundRect {
        this.clear();
        this.beginFill(this._bgColor, this._alpha);
        this.drawRoundedRect(0, 0, this.__width, this.__height, this._radius);
        this.endFill();
        this.x = 0;
        this.y = 0;
        return this;
    }

    updateWidth(value:number):RoundRect {
        this.__width = value;
        return this;
    }

    updateHeight(value:number):RoundRect {
        this.__height = value;
        return this;
    }

    updateRadius(value:number):RoundRect {
        this._radius = value;
        return this;
    }

    updateBgColor(value:number):RoundRect {
        this._bgColor = value;
        return this;
    }

    updateAlpha(value:number):RoundRect {
        this._alpha = value;
        return this;
    }
}
