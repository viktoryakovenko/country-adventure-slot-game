/* eslint-disable max-len */
import {Layout, LayoutPlugin} from "app/layoutManager/LayoutManager";
import {Graphics} from "@pixi/graphics";
import {Container} from "@pixi/display";
import {Text} from "@pixi/text";

export default class DevPixiDrawLayoutPlugin implements LayoutPlugin {
    private readonly graphics: Graphics;

    constructor(protected stage: Container) {
        this.graphics = new Graphics();
    }

    update(layout: Layout): void {
        const graphics = this.graphics;
        graphics.lineStyle(5, 0xff0000, .5);
        graphics.beginFill(0x00ff00, .125);
        if (layout.uid == "") {
            this.drawLayout(layout);
        }
    }

    beforeUpdate(): void {
        const graphics = this.graphics;
        this.stage.addChild(graphics);
        graphics.clear();
        graphics.removeChildren();
    }

    afterUpdate(): void {}

    private drawLayout(layout: Layout) {
        const graphics = this.graphics;
        const finalLayout = layout.finalLayout;
        graphics.drawRect(
            finalLayout.x,
            finalLayout.y,
            finalLayout.width,
            finalLayout.height
        );
        const showSize = false;
        const size = showSize ? `[x:${finalLayout.x}, y:${finalLayout.y}, w:${finalLayout.width}, h:${finalLayout.height}, ]` : "";
        const text = new Text(` ${layout.name} ${size}\n`, {
            stroke: "white",
            strokeThickness: 1,
        });
        this.graphics.addChild(text);
        text.position.set(
            finalLayout.x,
            finalLayout.y,
        );
        layout.layouts.forEach(value => {
            this.drawLayout(value);
        });
    }

    dispose(): void {
        this.graphics.clear();
        this.graphics.removeChildren();
    }
}
