import {State} from "app/stateMachine/State";
import {TGameStates} from "app/game/states/TGameStates";
import {Main} from "app/Main";
import gameModel from "app/model/GameModel";
import {TSpinResponse, TSpinResult} from "app/server/service/typing";
import {inject} from "app/model/injection/InjectDecorator";
import MainGameModel from "app/model/MainGameModel";

export abstract class GameState extends State<TGameStates> {
    @inject(MainGameModel)
    protected mainGameModel!: MainGameModel;

    protected readonly sceneManager = Main.MAIN.mainSceneManager;
    protected readonly gameSignals = gameModel.game.signals;
    protected spinResponse!: TSpinResult;

    async compose(): Promise<void> {
        await super.compose();
        this.gameSignals.data.spin.add(this.onSpinResponse, this);
        this.spinResponse = this.mainGameModel.spinResponse;
    }

    abstract run(): Promise<GameState>;

    protected onSpinResponse(spinResponse:TSpinResponse) {
        this.spinResponse = spinResponse;
    }

    async dispose(): Promise<void> {
        this.gameSignals.data.spin.unload(this);
        await super.dispose();
    }
}
