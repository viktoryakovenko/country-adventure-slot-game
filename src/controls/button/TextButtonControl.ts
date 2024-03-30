// noinspection JSUnusedGlobalSymbols

import ButtonControl, {ButtonControlOptions} from "app/controls/button/ButtonControl";
import {Container} from "@pixi/display";
import {Graphics} from "@pixi/graphics";
import {ITextStyle, Text} from "@pixi/text";
import {PivotType} from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import {ScaleHelper} from "app/helpers/ScaleHelper";

export type TextButtonControlOptions =
    {
        paddingX: number; paddingY: number;
        radiusFactor: number;
        target: unknown;
        style: Partial<ITextStyle>
    }
    & ButtonControlOptions;

/**
 * Primitive button container with text label
 */
export default class TextButtonControl extends ButtonControl {
    protected label: Text;
    protected graphics: Graphics;
    protected readonly opt: Partial<TextButtonControlOptions>;

    constructor(text: string, opt?: Partial<TextButtonControlOptions>) {
        opt = opt ? opt : {};
        opt.paddingX = opt.paddingX === undefined ? 20 : opt.paddingX;
        opt.paddingY = opt.paddingY === undefined ? 20 : opt.paddingY;
        opt.radiusFactor = opt.radiusFactor === undefined ? 0.25 : opt.radiusFactor;
        opt.style = opt.style === undefined ? {} : opt.style;
        opt.align = opt.align ? opt.align : PivotType.C;
        const container = new Container();
        const label = new Text(text, opt.style);
        const graphics = new Graphics();
        graphics.beginFill(0xcecece);
        graphics.drawRoundedRect(0, 0,
            label.width + opt.paddingX, label.height + opt.paddingY,
            Math.min(label.width, label.height) * opt.radiusFactor);
        graphics.endFill();
        container.addChild(graphics);
        container.addChild(label);
        label.anchor.set(0.5);
        label.position.set(
            graphics.width / 2,
            graphics.height / 2,
        );
        super(container, opt);
        this.label = label;
        this.graphics = graphics;
        this.opt = opt;
        setTimeout(() => {
            gameModel.updateLayout.add(this.onResize, this, 1);
        }, 1000);
        this.onResize();
    }

    private onResize() {
        const graphics = this.graphics;
        const label = this.label;
        const opt = this.opt;
        const width = this.container.width;
        const height = this.container.height;
        graphics.clear();
        graphics.beginFill(0xcecece);
        graphics.drawRoundedRect(0, 0,
            width, height,
            Math.min(width, height) * (opt.radiusFactor ?? 0.25));
        graphics.endFill();
        label.position.set(
            graphics.width / 2,
            graphics.height / 2,
        );
        ScaleHelper.scaleToSizeIn(this.label, {
            width: graphics.width - (this.opt.paddingX ?? 20),
            height: graphics.height - (this.opt.paddingY ?? 20),
        });
        this.container.scale.set(1);
    }

    dispose() {
        gameModel.updateLayout.unload(this);
    }
}
