import BaseScene from "app/scenes/BaseScene";
import SpinBtnControl from "app/controls/button/SpinBtnControl";
import LayoutManager from "app/layoutManager/LayoutManager";
import {inject} from "app/model/injection/InjectDecorator";
import gameModel, {GameSize} from "app/model/GameModel";
import BalanceControl from "app/controls/ui/BalanceControl";
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
import BetSelectorBtnsControl from "app/controls/button/BetSelectorBtnsControl";
import {MessageBarControl} from "app/controls/MessageBarControl";
import infoMessageBarConfig from "res/configs/infoMessageBarConfig.json";
import GlowFilterExtension from "app/controls/extensions/GlowFilterExtension";

export default class DesktopBetPanelScene extends BaseScene {
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
    private winControl: LabelControl = new WinControl("WIN");
    private optionsControl: OptionsControl = new OptionsControl();
    private betSelectorControl: BetSelectorBtnsControl = new BetSelectorBtnsControl(gameModel.mainGameInfo.bets);
    private autoplayButton: AutoplayButtonControl = new AutoplayButtonControl();
    private plank: SpriteControl = new SpriteControl("bet_panel_box.png");
    private readonly messageBarControl: MessageBarControl = new MessageBarControl(
        infoMessageBarConfig.gameInfo,
        infoMessageBarConfig.updateFrequency,
    );
    async compose() {
        const autoplayButton = this.autoplayButton;
        const optionsControl = this.optionsControl;
        const autoplaySelector = this.autoplayControl;
        const spinBtnControl = this.spinBtnControl;
        const balanceLabelControl = this.balanceLabelControl;
        const winControl = this.winControl;
        const optionsBtnControl = this.optionsBtnControl;
        const betSelectorControl = this.betSelectorControl;
        this.addControl(this.plank.name("footer"));
        this.addControl(autoplayButton.name("autoplay_btn"));
        this.addControl(autoplaySelector.name("autoplay_selector"));
        this.addControl(spinBtnControl.name("spin_btn"));
        this.addControl(balanceLabelControl.name("balance_label"));
        this.addControl(winControl.name("win_label"));
        this.addControl(optionsBtnControl.name("options_btn"));
        this.addControl(optionsControl.name("options_selector"));
        this.addControl(betSelectorControl.name("bet_selector"));
        this.addControl(this.messageBarControl.name("messageBar"));
        spinBtnControl.disable();
        await gameModel.ready;
        const userStats = gameModel.mainGameInfo.userStats;
        this.betSelectorControl.betChanged.add(this.onBetChanged, this);
        balanceLabelControl.setValue(userStats.balance);
        winControl.setValue(0);
        spinBtnControl.onClick.add(this.onSpinBtnClick, this);
        optionsBtnControl.addExtension(new ControlShowerExtension(optionsControl));
        autoplayButton.start.addExtension(new ControlShowerExtension(autoplaySelector));
        winControl.addExtension(new GlowFilterExtension());
        balanceLabelControl.addExtension(new GlowFilterExtension({color: 0x6a3925}));
        this.messageBarControl.addExtension(new GlowFilterExtension());
        autoplayButton.stop.onClick.add(this.onAutoplayStop, this);
        optionsControl.sound.onClick.add(this.onSoundClick, this);
        optionsControl.force.onClick.add(this.onForceBtnClick, this);
        autoplaySelector.changeAutoplay.add(this.onAutoplayChanged, this);
        this.userModel.balanceChanged.add(this.onBalanceChanged, this);
        this.userModel.betChanged.add(this.onChangeBet, this);
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
    }

    dispose() {
        this.betSelectorControl.betChanged.unload(this);
        this.optionsControl.sound.onClick.unload(this);
        this.optionsControl.force.onClick.unload(this);
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
        super.dispose();
    }

    activate() {
        super.activate();
    }

    deactivate() {
        super.deactivate();
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

    protected onChangeBet(betId: number) {
        this.betSelectorControl.updateBetIndex(betId);
    }

    protected onBetChanged(betId: number) {
        this.betModel.setBet(betId);
        this.userModel.setBet(betId);
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
        this.betSelectorControl.disable();
    }

    private onEnableControls() {
        this.spinBtnControl.enable();
        this.autoplayButton.enable();
        this.betSelectorControl.enable();
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
