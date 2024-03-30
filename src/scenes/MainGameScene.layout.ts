import {PartialLayout} from "app/layoutManager/LayoutManager";
import {betPanelLayout} from "app/scenes/subscenes/BetPanelScene.layout";

const commonLayouts: PartialLayout[] = [{
    name: "box",
    uid: "box",
    scaleBy: "fit.in",
    height: "100%",
    width: "100%",
    top: "0%",
    left: "0%",
    display: "table",
}];
const header: PartialLayout = {
    name: "header",
    extend: "box",
    width: "100%",
    display: "fixed",
    sortBy: "horizontal",
    layouts: [
        {
            name: "logo",
            scaleBy: "fit.in",
            alignIn: "c",
            avoidBounding: "yes",
            aspects: {
                "1920/4157": {
                    height: "100%",
                    width: "75%",
                    align: "c",
                },
                "1920/3408": {
                    height: "100%",
                    width: "80%",
                    align: "c",
                },
                "1920/2561": {
                    height: "100%",
                    width: "50%",
                    align: "c",
                },
                "1920/1440": {
                    height: "100%",
                    width: "50%",
                    align: "c",
                },
                "1920 / 1335": {
                    height: "100%",
                    width: "50%",
                    align: "c",
                },
                "1920 / 1334": {
                    height: "100%",
                    width: "45%",
                    align: "c",
                },
                "1920/1082": {
                    height: "100%",
                    width: "35%",
                    align: "c",
                },
                "1920/887": {
                    height: "100%",
                    width: "28%",
                    align: "c",
                },
            },
        },
    ],
    aspects: {
        "1920/4157": {
            height: "12.5%",
        },
        "1920/3408": {
            height: "12.5%",
        },
        "1920/2561": {
            height: "12.5%",
        },
        "1920/1440": {
            height: "12.5%",
        },
        "1920/1082": {
            height: "14.5%",
        },
        "1920/887": {
            height: "12.5%",
        },
    },
};
const footer: PartialLayout = {
    name: "footer",
    extend: "box",
    width: "100%",
    display: "relative",
    layouts: [
        {
            name: "character_box",
            extend: "box",
            alignIn: "t",
            align: "l",
            width: "2%",
            height: "100%",
            avoidBounding: "yes",
            display: "fixed",
            layouts: [
                {
                    name: "character",
                    scaleBy: "fit.in",
                    width: "1%",
                    left: 375,
                    height: "100%",
                    aspects: {
                        "1920/4157": {
                            left: 300,
                            width: "1.7%",
                        },
                        "1920/3408": {
                            width: "1.5%",
                        },
                        "1920/2561": {
                            width: "1.3%",
                            left: 300,
                        },
                        "1920/1440": {
                            width: "1%",
                            left: 375,
                        },
                        "1920/1082": {
                            width: "0.9%",
                        },
                        "1920/887": {
                            left: 500,
                            width: "0.7%",
                        },
                    },
                },
            ],
        },
        {
            name: "footer_content",
            extend: "box",
            scaleBy: "fit.in",
            alignIn: "c",
            top: "0%",
            width: "55%",
            layouts: [
                ...betPanelLayout.layouts ?? [],
                // todo: support child nodes extending [#39]
                /* {
                name: "footerLayout",
                extend: "bet_panel"
            }*/
            ],
            aspects: {
                "1920/4157": {
                    width: "85%",
                    height: "90%",
                    align: "b",
                },
                "1920/3408": {
                    width: "85%",
                    height: "90%",
                    align: "b",
                },
                "1920/2561": {
                    width: "77%",
                    height: "90%",
                    align: "b",
                },
                "1920/1440": {
                    width: "60%",
                    height: "100%",
                    align: "c",
                },
                "1920/1082": {
                    width: "60%",
                    height: "90%",
                    align: "b",
                },
                "1920/887": {
                    width: "55%",
                    height: "100%",
                    align: "c",
                },
            },
        },
    ],
    aspects: {
        "1920/4157": {
            height: "7.5%",
        },
        "1920/3408": {
            height: "7.5%",
        },
        "1920/2561": {
            height: "9.5%",
        },
        "1920/1440": {
            height: "11%",
        },
        "1920/1082": {
            height: "10.5%",
        },
        "1920/887": {
            height: "12.5%",
        },
    },
};
const leftSideBox: PartialLayout = {
    name: "\nleftSideBox",
    display: "relative",
    top: "0%",
    layouts: [
        {
            name: "options_btn",
            scaleBy: "fit.in",
            avoidBounding: "yes",
            alignIn: "c",
            align: "bl",
            height: "15%",
            layouts: [
                {
                    name: "options_selector",
                    align: "b",
                    scaleBy: "fit.in",
                    alignIn: "b",
                    aspects: {
                        "1920/4157": {
                            width: "150%",
                            height: "500%",
                            top: "-110%",
                        },
                        "1920/3408": {
                            width: "150%",
                            height: "500%",
                            top: "-110%",
                        },
                        "1920/2561": {
                            width: "150%",
                            height: "500%",
                            top: "-110%",
                        },
                        "1920/1440": {
                            width: "155%",
                            height: "515%",
                            top: "-92%",
                        },
                        "1920/1082": {
                            width: "175%",
                            height: "600%",
                            top: "-110%",
                        },
                        "1920/887": {
                            width: "150%",
                            height: "500%",
                            top: "-110%",
                        },
                    },
                },
            ],
            aspects: {
                "1920/4157": {
                    top: "-3%",
                    left: "20%",
                    width: "27%",
                },
                "1920/3408": {
                    top: "-3%",
                    left: "20%",
                    width: "27%",
                },
                "1920/2561": {
                    top: "-3%",
                    left: "20%",
                    width: "27%",
                },
                "1920/1440": {
                    top: "0%",
                    left: "33%",
                    width: "34%",
                },
                "1920/1082": {
                    top: "-1.5%",
                    left: "25%",
                    width: "27%",
                },
                "1920/887": {
                    top: "-3%",
                    left: "20%",
                    width: "27%",
                },
            },
        },
    ],
    aspects: {
        "1920/4157": {
            width: "0%",
            height: "0%",
        },
        "1920/3408": {
            width: "0%",
            height: "0%",
        },
        "1920/2561": {
            width: "0%",
            height: "0%",
        },
        "1920/1440": {
            width: "17.5%",
            height: "100%",
        },
        "1920/1082": {
            width: "20%",
            height: "100%",
        },
        "1920/887": {
            width: "20%",
            height: "100%",
        },
    },
};
const rightSideBox: PartialLayout = {
    name: "\nrightSideBox",
    display: "relative",
    layouts: [
        {
            name: "btns_con",
            width: "100%",
            layouts: [
                {
                    name: "options_btn",
                    scaleBy: "fit.in",
                    avoidBounding: "yes",
                    alignIn: "c",
                    layouts: [
                        {
                            name: "options_selector",
                            align: "b",
                            scaleBy: "fit.in",
                            alignIn: "b",
                            aspects: {
                                "1920/4157": {
                                    width: "150%",
                                    height: "500%",
                                    top: "-110%",
                                },
                                "1920/3408": {
                                    width: "150%",
                                    height: "470%",
                                    top: "-110%",
                                },
                                "1920/2561": {
                                    width: "100%",
                                    height: "500%",
                                    top: "-110%",
                                },
                                "1920/1440": {
                                    width: "155%",
                                    height: "515%",
                                    top: "-110%",
                                },
                                "1920/1082": {
                                    width: "175%",
                                    height: "600%",
                                    top: "-110%",
                                },
                                "1920/887": {
                                    width: "150%",
                                    height: "500%",
                                    top: "-110%",
                                },
                            },
                        },
                    ],
                    aspects: {
                        "1920/4157": {
                            width: "20%",
                            height: "20%",
                            top: "-20%",
                            align: "c",
                            left: "-30%",
                        },
                        "1920/3408": {
                            width: "30%",
                            height: "30%",
                            top: "-20%",
                            align: "c",
                            left: "-27.5%",
                        },
                        "1920/2561": {
                            width: "45%",
                            height: "45%",
                            top: "-7.5%",
                            align: "c",
                            left: "-25%",
                        },
                        "1920/1440": {
                            width: "70%",
                            height: "70%",
                            align: "c",
                            left: "-450%",
                            top: "400%",
                        },
                        "1920/1082": {
                            width: "60%",
                            height: "60%",
                            align: "c",
                            left: "-400%",
                            top: "410%",
                        },
                        "1920/887": {
                            width: "60%",
                            height: "60%",
                            align: "c",
                            left: "-400%",
                            top: "410%",
                        },
                    },
                },
                {
                    name: "force_btn",
                    avoidBounding: "yes",
                    alignIn: "c",
                    scaleBy: "fit.in",
                    aspects: {
                        "1920/4157": {
                            width: "20%",
                            height: "20%",
                            align: "b",
                            top: "-10%",
                            left: "-18%",
                        },
                        "1920/3408": {
                            width: "30%",
                            height: "30%",
                            align: "b",
                            top: "-10%",
                            left: "-18%",
                        },
                        "1920/2561": {
                            width: "32.5%",
                            height: "32.5%",
                            align: "c",
                            top: "0%",
                            left: "-18%",
                        },
                        "1920/1440": {
                            width: "62%",
                            height: "62%",
                            align: "t",
                            top: "-97%",
                            left: "0%",
                        },
                        "1920/1082": {
                            width: "62%",
                            height: "62%",
                            align: "t",
                            top: "-97%",
                            left: "0%",
                        },
                        "1920/887": {
                            width: "62%",
                            height: "62%",
                            align: "t",
                            top: "-97%",
                            left: "0%",
                        },
                    },
                },
                {
                    name: "autoplay_btn",
                    avoidBounding: "yes",
                    alignIn: "c",
                    scaleBy: "fit.in",
                    aspects: {
                        "1920/4157": {
                            width: "20%",
                            height: "20%",
                            top: "-20%",
                            align: "c",
                            left: "30%",
                        },
                        "1920/3408": {
                            width: "30%",
                            height: "30%",
                            align: "c",
                            top: "-20%",
                            left: "27.5%",
                        },
                        "1920/2561": {
                            width: "45%",
                            height: "45%",
                            align: "c",
                            top: "-7.5%",
                            left: "25%",
                        },
                        "1920/1440": {
                            width: "62%",
                            height: "62%",
                            align: "t",
                            top: "-215%",
                            left: "0%",
                        },
                        "1920/1082": {
                            width: "62%",
                            height: "62%",
                            align: "t",
                            top: "-125%",
                            left: "0%",
                        },
                        "1920/887": {
                            width: "70%",
                            height: "70%",
                            align: "t",
                            top: "-120%",
                            left: "0%",
                        },
                    },
                },
                {
                    name: "spin_btn",
                    avoidBounding: "yes",
                    alignIn: "c",
                    scaleBy: "fit.in",
                    aspects: {
                        "1920/4157": {
                            width: "50%",
                            height: "50%",
                            align: "c",
                            top: "-20%",
                        },
                        "1920/3408": {
                            width: "55%",
                            height: "55%",
                            align: "c",
                            top: "-20%",
                        },
                        "1920/2561": {
                            width: "100%",
                            height: "100%",
                            align: "c",
                            top: "-7.5%",
                        },
                        "1920/1440": {
                            width: "100%",
                            height: "155%",
                            align: "t",
                            top: "-235%",
                        },
                        "1920/1082": {
                            width: "100%",
                            height: "155%",
                            align: "t",
                            top: "-140%",
                        },
                        "1920/887": {
                            width: "150%",
                            height: "150%",
                            align: "t",
                            top: "-125%",
                        },
                    },

                },
                {
                    name: "bet_chooser",
                    alignIn: "c",
                    avoidBounding: "yes",
                    scaleBy: "fit.in",
                    aspects: {
                        "1920/4157": {
                            width: "50%",
                            height: "30%",
                            align: "b",
                            top: "-7.5%",
                        },
                        "1920/3408": {
                            width: "40%",
                            height: "30%",
                            align: "b",
                            top: "-7.5%",
                        },
                        "1920/2561": {
                            width: "35%",
                            height: "45%",
                            align: "b",
                            top: "45%",
                        },
                        "1920/1440": {
                            width: "90%",
                            height: "60%",
                            align: "t",
                            top: "-160%",
                            left: "0%",
                        },
                        "1920/1082": {
                            width: "85%",
                            height: "60%",
                            align: "t",
                            top: "-65%",
                            left: "0%",
                        },
                        "1920/887": {
                            width: "90%",
                            height: "70%",
                            align: "t",
                            top: "-60%",
                            left: "0%",
                        },
                    },
                },
            ],
            aspects: {
                "1920/4157": {
                    sortBy: "horizontal",
                    display: "fixed",
                    height: "100%",
                    align: "c",
                },
                "1920/3408": {
                    sortBy: "horizontal",
                    display: "fixed",
                    height: "100%",
                    align: "c",
                },
                "1920/2561": {
                    sortBy: "horizontal",
                    display: "fixed",
                    height: "100%",
                    align: "c",
                },
                "1920/1440": {
                    sortBy: "vertical",
                    display: "table",
                    height: "76%",
                    align: "b",
                },
                "1920/1082": {
                    sortBy: "vertical",
                    display: "table",
                    height: "104%",
                    align: "b",
                },
                "1920/887": {
                    sortBy: "vertical",
                    display: "table",
                    height: "110%",
                    align: "b",
                },
            },
        },
    ],
    aspects: {
        "1920/4157": {
            sortBy: "horizontal",
            width: "100%",
            height: "35%",
        },
        "1920/3408": {
            sortBy: "horizontal",
            width: "100%",
            height: "30%",
        },
        "1920/2561": {
            sortBy: "horizontal",
            width: "100%",
            height: "20%",
        },
        "1920/1440": {
            sortBy: "vertical",
            width: "18%",
            height: "100%",
        },
        "1920/1082": {
            sortBy: "vertical",
            width: "20%",
            height: "100%",
        },
        "1920/887": {
            sortBy: "vertical",
            width: "20%",
            height: "100%",
        },
    },
};
const reelBoxContainer: PartialLayout = {
    name: "reelBoxContainer",
    extend: "box",
    display: "fixed",
    alignIn: "c",
    align: "c",
    height: "100%",
    layouts: [
        {
            name: "reelBox",
            extend: "box",
            height: "100%",
            width: "100%",
            scaleBy: "fit.in",
            aspects: {
                "1920/4157": {
                    alignIn: "b",
                },
                "1920/3408": {
                    alignIn: "b",
                },
                "1920/2561": {
                    alignIn: "b",
                },
                "1920/1440": {
                    alignIn: "c",
                },
                "1920/1082": {
                    alignIn: "c",
                },
                "1920/887": {
                    alignIn: "c",
                },
            },
        },
        {
            name: "autoplay_selector",
            extend: "box",
            avoidBounding: "yes",
            alignIn: "c",
            width: "96%",
            aspects: {
                "1920/4157": {
                    height: "20%",
                    align: "b",
                    top: "-15%",
                    scaleBy: "fit.out",
                },
                "1920/3408": {
                    height: "20%",
                    align: "b",
                    top: "-20%",
                    scaleBy: "fit.out",
                },
                "1920/2561": {
                    height: "30%",
                    align: "b",
                    top: "-25%",
                    scaleBy: "fit.in",
                },
                "1920/1440": {
                    height: "20%",
                    align: "b",
                    top: "-35%",
                    scaleBy: "fit.out",
                },
                "1920/1082": {
                    height: "40%",
                    align: "c",
                    top: "0%",
                    scaleBy: "fit.in",
                },
                "1920/887": {
                    height: "40%",
                    align: "c",
                    top: "0%",
                    scaleBy: "fit.in",
                },
            },
        },
        {
            name: "bet_options_selector",
            alignIn: "c",
            align: "c",
            width: "80%",
            height: "80%",
            scaleBy: "fit.in",
            avoidBounding: "yes",
            aspects: {
                "1920/4157": {
                    top: "25%",
                },
                "1920/3408": {
                    top: "15%",
                },
                "1920/2561": {
                    top: "0%",
                },
                "1920/1440": {
                    top: "0%",
                },
                "1920/1082": {
                    top: "0%",
                },
                "1920/887": {
                    top: "0%",
                },
            },
        },
    ],
    aspects: {
        "1920/4157": {
            width: "92%",
        },
        "1920/3408": {
            width: "100%",
        },
        "1920/2561": {
            width: "100%",
        },
        "1920/1440": {
            width: "100%",
        },
        "1920/1082": {
            width: "100%",
        },
        "1920/887": {
            width: "100%",
        },
    },
};
const reelBoxAndWheelContrainer: PartialLayout = {
    name: "reelBoxAndWheelContrainer",
    extend: "box",
    height: "90%",
    width: "100%",
    display: "fixed",
    alignIn: "c",
    layouts: [
        reelBoxContainer,
    ],
};
const centerGameBody: PartialLayout = {
    name: "centerGameBody",
    extend: "box",
    sortBy: "vertical",
    display: "relative",
    layouts: [
        reelBoxAndWheelContrainer,
        {
            name: "messageBar",
            avoidBounding: "yes",
            scaleBy: "fit.in",
            alignIn: "c",
            left: "10%",
            top: "0%",
            width: "80%",
            height: "8%",
        },
    ],
    aspects: {
        "1920/4157": {
            width: "100%",
            height: "65%",
            left: "0%",
        },
        "1920/3408": {
            width: "100%",
            height: "70%",
            left: "0%",
        },
        "1920/2561": {
            width: "100%",
            height: "70%",
            left: "0%",
        },
        "1920/1440": {
            width: "64%",
            height: "100%",
            left: "-0.5%",
        },
        "1920/1082": {
            width: "60%",
            height: "100%",
            left: "0%",
        },
        "1920/887": {
            width: "60%",
            height: "100%",
            left: "0%",
        },
    },
};
const gameBody: PartialLayout = {
    name: "gameBody",
    extend: "box",
    display: "relative",
    width: "100%",
    layouts: [
        leftSideBox,
        centerGameBody,
        rightSideBox,
    ],
    aspects: {
        "1920/4157": {
            sortBy: "vertical",
            height: "80%",
        },
        "1920/3408": {
            sortBy: "vertical",
            height: "80%",
        },
        "1920/2561": {
            sortBy: "vertical",
            height: "78%",
        },
        "1920/1440": {
            sortBy: "horizontal",
            height: "76.5%",
        },
        "1920/1082": {
            sortBy: "horizontal",
            height: "75%",
        },
        "1920/887": {
            sortBy: "horizontal",
            height: "75%",
        },
    },

};

export const grassLayout: PartialLayout = {
    name: "grass",
    align: "b",
    alignIn: "b",
    width: "100%",
    left: "8%",
    aspects: {
        "1920/4157": {
            height: "15%",
        },
        "1920/3408": {
            height: "17.5%",
        },
        "1920/2561": {
            height: "20%",
        },
        "1920/1440": {
            height: "30%",
        },
        "1920/1082": {
            height: "35%",
        },
        "1920/887": {
            height: "40%",
        },
    },
};

const layouts: PartialLayout = {
    name: "body",
    display: "relative",
    extend: "box",
    height: "100%",
    width: "100%",
    sortBy: "vertical",
    layouts: [
        header,
        gameBody,
        footer,
    ],
};
const mainGameLayout = {
    commonLayouts, layouts,
};

export default mainGameLayout;
