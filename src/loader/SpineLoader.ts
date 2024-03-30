import {AtlasAttachmentLoader, SkeletonJson, SkeletonData, Spine} from "@pixi-spine/runtime-4.0";
import {RenderTexture, Texture} from "@pixi/core";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import {TextureAtlas} from "pixi-spine";
import {SpineData} from "app/loader/SpineData";


export default class SpineLoader {
    private static REPLACE_TEXTURE: Texture = RenderTexture.create({width: 100, height: 100});

    static init(texture: Texture) {
        this.REPLACE_TEXTURE = texture;
    }
    static CACHE: { [key: string]: SpineData } = {};

    static SLOTS_RESOURCES_MAP: { [key: string]: string } = {
        "atlases/background/bg_main": "bg.png",
    };
    static TEXTURE_MAP: { [key: string]: string } = {
        intro_symbols: "symbols",
        paytable_page: "symbols",
        paylines: "winline",
    };

    static getSpine(name: string, textureName: string = name): Spine {
        const spineData = SpineLoader.getSpineData(this.CACHE[name], this.TEXTURE_MAP[textureName] ?? textureName);
        return new Spine(spineData);
    }

    private static getSpineData(spineData: SpineData, textureName: string): SkeletonData {
        const textures = this.getSpineTexturesMap(spineData, textureName);
        return this.buildSkeleton(textures, spineData);
    }

    private static buildSkeleton(texturesCache: { [key: string]: Texture }, jsonData: unknown): SkeletonData {
        const spineAtlas = new TextureAtlas();
        spineAtlas.addTextureHash(texturesCache, true);
        const spineAtlasLoader = new AtlasAttachmentLoader(spineAtlas);
        const spineJsonParser = new SkeletonJson(spineAtlasLoader);
        return spineJsonParser.readSkeletonData(jsonData);
    }

    public static updateTextures(name: string): SkeletonData {
        const spineJson = this.CACHE[name];
        const textures = this.getSpineTexturesMap(spineJson, name);
        return this.buildSkeleton(textures, spineJson);
    }

    private static getSpineTexturesMap(spineJson: SpineData, textureName: string): { [key: string]: Texture } {
        const res: { [key: string]: Texture } = {};
        const imageNames = this.getImageNames(spineJson);

        for (const name of imageNames) {
            res[name] = this.getSpineTextures(name, textureName);
        }
        return res;
    }

    private static getSpineTextures(name: string, textureName: string): Texture {
        if (name.includes("mask")) {
            return SpineLoader.REPLACE_TEXTURE;
        }
        let result: Texture | null;
        const strictResourcesHelper = StrictResourcesHelper;
        const resourceName = this.SLOTS_RESOURCES_MAP[name] ?? name;
        result = strictResourcesHelper.getAnTexture(resourceName);// Assets.get(name);
        if (!result && strictResourcesHelper.getAnTexture(`${resourceName}.png`)) {
            result = strictResourcesHelper.getAnTexture(`${resourceName}.png`);
        } else if (resourceName.indexOf("atlases") >= 0) {
            result = strictResourcesHelper.getAnTexture(resourceName.replace("atlases/", ""));
            if (!result) {
                result = strictResourcesHelper.getAnTexture(resourceName.replace(/.*\//, "") + ".png");
            }
        }
        if (!result) {
            result = strictResourcesHelper.getAnTexture(resourceName.replace(textureName + "/", "") + ".png");
        }
        if (!result) {
            result = SpineLoader.REPLACE_TEXTURE;
            console.warn("Resource not found, make sure this is lazy loaded", `[${name}]`);
        }
        return result;
    }

    private static getImageNames(json: SpineData): Array<string> {
        const images: Array<string> = [];
        if (json.skins) {
            const skins = json.skins;
            for (let i = 0; i < skins.length; i++) {
                const skin = skins[i];
                if (!skin.attachments) continue;
                for (const attachmentName of Object.keys(skin.attachments)) {
                    const attachment = skin.attachments[attachmentName];
                    for (const attachmentPartName of Object.keys(attachment)) {
                        const attachmentPart = attachment[attachmentPartName];
                        if (attachmentPart && attachmentPart.type == "boundingbox") {
                            continue;
                        }
                        let imageName: string;
                        if (attachmentPart && attachmentPart.name) {
                            imageName = attachmentPart.name;
                        } else if (attachmentPart && attachmentPart.path) {
                            imageName = attachmentPart.path;
                        } else {
                            imageName = attachmentPartName;
                        }
                        if (images.indexOf(imageName) == -1) {
                            images.push(imageName);
                        }
                    }
                }
            }
        }
        return images;
    }

    static async preLoad() {
        return import(/* webpackChunkName: "preloadSpineData" */ "./PreloadSpineDataStorage").then(value => {
            Object.assign(this.CACHE, value.default.CACHE);
        });
    }

    static async load() {
        return import(/* webpackChunkName: "allSpineData" */ "./SpineDataStorage").then(value => {
            Object.assign(this.CACHE, value.default.CACHE);
        });
    }
}
