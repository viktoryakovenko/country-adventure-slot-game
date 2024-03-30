import {Main} from "app/Main";
import IntroGameScene from "app/scenes/IntroGameScene";
import gameModel from "app/model/GameModel";
import {State} from "app/stateMachine/State";
import {TGameStates} from "app/game/states/TGameStates";
import MainGameIdleState from "app/game/states/MainGameIdleState";
import SpinState from "app/game/states/SpinState";
import SpinStopState from "app/game/states/SpinStopState";
import ScatterWinState from "app/game/states/ScatterWinState";
import WinLineState from "app/game/states/WinLineState";
import WinState from "app/game/states/WinState";
import PaytableState from "app/game/states/PaytableState";
import AutoPlayState from "app/game/states/AutoPlayState";
import FreeSpinsIntroState from "app/game/states/freespins/FreeSpinsIntroState";
import FreeSpinsOutroState from "app/game/states/freespins/FreeSpinsOutroState";
import FreeSpinsState from "app/game/states/freespins/FreeSpinsState";
import FreeSpinsScatterWinState from "app/game/states/freespins/FreeSpinsScatterWinState";
import FreeSpinsLinesWinState from "app/game/states/freespins/FreeSpinsLinesWinState";
import FreeSpinsWinState from "app/game/states/freespins/FreeSpinsWinState";
import FreeSpinsStopState from "app/game/states/freespins/FreeSpinsStopState";
import ReSpinsState from "app/game/states/freespins/ReSpinsState";
import {FinalSpinsState} from "app/game/states/FinalSpinsState";
import {CountryAdventureAnticipationReelsProvider, SmartAnticipationReelsProvider} from "app/game/AnticipationReelsProvider";
import {TSymbolId} from "app/server/service/typing";
import WildBonus2State from "app/game/states/WildBonus2State";
import WildBonus1State from "app/game/states/WildBonus1State";
import FreeSpinsWildBonus1State from "app/game/states/freespins/FreeSpinsWildBonus1State";
import FreeSpinsWildBonus2State from "app/game/states/freespins/FreeSpinsWildBonus2State";

export default class IntroState extends State<TGameStates> {
    async run(): Promise<this> {
        const sceneManager = Main.MAIN.mainSceneManager;
        await sceneManager.navigate(IntroGameScene);
        await [
            gameModel.firstUserInteractionPromise,
            gameModel.ready,
        ].promise().all();
        await this.setupGameState();
        gameModel.setForceMode(gameModel.isForce);
        return this;
    }

    private async setupGameState() {
        const anticipationReelsProvider = new CountryAdventureAnticipationReelsProvider(
            gameModel.mainGameInfo.reels.amount,
            TSymbolId.SCATTER,
            3,
            [0, 2, 4]
        );
        await this.addState("mainGameState", new MainGameIdleState());
        await this.addState("spinState", new SpinState());
        await this.addState("spinStopState", new SpinStopState(anticipationReelsProvider));
        await this.addState("scatterWinState", new ScatterWinState());
        await this.addState("winLineState", new WinLineState());
        await this.addState("winPresentationState", new WinState());
        await this.addState("paytableState", new PaytableState());
        await this.addState("autoPlayState", new AutoPlayState());
        await this.addState("freeSpinsIntroState", new FreeSpinsIntroState());
        await this.addState("freeSpinsOutroState", new FreeSpinsOutroState());
        await this.addState("freeSpinsState", new FreeSpinsState());
        await this.addState("fsScatterWinState", new FreeSpinsScatterWinState());
        await this.addState("fsWildBonus1State", new FreeSpinsWildBonus1State());
        await this.addState("fsWildBonus2State", new FreeSpinsWildBonus2State());
        await this.addState("fsLinesWinState", new FreeSpinsLinesWinState());
        await this.addState("fsWinState", new FreeSpinsWinState());
        await this.addState("fsSpinStopState", new FreeSpinsStopState(anticipationReelsProvider));
        await this.addState("reSpinsState", new ReSpinsState());
        await this.addState("finalState", new FinalSpinsState());
        await this.addState("wildBonus1State", new WildBonus1State());
        await this.addState("wildBonus2State", new WildBonus2State());
    }
}
