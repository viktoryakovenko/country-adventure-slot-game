import gameModel from "../model/GameModel";
import TextStyles from "../model/TextStyles";
import MainControl from "./MainControl";
import {ITextStyle, Text} from "@pixi/text";
import gsap from "gsap";

export default class GameTitle extends MainControl {
    public readonly gameTitle: Text;

    constructor(private title: string, style?: Partial<ITextStyle>) {
        super();
        style = style ?? TextStyles.GAME_LABEL;
        this.gameTitle = new Text(title, style);
        this.container.addChild(this.gameTitle);
        this.gameTitle.anchor.set(0.5, 0.5);
        window.addEventListener("beforeunload", () => {
            gameModel.unload(this);
        });
    }

    animate() {
        gsap.fromTo(this.gameTitle,
            {alpha: 0.4},
            {alpha: 1, ease: "sine.inOut", repeat: -1, yoyo: true, duration: 1}
        );
    }

    stopAnimate() {
        gsap.killTweensOf(this.gameTitle);
    }
}
