import {GameState} from "app/game/states/GameState";
import {TJumpingWild} from "app/server/service/typing";

export default class WildBonus2State extends GameState {
    private readonly WILD_JUMPS = 3;

    enable(): boolean {
        const jumps = this.getWildJumps();
        return super.enable() && jumps.length > 0;
    }

    async run(): Promise<GameState> {
        const jumps = this.getWildJumps();
        const reelsSignals = this.gameSignals.reels;
        await reelsSignals.showWildBonus2Presentation.emit(jumps).all();
        return this;
    }

    private getWildJumps(): TJumpingWild[][] {
        const jumps = this.spinResponse.wildFeature.jumps
            .filter(jump => jump.length === this.WILD_JUMPS);
        return jumps;
    }
}
