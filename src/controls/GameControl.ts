import MainControl from "app/controls/MainControl";
import ReelsControl from "app/controls/reels/ReelsControl";
import LinesControl from "app/controls/reels/LinesControl";
import {TMainGameInfo} from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import MotionLayerControl from "app/controls/motion/view/MotionLayerControl";
import {ReelsBackgroundExtension} from "app/controls/reels/ReelsBackgroundExtension";
import SpineControl from "app/controls/SpineControl";
import {Container} from "@pixi/display";

export default class GameControl extends SpineControl {
    @inject(MotionLayerControl)
    private readonly motionLayer!: MotionLayerControl;
    readonly reelsControl: ReelsControl;
    readonly linesControl: LinesControl = new LinesControl();
    readonly topLayer: MainControl = new class extends MainControl {};
    readonly boundsWidth = 1410;
    readonly boundsHeight = 866;

    constructor(private mainGameInfo: TMainGameInfo) {
        super("reels");
        this.addExtension(new ReelsBackgroundExtension());
        this.reelsControl = new ReelsControl(this.mainGameInfo);
        this.setBounds(this.boundsWidth, this.boundsHeight);
    }

    init() {
        super.init();
        this.replace("reels_content", this.reelsControl.container);
        this.reelsControl.reels.forEach((value, index) => {
            const container = new Container();
            this.replace(`reels_content${index+1}`, container);
            container.addChild(value.container);
            value.container.x = 0;
        });
        this.play("idle", {loop: true});
        this.add(this.linesControl);
        this.add(this.topLayer);
    }
}
