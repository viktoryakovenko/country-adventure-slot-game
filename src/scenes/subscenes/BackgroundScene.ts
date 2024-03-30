import BaseScene from "app/scenes/BaseScene";
import BackgroundControl, {BackgroundShadowControl} from "app/controls/BackgroundControl";
import gameModel from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {backgroundLayout, shadowLayout} from "app/scenes/subscenes/BackgroundScene.layout";
import {TBackgroundType} from "app/model/GameSignals";
import OnResizeExtension from "app/controls/extensions/OnResizeExtension";
import SpineLazyAssetsUpdateExtension from "app/controls/extensions/SpineLazyAssetsUpdateExtension";
import {ShakeExtension} from "app/controls/extensions/ShakeExtension";
import gameConfig from "res/configs/gameConfig.json";
import BackgroundParticleControl from "app/controls/particles/BackgroundParticleControl";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";


export default class BackgroundScene extends BaseScene {
    protected readonly backgroundControl: BackgroundControl = new BackgroundControl();
    protected readonly shadowControl = new BackgroundShadowControl();
    protected readonly backgroundParticleControl = new BackgroundParticleControl();

    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;

    compose(): void {
        gameModel.game.signals.background.show.add(this.onShowBackground, this);
        gameModel.game.signals.background.hide.add(this.onHideBackground, this);
        this.addControl(this.backgroundControl.name("background"));
        this.addControl(this.shadowControl);
        this.addControl(this.backgroundParticleControl);
        this.backgroundControl.addExtension(new SpineLazyAssetsUpdateExtension("background", "vfx"));
        this.backgroundControl.addExtension(new SpineLazyAssetsUpdateExtension("background", "background"));
        this.backgroundControl.addExtension(new ShakeExtension({
            speedFactorUpdate: gameModel.game.signals.speedFactorUpdate,
            shakeSignal: gameModel.game.signals.reels.shake,
        }, gameConfig.animations.backShaking));
        this.shadowControl.addExtension(new OnResizeExtension());
    }

    activate() {
        super.activate();
        StrictResourcesHelper.load("background", "particle_firefly.png").then(texture => {
            this.backgroundParticleControl.initParticleSystem(texture);
            this.backgroundParticleControl.startEmitting();
        });
        this.layoutManager.addLayout(backgroundLayout);
        this.layoutManager.addLayout(shadowLayout);
        this.shadowControl.moveBottom();
        this.backgroundControl.moveBottom();
        this.scene.parent?.addChildAt(this.scene, 0);
    }

    deactivate() {
        this.backgroundParticleControl.stopEmitting();
        this.layoutManager.removeLayout(backgroundLayout);
        this.layoutManager.removeLayout(shadowLayout);
        gameModel.game.signals.background.show.unload(this);
        gameModel.game.signals.background.hide.unload(this);
        super.deactivate();
    }

    private async changeBackground(type: TBackgroundType) {
        switch (type) {
            case "intro":
                await this.backgroundControl.setBackground("main");
                break;
            case "main":
                await this.backgroundControl.setBackground("main");
                break;
            case "fs":
                await this.backgroundControl.setBackground("freespin");
                break;
            case "dark":
                await this.backgroundControl.setBackground("main");
                break;
        }
    }

    private async onShowBackground(type: TBackgroundType, resolve?: () => void) {
        this.changeBackground(type);
        await pgsap.to(this.backgroundControl.container, {alpha: 1});
        resolve?.();
    }

    private async onHideBackground(_: void, resolve?: () => void) {
        await pgsap.to(this.backgroundControl.container, {alpha: 0});
        resolve?.();
    }
}
