import MainControl from "app/controls/MainControl";
import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export class SpriteControl extends MainControl {
    protected readonly sprite: Sprite;

    constructor(private textureId: string, anchor?: {x: number, y: number}) {
        super(new Sprite(StrictResourcesHelper.getSomeTexture(textureId)));
        this.sprite = this.container as Sprite;
        anchor = anchor ?? {x: 0, y: 0};
        this.sprite.anchor.copyFrom(anchor);
    }

    get texture():string {
        return this.textureId;
    }

    set texture(textureId: string) {
        this.textureId = textureId;
        this.sprite.texture = StrictResourcesHelper.getSomeTexture(textureId);
    }
}
