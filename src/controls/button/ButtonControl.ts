import MainControl, {PivotType} from "./../MainControl";
import {GlowFilter} from "@pixi/filter-glow";
import {ColorMatrixFilter} from "@pixi/filter-color-matrix";
import Signal from "app/helpers/signals/signal/Signal";
import {Container} from "@pixi/display";
import {Filter, Texture} from "@pixi/core";
import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export type ButtonControlOptions = {hoverColor: number, strokeColor: number, align: PivotType, target: unknown};

export interface IButtonControl<T extends IButtonControl<T>> {
    readonly onClick: Signal<T>;
}

export default class ButtonControl extends MainControl implements IButtonControl<ButtonControl> {
    public readonly onClick: Signal<ButtonControl> = new Signal<ButtonControl>();
    public readonly target: unknown;

    private readonly button: Container;
    private readonly sepiaColorFilter: ColorMatrixFilter;
    private readonly additionalFilters: Array<Filter> = [];
    private readonly glowFilter: GlowFilter;

    constructor(texture: Texture | Container | string, protected opt?: Partial<ButtonControlOptions>) {
        super();
        opt = opt ? opt : {};
        this.opt = opt;
        opt.hoverColor = opt.hoverColor === undefined ? 0xffffff : opt.hoverColor;
        opt.strokeColor = opt.strokeColor??0xaeaeae;
        opt.align = opt.align === undefined ? PivotType.TL : opt.align;
        this.target = opt.target;
        if (typeof texture == "string") {
            texture = StrictResourcesHelper.getSomeTexture(texture);
        }
        this.button = texture instanceof Container ? texture : new Sprite(<Texture>texture);
        this.glowFilter = new GlowFilter({
            color: opt.strokeColor??0xcecece, outerStrength: 50, distance: 10, quality: 0.3,
        });
        this.sepiaColorFilter = new ColorMatrixFilter();
        this.sepiaColorFilter.sepia(false);

        // this.button.hitArea = new Polygon(getCirclePolygons(this.button.width * .5, 10));

        this.container.addChild(this.button);
        this.setPivotTo(this.button, opt.align);
        this.container.filters = [this.glowFilter];
    }

    init() {
        super.init();
        this.container.on("pointerover", () => {
            this.onOver();
        });
        this.container.on("pointerout", () => {
            this.onOut();
        });
        this.container.on("pointerdown", () => {
            this.onClicked();
        });
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
    }

    protected onClicked() {
        if (this.isEnable()) {
            this.onClick.emit(this);
        }
    }

    protected onOut() {
        this.glowFilter.color = this.opt?.strokeColor??0xcecece;
    }

    protected onOver() {
        this.glowFilter.color = this.opt?.hoverColor??0xcecece;
    }

    set hitArea(value: IHitArea) {
        this.button.hitArea = value;
    }

    isEnable() {
        return this.button.alpha === 1;
    }

    enable() {
        this.button.alpha = 1;
        this.container.filters = [this.glowFilter];
        this.container.eventMode = "static";
        this.container.cursor = "pointer";
    }

    disable() {
        if (this.button.alpha === 1) {
            this.container.eventMode = "auto";
            this.container.cursor = "default";
            this.container.filters = [this.sepiaColorFilter, this.glowFilter, ...this.additionalFilters];
            this.button.alpha = 0.5;
        }
    }

    addFilter(filter: Filter) {
        this.additionalFilters.push(filter);
        this.container.filters = [...this.additionalFilters];
    }
}
// todo: after new api of pixi will be released;
// For now it is not export
interface IHitArea {
    contains(x: number, y: number): boolean;
}
