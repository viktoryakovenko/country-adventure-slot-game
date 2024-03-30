import BaseScene from "app/scenes/BaseScene";
import {inject} from "app/model/injection/InjectDecorator";
import {promiseDelay} from "app/helpers/TimeHelper";
import GameTitle from "app/controls/GameTitle";
import gameModel, {GameSize} from "app/model/GameModel";
import LayoutManager from "app/layoutManager/LayoutManager";
import introLayout, {introBackground} from "app/scenes/IntroGameScene.layout";
import TextStyles from "app/model/TextStyles";
import SpineControl from "app/controls/SpineControl";
import CentralizingExtension from "app/controls/extensions/CentralizingExtension";
import {Text} from "@pixi/text";

export default class IntroGameScene extends BaseScene {
    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;
    private readonly footerTitle: GameTitle = new GameTitle("", TextStyles.INTRO_GAME_FOOTER_TITLE);
    private readonly spineControl = new SpineControl("splash");
    private intervalId = -1;

    compose(): void {
        this.footerTitle.name("intro_footer");
        this.addControl(this.footerTitle);
        this.addControl(this.spineControl);
        this.spineControl.addExtension(new CentralizingExtension());
    }

    async activate() {
        await super.activate();
        this.layoutManager.addLayout(introLayout, introBackground);
        this.layoutManager.update(gameModel.gameSize);
        this.spineControl.play("idle", {loop: true});
        this.spineControl.play("aspect", {frameAt: 0, trackIndex: 1});
        const text = new Text(
            "COLLECT WILDS DURING MAIN \nAND FREE SPINS GAMES \nTO GET EXTRA WILDS ON REELS!",
            TextStyles.INTRO_FEATURE_CONTROL_TEXT
        );
        const text2 = new Text(
            "MATCH SYMBOLS ON THE REELS \nAND ON THE MAIN WHEEL \nTO GET THE BIG AND THE SUPER BIG WHEELS",
            TextStyles.INTRO_FEATURE_CONTROL_TEXT
        );
        text.anchor.set(0.5);
        text2.anchor.set(0.5);
        this.spineControl.replace("wild_description", text);
        this.spineControl.replace("wheels_description", text2);
        this.startSwipeInterval();
        this.onResize(gameModel.gameSize);
        const delay = __DEV__ ? 0 : 1500;
        await promiseDelay(delay);
        this.footerTitle.gameTitle.text = "TAP ANYWHERE TO START THE GAME";
        this.footerTitle.animate();
        window.document.body.addEventListener("click", this.onTapAnyWhere);
        window.document.body.addEventListener("pointerup", this.onTapAnyWhere);
        window.document.body.addEventListener("keyup", this.onKeyUp.bind(this));
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
        const aspect = gameSize.width / gameSize.height;
        const aspectTo = 1920 / 1080;
        const aspectAt = 1080 / 1920;
        const frameAt = (Math.max(Math.min(aspectTo, aspect), aspectAt) - aspectAt) / (aspectTo - aspectAt);
        this.spineControl.play("aspect", {frameAt: 1 - frameAt, trackIndex: 1});
    }

    async deactivate() {
        this.footerTitle.gameTitle.text = "";
        this.layoutManager.removeLayout(introLayout);
        this.footerTitle.stopAnimate();
        clearInterval(this.intervalId);
        await super.deactivate();
    }

    private onKeyUp(event:KeyboardEvent):void{
        if(event.keyCode == 32){
            event.stopImmediatePropagation();
        }
        this.onTapAnyWhere();
    }

    private onTapAnyWhere = () => {
        window.document.body.removeEventListener("click", this.onTapAnyWhere);
        window.document.body.removeEventListener("pointerup", this.onTapAnyWhere);
        window.document.body.removeEventListener("keyup", this.onKeyUp);
        gameModel.firstUserInteractionPromise.resolve();
    };

    private startSwipeInterval() {
        let counter = 0;
        this.intervalId = setInterval(()=>{
            this.spineControl.play(`swipe${(counter++%2)+1}`, {trackIndex: 2, timeScale: 2.5});
        }, 5000);
    }
}
