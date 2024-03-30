import ParticleControl from "app/controls/particles/ParticleControl";
import {Main} from "app/Main";
import {easeInSine01} from "app/helpers/MathUtils";

export default class BackgroundParticleControl extends ParticleControl {
    constructor() {
        super({
            lifetime: {min: 4, max: 10},
            frequency: 1,
            spawnChance: 1,
            particlesPerWave: 20,
            maxParticles: 1000,
            pos: {x: Main.APP.screen.width / 2, y: Main.APP.screen.height / 2},
            autoUpdate: true,
            behaviors: [
                {
                    type: "spawnShape",
                    config: {
                        type: "torus", data: {x: 0, y: 0, radius: Main.APP.screen.height},
                    },
                },

                {
                    type: "blendMode",
                    config: {
                        "blendMode": "add",
                    },
                },
                {
                    type: "rotationStatic",
                    config: {
                        min: 0,
                        max: 180,
                    },
                },
                {
                    type: "movePath",
                    config: {
                        path: "sin(x/10) * x / 15",
                        speed: {
                            list: [
                                {value: 10, time: 0}, {value: 50, time: 1},
                            ],
                            ease: (value : number) => {
                                return easeInSine01(value);
                            },
                        },
                        minMult: 0.1,
                    },
                },
                {
                    type: "alpha",
                    config: {
                        alpha: {
                            list: [
                                {value: 0, time: 0}, {value: 1, time: .5}, {value: 0, time: 1},
                            ],
                            ease: (value : number) => {
                                return easeInSine01(value);
                            },
                        },
                    },
                },
                {
                    type: "scale",
                    config: {
                        scale: {
                            list: [
                                {value: 0, time: 0}, {value: 1, time: .7}, {value: 0, time: 1},
                            ],
                            ease: (value : number) => {
                                return easeInSine01(value);
                            },
                        },
                    },
                },
            ],
        });
    }
}
