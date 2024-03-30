import {GameState} from "app/game/states/GameState";

export class FinalSpinsState extends GameState {
    async run(): Promise<GameState> {
        await this.gameSignals.reels.updateAnimation.emit("idle").all();
        return this;
    }
}
