import {GameState} from "app/game/states/GameState";
import {TJumpingWild} from "app/server/service/typing";

export default class WildBonus1State extends GameState {
    private wildBonus1Symbols!: TJumpingWild[][];

    enable(): boolean {
        this.wildBonus1Symbols = this.getWildBonus1Symbols();
        return super.enable() && this.wildBonus1Symbols.length > 0;
    }

    async run(): Promise<GameState> {
        await this.gameSignals.reels.showWildBonus1Presentation.emit(this.wildBonus1Symbols).all();
        return this;
    }

    private getWildBonus1Symbols(): TJumpingWild[][] {
        return this.spinResponse.wildFeature.jumps
            .filter(jump => jump.length === 2);
    }
}
