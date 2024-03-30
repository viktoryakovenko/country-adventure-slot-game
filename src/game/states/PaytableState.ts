import {GameState} from "app/game/states/GameState";
import gameModel from "app/model/GameModel";

export default class PaytableState extends GameState {
    async activate(): Promise<void> {
        await super.activate();
        this.gameSignals.ui.options.info.hide.add(() => {
            gameModel.game.signals.paytableHide.emit();
            this.goto("mainGameState");
        }, this);
        this.gameSignals.reels.stopAllAnimations.emit();
    }

    async run(): Promise<GameState> {
        gameModel.game.signals.paytableShow.emit();
        return this;
    }

    async deactivate(): Promise<void> {
        this.gameSignals.reels.updateAnimation.emit("idle");
        this.gameSignals.ui.options.info.hide.unload(this);
        await super.deactivate();
    }
}
