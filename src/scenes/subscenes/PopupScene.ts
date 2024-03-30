import BaseScene from "app/scenes/BaseScene";
import gameModel from "app/model/GameModel";
import {PopupControlFactory, TPopupSkins} from "app/controls/popups/PopupControl";
import ShadowControl, {shadowLayout} from "app/controls/popups/ShadowControl";
import {inject} from "app/model/injection/InjectDecorator";
import LayoutManager from "app/layoutManager/LayoutManager";
import BetModel from "app/model/BetModel";
import CentralizingExtension from "app/controls/extensions/CentralizingExtension";
import SpeedFactorExtension from "app/controls/extensions/SpeedFactorExtension";
import gameConfig from "res/configs/gameConfig.json";

export default class PopupScene extends BaseScene {
    private readonly shadow: ShadowControl = new ShadowControl();
    @inject(LayoutManager)
    private readonly layoutManager!: LayoutManager;
    @inject(BetModel)
    private readonly betModel!: BetModel;

    compose(): void {
    }

    activate() {
        super.activate();
        this.addControl(this.shadow);
        this.layoutManager.addLayout(shadowLayout);
        gameModel.game.signals.popup.fsIntro.show.add(this.onShowFsPopup, this);
        gameModel.game.signals.popup.fsIntro.hide.add(this.onHideShadow, this);
        gameModel.game.signals.popup.fsOutro.show.add(this.onShowFsOutroPopup, this);
        gameModel.game.signals.popup.fsOutro.hide.add(this.onHideShadow, this);
        gameModel.game.signals.popup.winCounter.show.add(this.onShowWinCounterPopup, this);
        gameModel.game.signals.popup.winCounter.hide.add(this.onHideShadow, this);
        // todo: added spine popup as example[#17]
        // this.onShowFsPopup();
    }

    deactivate() {
        gameModel.game.signals.popup.fsIntro.show.unload(this);
        gameModel.game.signals.popup.fsIntro.hide.unload(this);
        gameModel.game.signals.popup.fsOutro.show.unload(this);
        gameModel.game.signals.popup.fsOutro.hide.unload(this);
        gameModel.game.signals.popup.winCounter.show.unload(this);
        gameModel.game.signals.popup.winCounter.hide.unload(this);
        this.layoutManager.removeLayout(shadowLayout);
        super.deactivate();
    }

    private async onShowFsPopup(spinsAmount: number, resolve?: () => void) {
        await this.showPopup("intro", spinsAmount);
        resolve?.();
    }

    private async onShowFsOutroPopup(freeSpinsWin: number, resolve?: () => void) {
        await this.showPopup("outro", freeSpinsWin);
        resolve?.();
    }

    private async onShowWinCounterPopup(totalWin: number, resolve?: () => void) {
        const isBigWin = this.betModel.bigWinCalculator.isBigWin(totalWin);
        const skin = isBigWin ? "win_counter" : "low_win_counter";
        const time = this.getWinCounterTime(totalWin);
        await this.showPopup(skin, totalWin, time);
        resolve?.();
    }

    private async showPopup(skin: TPopupSkins, win: number, time?: number) {
        const popupSignals = gameModel.game.signals.popup;
        const fsPopupSignals = skin == "intro" ? popupSignals.fsIntro : popupSignals.fsOutro;
        const isLowWin = skin == "low_win_counter";
        const winCounterSkins = ["win_counter", "low_win_counter"];
        const popupSignal = winCounterSkins.contains(skin) ? popupSignals.winCounter : fsPopupSignals;
        const popup = PopupControlFactory.getPopup({time, skin, counterValue: win, popupSignal});
        this.addControl(popup);
        popup.addExtension(new SpeedFactorExtension());
        popup.addExtension(new CentralizingExtension());
        if (!isLowWin) {
            await this.shadow.show();
        }
        await popup.show();
        await popupSignal.hidden.addOnce(() => {
            this.removeControl(popup);
        }, this);
        popupSignal.shown.emit();
    }

    private async onHideShadow(_: void, resolve?: () => void) {
        await this.shadow.hide();
        resolve?.();
    }

    private getWinCounterTime(totalWin: number) {
        const winType = this.betModel.bigWinCalculator.getWinType(totalWin);
        switch (winType) {
            case "LOW":
                return gameConfig.win.duration.low;
            case "MEDIUM":
                return gameConfig.win.duration.medium;
            case "BIG":
                return gameConfig.win.duration.big;
            case "SUPER":
                return gameConfig.win.duration.super;
        }
        return gameConfig.win.duration.epic;
    }
}
