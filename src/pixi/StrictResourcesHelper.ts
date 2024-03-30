import {Texture} from "@pixi/core";
import {Assets} from "@pixi/assets";

export default class StrictResourcesHelper {
    static getAnTexture(textureId: string): Texture | null {
        return Assets.cache.has(textureId) ? Assets.cache.get(textureId) : null;
    }

    static getSomeTexture(textureId: string): Texture {
        return Assets.get(textureId);
    }

    static load(alias: string, textureId: string): Promise<Texture> {
        return new Promise((resolve, reject) => {
            Assets.load(alias)
                .then(() => resolve(StrictResourcesHelper.getSomeTexture(textureId)))
                .catch(error => reject(error));
        });
    }

    static getTexture(spriteSheetId: string, textureId: string): Texture {
        return Assets.get(spriteSheetId).texture[textureId];
    }

    static getSingleTexture(textureId: string): Texture {
        return Assets.get(textureId);
    }

    static async getAnimation(spritesheetId: string, animationId: string): Promise<Texture[]> {
        return (await Assets.load(spritesheetId)).animation[animationId];
    }
}
