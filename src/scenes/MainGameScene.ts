import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import SceneManager from "app/scenes/SceneManager";
import ReelScene from "app/scenes/subscenes/ReelScene";
import BetPanelScene from "app/scenes/subscenes/BetPanelScene";
import gameModel, {GameSize} from "app/model/GameModel";
import EmptyScene from "app/scenes/EmptyScene";
import LayoutManager from "app/layoutManager/LayoutManager";
import mainGameLayout, {grassLayout} from "app/scenes/MainGameScene.layout";
import PopupScene from "app/scenes/subscenes/PopupScene";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import {SpriteControl} from "app/controls/SpriteControl";
import OnResizeExtension from "app/controls/extensions/OnResizeExtension";
import {ShakeExtension} from "app/controls/extensions/ShakeExtension";
import gameConfig from "res/configs/gameConfig.json";
import PaytableScene from "app/scenes/PaytableScene";
import GrassControl from "app/controls/grass/GrassControl";

export default class MainGameScene extends BaseScene {
    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;
    @inject(MotionLayerControl, () => {
        const motionLayerControl = new MotionLayerControl();
        motionLayerControl.addExtension(new OnResizeExtension());
        return motionLayerControl;
    })
    private readonly motionLayer!: MotionLayerControl;
    private readonly grassControl: GrassControl = new GrassControl();
    private readonly logoControl: SpriteControl = new SpriteControl(
        "logo.png",
        {x: 0.5, y: 0.5},
    );
    private readonly paytableSceneManager = new SceneManager(this.app, false);
    private readonly reelSceneManager = new SceneManager(this.app, false);
    private readonly betPanelSceneManager = new SceneManager(this.app, false);
    private readonly popupSceneManager = new SceneManager(this.app, false);

    async compose(): Promise<void> {
        this.addControl(this.logoControl.name("logo"));
        this.addControl(this.grassControl.name("grass"));
        this.logoControl.addExtension(new ShakeExtension({
            speedFactorUpdate: gameModel.game.signals.speedFactorUpdate,
            shakeSignal: gameModel.game.signals.reels.shake,
        }, gameConfig.animations.logoShaking));
        await gameModel.ready;
    }

    async activate() {
        super.activate();
        await this.paytableSceneManager.navigate(EmptyScene);
        await this.reelSceneManager.navigate(ReelScene);
        // await this.betPanelSceneManager.navigate(gameModel.isMobile ? BetPanelScene : DesktopBetPanelScene);
        await this.betPanelSceneManager.navigate(BetPanelScene);
        await this.popupSceneManager.navigate(PopupScene);
        this.motionLayer.name("motionLayer");
        this.scene.parent.addChild(this.motionLayer.container);
        this.motionLayer.moveTop();
        gameModel.game.signals.background.show.emit("main");
        // gameModel.isMobile ?
        //     this.layoutManager.addLayout(...mainGameLayout.commonLayouts, mainGameLayout.layouts) :
        //     this.layoutManager.addLayout(desktopLayout);
        this.layoutManager.addLayout(...mainGameLayout.commonLayouts, mainGameLayout.layouts);
        this.layoutManager.addLayout(grassLayout);
        this.layoutManager.update(gameModel.gameSize);
        gameModel.game.signals.paytableShow.add(()=>{
            this.paytableSceneManager.navigate(PaytableScene);
        }, this);
        gameModel.game.signals.paytableHide.add(()=>{
            this.paytableSceneManager.navigate(EmptyScene);
        }, this);
    }

    async deactivate() {
        await this.reelSceneManager.navigate(EmptyScene);
        await this.betPanelSceneManager.navigate(EmptyScene);
        await this.popupSceneManager.navigate(EmptyScene);
        await this.paytableSceneManager.navigate(EmptyScene);
        gameModel.game.signals.paytableShow.unload(this);
        gameModel.game.signals.paytableHide.unload(this);
        this.layoutManager.removeLayout(...mainGameLayout.commonLayouts, mainGameLayout.layouts);
        await super.deactivate();
    }

    dispose() {
        gameModel.game.signals.infobar.show.unload(this);
        gameModel.game.signals.infobar.hide.unload(this);
        gameModel.game.signals.infobar.stop.unload(this);
        gameModel.game.signals.infobar.start.unload(this);
        this.reelSceneManager.dispose();
        this.betPanelSceneManager.dispose();
        this.popupSceneManager.dispose();
        super.dispose();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
    }
}
