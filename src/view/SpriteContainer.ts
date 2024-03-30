import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";

export default class SpriteContainer extends Sprite {
    constructor(spriteSheetId: string, textureId?: string) {
        const texture = textureId ?
            StrictResourcesHelper.getTexture(spriteSheetId, textureId) :
            StrictResourcesHelper.getSomeTexture(spriteSheetId);
        super(texture);
    }
}
