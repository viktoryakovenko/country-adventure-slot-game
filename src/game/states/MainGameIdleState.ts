import {GameState} from "app/game/states/GameState";
import MainGameScene from "app/scenes/MainGameScene";
import gameModel from "app/model/GameModel";
import {inject} from "app/model/injection/InjectDecorator";
import UserModel from "app/model/UserModel";

export default class MainGameIdleState extends GameState {
    @inject(UserModel)
    private userModel!: UserModel;
    async activate(): Promise<void> {
        await super.activate();
        this.gameSignals.ui.spinButton.clicked.add(async () => {
            await this.goto("spinState");
            await this.goto("spinStopState");
            await this.goto("wildBonus1State");
            await this.goto("wildBonus2State");
            await this.goto("winLineState");
            await this.goto("scatterWinState");
            await this.goto("freeSpinsIntroState");
            await this.goto("freeSpinsState");
            await this.goto("freeSpinsOutroState");
            await this.goto("winPresentationState");
            await this.goto("finalState");
            await this.goto("mainGameState");
        }, this);
        this.gameSignals.autoplay.changed.add(() => {
            this.goto("autoPlayState");
        }, this);
        this.gameSignals.ui.options.info.show.add(() => {
            this.goto("paytableState");
        }, this);
        gameModel.game.signals.infobar.start.emit();
    }

    async run(): Promise<GameState> {
        await this.sceneManager.navigate(MainGameScene);
        this.gameSignals.ui.enableControls.emit();
        return this;
    }

    async deactivate(): Promise<void> {
        gameModel.game.signals.infobar.stop.emit();
        this.gameSignals.ui.disableControls.emit();
        this.gameSignals.ui.showWin.emit({win: 0});
        this.userModel.betChanged.unload(this);
        this.gameSignals.ui.spinButton.clicked.unload(this);
        this.gameSignals.autoplay.changed.unload(this);
        this.gameSignals.ui.options.info.show.unload(this);
        await super.deactivate();
    }
}
