import MainControl from "app/controls/MainControl";
import {ParticleContainer} from "pixi.js";
import {Emitter} from "@pixi/particle-emitter";
import {EmitterConfigV3} from "@pixi/particle-emitter/lib/EmitterConfig";
import {Texture} from "@pixi/core";

export default class ParticleControl extends MainControl {
    private readonly config : EmitterConfigV3;
    private emitter! : Emitter;

    constructor(config: EmitterConfigV3) {
        super(new ParticleContainer());
        this.config = config;
    }

    public initParticleSystem(texture : Texture) : void {
        this.config.behaviors.push({
            type: "textureSingle",
            config: {
                texture,
            },
        });
        this.emitter = new Emitter(this.container, this.config);
    }

    public startEmitting() : void {
        this.emitter.emit = true;
    }

    public stopEmitting() : void {
        this.emitter.emit = false;
    }
}
