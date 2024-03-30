import SpineControl from "app/controls/SpineControl";
import gameModel from "app/model/GameModel";
import GameSignals from "app/model/GameSignals";

export default class CharacterControl extends SpineControl {
    private readonly gameSignals: GameSignals = gameModel.game.signals;

    constructor() {
        super("character");
    }

    init(): void {
        super.init();
        this.playIdleAnimation();
        this.container.interactive = true;
        this.container.cursor = "pointer";
        this.gameSignals.popup.fsIntro.hidden.add(this.playWinAnimation, this);
        this.container.addEventListener("click", this.playGreetingsAnimation);
        this.container.addEventListener("touchstart", this.playGreetingsAnimation);
    }

    dispose(): void {
        this.gameSignals.popup.fsIntro.hidden.remove(this.playWinAnimation);
        this.container.removeEventListener("click", this.playGreetingsAnimation);
        this.container.removeEventListener("touchstart", this.playGreetingsAnimation);
    }

    private playWinAnimation = (): void => {
        this.play("win", {loop: false, timeScale: 0.6}).then(this.playIdleAnimation);
    };

    private playGreetingsAnimation = (): void => {
        this.play("greetings", {loop: false}).then(this.playIdleAnimation);
    };

    private playIdleAnimation = (): void => {
        this.play("idle", {loop: true, timeScale: 0.9});
    };
}
