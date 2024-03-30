import {ITextStyle} from "@pixi/text";

export default class TextStyles {
    static readonly SYMBOL_DEV_INFO: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fill: "white",
        fontSize: 60,
        fontWeight: "bold",
        letterSpacing: -1,
        lineJoin: "round",
        strokeThickness: 6,
    };

    static readonly TITLE: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fill: "white",
        fontSize: 60,
        fontWeight: "bold",
        letterSpacing: -1,
        lineJoin: "round",
        strokeThickness: 6,
    };

    static readonly GAME_LABEL: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fill: "white",
        fontSize: 120,
        fontWeight: "bold",
        letterSpacing: -1,
        lineJoin: "round",
        strokeThickness: 6,
    };
    static readonly MESSAGE_BAR_TEXT_STYLE: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fontSize: 26,
        fontWeight: "bolder",
        lineJoin: "round",
        fill: ["#fdfdfd", "#d68310"],
        fillGradientStops: [0.4],
        stroke: "#4a1a06",
        strokeThickness: 2,
    };

    static readonly INTRO_GAME_FOOTER_TITLE: Partial<ITextStyle> = {
        fontFamily: "SuperMarioGalaxy",
        fontSize: 90,
        align: "center",
        fill: ["#fdfdfd", "#d68310"],
        fillGradientStops: [0.55],
        stroke: "#4a1a06",
        dropShadowAlpha: 0.5,
        strokeThickness: 4,
        dropShadow: true,
        dropShadowAngle: 10,
        dropShadowBlur: 2,
        dropShadowColor: "#260606",
        dropShadowDistance: 3,
    };

    static readonly INTRO_FEATURE_CONTROL_TEXT: Partial<ITextStyle> = {
        ...this.INTRO_GAME_FOOTER_TITLE,
        fontSize: 45,
    };

    static readonly LABEL_TITLE_STYLE: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fontSize: 18,
        fontWeight: "bold",
        lineJoin: "round",
        fill: ["#fdfdfd", "#d68310"],
        fillGradientStops: [0.55],
        stroke: "#4a1a06",
        strokeThickness: 2,
    };

    static readonly LABEL_TEXT_STYLE: Partial<ITextStyle> = {
        fontFamily: "RobotoB",
        fill: "white",
        fontSize: 30,
        fontWeight: "bold",
        lineJoin: "round",
        letterSpacing: -0.5,
    };

    static readonly POPUP_LABEL_STYLE: Partial<ITextStyle> = {
        ...this.LABEL_TEXT_STYLE,
        fontFamily: "SuperMarioGalaxy",
        fontSize: 100,
        fill: "#f6c399",
        letterSpacing: -1,
        strokeThickness: 6,
    };

    static readonly SPIN_BTN_TEXT_STYLE: Partial<ITextStyle> = {
        ...this.LABEL_TEXT_STYLE,
        fill: ["#fdfdfd", "#d68310"],
        fillGradientStops: [0.55],
        stroke: "#4a1a06",
        strokeThickness: 5,
        fontFamily: "SuperMarioGalaxy",
        fontSize: 110,
    };

    static readonly TOOLTIP_LABEL_TITLE_STYLE: Partial<ITextStyle> = {
        ...this.LABEL_TITLE_STYLE,
        fontSize: 32,
    };

    static readonly PAYTABLE_STYLE: Partial<ITextStyle> = {
        ...this.INTRO_GAME_FOOTER_TITLE,
        fontSize: 95,
        wordWrap: true,
        wordWrapWidth: 1920 - 150,
        leading: 20,
        align: "center",
    };

    static readonly PAYTABLE_SCATTER_STYLE: Partial<ITextStyle> = {
        ...this.PAYTABLE_STYLE,
        fontSize: 50,
        leading: -10,
    };

    static readonly PAYTABLE_TITLE_STYLE: Partial<ITextStyle> = {
        ...this.INTRO_GAME_FOOTER_TITLE,
        fontSize: 120,
    };

    static readonly PAYTABLE_WHITE_TITLE_STYLE: Partial<ITextStyle> = {
        ...this.PAYTABLE_TITLE_STYLE,
        fontFamily: "RobotoB",
        fill: "#ffffff",
        strokeThickness: 0,
        align: "center",
    };

    static readonly TOOLTIP_LABEL_TEXT_STYLE: Partial<ITextStyle> = {
        ...this.LABEL_TEXT_STYLE,
        fill: "white",
        fontSize: 60,
    };

    static readonly AUTOPLAY_BUTTON: Partial<ITextStyle> = {
        ...this.LABEL_TITLE_STYLE,
        fontFamily: "SuperMarioGalaxy",
        fill: "#fdfdfd",
        fontSize: 90,
        stroke: "#000",
        strokeThickness: 3,
    };

    static readonly AUTOPLAY_BUTTON_CONTROL: Partial<ITextStyle> = {
        ...this.LABEL_TITLE_STYLE,
        fontSize: 45,
        fill: "#d68310",
        strokeThickness: 4,
    };

    static readonly BET_SELECTOR_BUTTON_CONTROL: Partial<ITextStyle> = {
        ...this.AUTOPLAY_BUTTON,
        strokeThickness: 0,
        fontSize: 50,
    };
}
