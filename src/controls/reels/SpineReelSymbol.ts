import {TypingSpineControl} from "app/controls/SpineControl";
import {Text} from "@pixi/text";
import TextStyles from "app/model/TextStyles";
import {Container} from "@pixi/display";

export type TAnimations =
    "dim" |
    "dim_for_spin" |
    "idle" |
    "land" |
    "undim" |
    "undim_for_spin" |
    "win";

export type TSymbolType = "" | "blur/";
export type TSymbolSkins = (
    "high1" |
    "high2" |
    "high3" |
    "high4" |
    "low1" |
    "low2" |
    "low3" |
    "low4" |
    "low5" |
    "scatter" |
    "wild" |
    "winlabel" |
    "blank");
export type TSkins = (`${TSymbolType}${TSymbolSkins}`);
export type TSymbolData = {
    id: number,
    symbolIndex: number,
    symbolTileIndex: number,
};
export default class SpineReelSymbol extends TypingSpineControl<TAnimations, TSkins> {
    protected id = -1;
    protected label: Text = new Text("asd", TextStyles.SYMBOL_DEV_INFO);
    protected symbolData: TSymbolData = {id: -1, symbolIndex: -1, symbolTileIndex: -1};

    updateSymbolData(data: TSymbolData) {
        this.symbolData = data;
        this.label.text =
            `id:${this.symbolData.id}
idx:${this.symbolData.symbolIndex}
tidx:${this.symbolData.symbolTileIndex}`;
    }

    getSymbolData() {
        return {
            ...this.symbolData,
        };
    }

    showSymbolData() {
        this.container.addChild(this.label);
        this.label.anchor.set(0.5, 0.5);
    }

    hideSymbolData() {
        this.label.parent?.removeChild(this.label);
    }

    protected update(dt: number) {
        super.update(dt);
        if (this.label.parent != undefined) {
            this.updateSymbolData(this.symbolData);
        }
    }

    removeAdditionalInfo() {
        this.replace("label", new Container());
    }

    addAdditionalInfo(container: Container) {
        this.replace("label", container);
    }

    getLabelContainer() {
        const labelContainer = this.getSlotContainer("label");
        if (!labelContainer) {
            throw new Error("labelContainer is not found");
        }
        return labelContainer;
    }

    getContainer(){
        return this.container;
    }
}
