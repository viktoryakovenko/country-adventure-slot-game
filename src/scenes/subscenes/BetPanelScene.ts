import BaseScene from "app/scenes/BaseScene";
import SpinBtnControl from "app/controls/button/SpinBtnControl";
import LayoutManager from "app/layoutManager/LayoutManager";
import {inject} from "app/model/injection/InjectDecorator";
import gameModel, {GameSize} from "app/model/GameModel";
import BalanceControl from "app/controls/ui/BalanceControl";
import TotalBetControl from "app/controls/ui/TotalBetControl";
import WinControl from "app/controls/ui/WinControl";
import OptionsBtnControl from "app/controls/button/OptionsBtnControl";
import AutoplayControl from "app/controls/AutoplayControl";
import OptionsControl from "app/controls/OptionsControl";
import BetModel from "app/model/BetModel";
import UserModel from "app/model/UserModel";
import {AutoplayButtonControl} from "app/controls/button/AutoplayButtonControl";
import LabelControl from "app/controls/ui/LabelControl";
import {SpriteControl} from "app/controls/SpriteControl";
import FreeSpinModel from "app/model/FreeSpinModel";
import ControlShowerExtension from "app/controls/extensions/ControlShowerExtension";
import {MessageBarControl} from "app/controls/MessageBarControl";
import infoMessageBarConfig from "res/configs/infoMessageBarConfig.json";
import GlowFilterExtension from "app/controls/extensions/GlowFilterExtension";
import BetControl from "app/controls/BetControl";
import BetSelectorBtnsControl from "app/controls/button/BetSelectorBtnsControl";
import CharacterControl from "app/controls/character/CharacterControl";

export default class BetPanelScene extends BaseScene {
    @inject(LayoutManager)
    private layoutManager!: LayoutManager;
    @inject(BetModel)
    private betModel!: BetModel;
    @inject(UserModel)
    private userModel!: UserModel;
    @inject(FreeSpinModel)
    private freeSpinsModel!: FreeSpinModel;
    private optionsBtnControl: OptionsBtnControl = new OptionsBtnControl();
    private autoplayControl: AutoplayControl = new AutoplayControl(gameModel.mainGameInfo.autoPlays);
    private spinBtnControl: SpinBtnControl = new SpinBtnControl();
    private balanceLabelControl: LabelControl = new BalanceControl("BALANCE");
    private totalBetControl: LabelControl = new TotalBetControl("BET");
    private winControl: LabelControl = new WinControl("WIN");
    private optionsControl: OptionsControl = new OptionsControl();
    private betControl: BetControl = new BetControl(gameModel.mainGameInfo.bets);
    private betSelector: BetSelectorBtnsControl = new BetSelectorBtnsControl(
        gameModel.mainGameInfo.bets,
        this.betControl
    );
    private autoplayButton: AutoplayButtonControl = new AutoplayButtonControl();
    private plank: SpriteControl = new SpriteControl("balance_field.png");
    private readonly messageBarControl: MessageBarControl = new MessageBarControl(
        infoMessageBarConfig.gameInfo,
        infoMessageBarConfig.updateFrequency,
    );
    private readonly characterControl = new CharacterControl();

    async compose() {
        const autoplayButton = this.autoplayButton;
        const betSelector = this.betSelector;
        const optionsControl = this.optionsControl;
        const betControl = this.betControl;
        const autoplaySelector = this.autoplayControl;
        const spinBtnControl = this.spinBtnControl;
        const balanceLabelControl = this.balanceLabelControl;
        const totalBetControl = this.totalBetControl;
        const winControl = this.winControl;
        const optionsBtnControl = this.optionsBtnControl;
        this.addControl(this.plank.name("footer"));
        this.addControl(autoplayButton.name("autoplay_btn"));
        this.addControl(betSelector.name("bet_chooser"));
        this.addControl(autoplaySelector.name("autoplay_selector"));
        this.addControl(spinBtnControl.name("spin_btn"));
        this.addControl(balanceLabelControl.name("balance_label"));
        this.addControl(totalBetControl.name("total_bet"));
        this.addControl(winControl.name("win_label"));
        this.addControl(optionsBtnControl.name("options_btn"));
        this.addControl(this.messageBarControl.name("messageBar"));
        this.addControl(optionsControl.name("options_selector"));
        this.addControl(betControl.name("bet_options_selector"));
        this.addControl(this.characterControl.name("character"));
        this.characterControl.setBounds(1, 1);
        spinBtnControl.disable();
        await gameModel.ready;
        const userStats = gameModel.mainGameInfo.userStats;
        this.betControl.betChanged.add(this.onBetChanged, this);
        balanceLabelControl.setValue(userStats.balance);
        winControl.setValue(0);
        betSelector.updateBetIndex(gameModel.mainGameInfo.userStats.betId);
        spinBtnControl.onClick.add(this.onSpinBtnClick, this);
        betSelector.betChanged.add(this.onBetChanged, this);
        optionsBtnControl.addExtension(new ControlShowerExtension(optionsControl));
        autoplayButton.start.addExtension(new ControlShowerExtension(autoplaySelector));
        this.messageBarControl.addExtension(new GlowFilterExtension());
        autoplayButton.stop.onClick.add(this.onAutoplayStop, this);
        optionsControl.sound.onClick.add(this.onSoundClick, this);
        optionsControl.force.onClick.add(this.onForceBtnClick, this);
        autoplaySelector.changeAutoplay.add(this.onAutoplayChanged, this);
        this.userModel.balanceChanged.add(this.onBalanceChanged, this);
        this.userModel.betChanged.add(this.onBetChanged, this);
        this.freeSpinsModel.freeSpinsAmountChanged.add(this.onSpinRemainsChanged, this);
        gameModel.game.signals.spinStarted.add(this.onSpinStarted, this);
        gameModel.startSpinning.add(this.onSpinBtnClick, this);
        gameModel.game.signals.spinComplete.add(this.onSpinComplete, this);
        gameModel.game.signals.ui.spinButton.enable.add(this.onEnableSpinButton, this);
        gameModel.game.signals.ui.spinButton.disable.add(this.onDisableSpinButton, this);
        gameModel.game.signals.ui.spinButton.updateCounter.add(this.onUpdateSpinBtnCounter, this);
        gameModel.game.signals.ui.showWin.add(this.onShowWin, this);
        gameModel.game.signals.ui.disableControls.add(this.onDisableControls, this);
        gameModel.game.signals.ui.enableControls.add(this.onEnableControls, this);
        gameModel.game.signals.autoplay.decrease.add(this.onAutoplayDecrease, this);
        gameModel.game.signals.autoplay.stop.add(this.onAutoplayStop, this);
        gameModel.game.signals.ui.autoplayButton.enable.add(() => this.autoplayButton.enable(), this);
        gameModel.game.signals.infobar.stop.add(this.onStopUpdatingMessageBar, this);
        gameModel.game.signals.infobar.start.add(this.onStartUpdatingMessageBar, this);
        gameModel.game.signals.infobar.hide.add(this.onHideMessageBar, this);
        gameModel.game.signals.infobar.show.add(this.onShowMessageBar, this);
        this.userModel.updateUserStats(gameModel.mainGameInfo.userStats, true);        
        window.document.body.addEventListener("keypress", this.onKeyPress.bind(this));
    }

    dispose() {
        this.betControl.betChanged.unload(this);
        this.userModel.betChanged.unload(this);
        this.optionsControl.sound.onClick.unload(this);
        this.freeSpinsModel.freeSpinsAmountChanged.unload(this);
        this.autoplayButton.stop.onClick.unload(this);
        gameModel.game.signals.spinStarted.unload(this);
        gameModel.startSpinning.unload(this);
        gameModel.game.signals.spinComplete.unload(this);
        gameModel.game.signals.ui.spinButton.enable.unload(this);
        gameModel.game.signals.ui.spinButton.disable.unload(this);
        gameModel.game.signals.ui.spinButton.updateCounter.unload(this);
        gameModel.game.signals.ui.autoplayButton.enable.unload(this);
        gameModel.game.signals.ui.showWin.unload(this);
        gameModel.game.signals.autoplay.decrease.unload(this);
        gameModel.game.signals.autoplay.stop.unload(this);
        document.removeEventListener("keypress", this.onKeyPress);
        super.dispose();
    }

    activate() {
        super.activate();
        // todo: support chile nodes extending [#39]
        // this.layoutManager.addLayout(betPanelLayout);
    }

    deactivate() {
        // todo: support chile nodes extending [#39]
        // this.layoutManager.removeLayout(betPanelLayout);
        super.deactivate();
    }

    private onKeyPress(e:KeyboardEvent):void {
        if(e.keyCode == 32){
            this.onSpinBtnClick();
        }
        if(e.keyCode == 109 || e.keyCode == 1100){
            gameModel.game.signals.ui.options.toggleSound.emit();
        }
    }

    protected onSpinBtnClick() {
        gameModel.game.signals.ui.spinButton.clicked.emit();
        gameModel.getHowler().play("spin-button");
    }

    protected onSpinStarted() {}

    protected onSpinComplete() {}

    protected onBalanceChanged(balance: number) {
        this.balanceLabelControl.setValue(balance);
    }

    protected onBetChanged(betId: number) {
        this.betModel.setBet(betId);
        this.userModel.setBet(betId);
        this.betSelector.updateBetIndex(betId);
        this.totalBetControl.setValue(this.betModel.getTotalBet());
        this.betControl.hide();
    }

    private onShowWin(winInfo: {win: number, isTotalWin?: boolean}) {
        const title = winInfo.isTotalWin ? "TOTAL WIN" : "WIN";
        this.winControl.setTitle(title);
        this.winControl.setValue(winInfo.win);
    }

    private onEnableSpinButton() {
        this.spinBtnControl.enable();
    }

    private onDisableSpinButton() {
        this.spinBtnControl.disable();
    }

    private onDisableControls() {
        this.autoplayButton.disable();
        this.spinBtnControl.disable();
        this.betSelector.disable();
        this.betControl.disable();
    }

    private onEnableControls() {
        this.spinBtnControl.enable();
        this.autoplayButton.enable();
        this.betSelector.enable();
        this.betControl.enable();
    }

    private async onAutoplayChanged(autoplayId: number) {
        if (gameModel.autoplay.spins === 0) {
            gameModel.game.signals.autoplay.changed.emit(autoplayId);
            gameModel.autoplay.spins = gameModel.mainGameInfo.autoPlays[autoplayId];
        }
        await [
            this.autoplayButton.showStop(),
            this.autoplayControl.hide(),
        ].promise().all();
    }

    private onAutoplayDecrease() {
        this.autoplayButton.setSpinsNumber(gameModel.autoplay.spins);
        if (gameModel.autoplay.spins === 0) {
            gameModel.game.signals.autoplay.stop.emit();
        }
    }

    private onAutoplayStop() {
        this.autoplayButton.showPlay();
        this.autoplayButton.disable();
        this.autoplayButton.setSpinsNumber(0);
        gameModel.autoplay.spins = 0;
    }

    private onSpinRemainsChanged(data: {spinRemains: number}) {
        this.onUpdateSpinBtnCounter(data.spinRemains);
    }

    private onUpdateSpinBtnCounter(spinsRemains: number) {
        this.spinBtnControl.setSpinsNumber(spinsRemains);
    }

    private onForceBtnClick() {
        this.optionsControl.force.switchToggleState();
        gameModel.setForceMode(!gameModel.isForce);
    }

    private onSoundClick() {
        gameModel.game.signals.ui.options.toggleSound.emit();
    }

    protected onResize(gameSize: GameSize) {
        super.onResize(gameSize);
    }

    private onStopUpdatingMessageBar() {
        this.messageBarControl.stopUpdating();
    }

    private onStartUpdatingMessageBar() {
        this.messageBarControl.startUpdating();
    }

    private onHideMessageBar() {
        this.messageBarControl.hide();
    }

    private onShowMessageBar() {
        this.messageBarControl.show();
    }
}
