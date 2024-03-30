import BaseScene from "app/scenes/BaseScene";
import gameModel from "app/model/GameModel";
import SpineControl from "app/controls/SpineControl";
import CentralizingExtension from "app/controls/extensions/CentralizingExtension";
import {LocalizationExtension} from "app/controls/extensions/LocalizationExtension";
import PaytableExtension from "app/controls/game/extensions/PaytableExtension";
import SpineAspectExtension from "app/controls/extensions/SpineAspectExtension";
import SpriteSheetButtonControl from "app/controls/button/SpriteSheetButtonControl";

export default class PaytableScene extends BaseScene {
    private readonly backBtn = new SpriteSheetButtonControl("back_btn.png");
    protected readonly paytablePage: SpineControl = new SpineControl("paytable_page");
    protected readonly paytable: SpineControl = new SpineControl("paytable");
    private page = 0;

    compose(): void {
        this.addControl(this.paytable);
        const spineAspectExtension = new SpineAspectExtension({aspectAt: 1080 / 1920, aspectTo: 1920 / 1080});
        this.paytablePage.addExtension(new PaytableExtension());
        this.paytablePage.addExtension(new LocalizationExtension());
        this.paytable.addExtension(new CentralizingExtension());
        this.paytable.addExtension(spineAspectExtension);
        this.paytablePage.addExtension(spineAspectExtension);
        this.paytable.replace("page1", this.paytablePage.container);
        this.paytable.replace("back_btn", this.backBtn.container);
    }

    activate(): void {
        super.activate();
        this.backBtn.onClick.add(this.onBackBtnClick);
        gameModel.game.signals.background.show.emit("dark");
        this.paytablePage.play("show");
        this.showPage(1);
        this.app.stage.on("pointerdown", this.onNextPage, this);
        this.app.stage.cursor = "pointer";
        this.app.stage.eventMode = "static";
    }

    deactivate() {
        this.app.stage.off("pointerdown", this.onNextPage, this);
        this.app.stage.cursor = "default";
        this.app.stage.eventMode = "auto";
        this.backBtn.onClick.unload(this);
        super.deactivate();
    }

    private onBackBtnClick(): void {
        gameModel.game.signals.ui.options.info.hide.emit();
    }

    private onNextPage(e: Event) {
        if (e.target == this.backBtn.container) {
            return;
        }
        this.showPage(((this.page++) % 7) + 1);
    }

    private showPage(page: number) {
        this.page = page;
        this.paytablePage.play(`show/page${page}`, {trackIndex: 2});
    }
}
