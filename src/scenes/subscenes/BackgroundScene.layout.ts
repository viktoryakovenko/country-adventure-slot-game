import {PartialLayout} from "app/layoutManager/LayoutManager";

const leftShadowLayout: PartialLayout = {
    name: "leftShadow",
    aspects: {
        "1920/4157": {
            width: "100%",
            height: "25%",
            align: "t",
        },
        "1920/3408": {
            width: "100%",
            height: "25%",
            align: "t",
        },
        "1920/2561": {
            width: "100%",
            height: "25%",
            align: "t",
        },
        "1920/1440": {
            width: "25%",
            height: "100%",
            align: "l",
        },
        "1920/1082": {
            width: "25%",
            height: "100%",
            align: "l",
        },
        "1920/887": {
            width: "25%",
            height: "100%",
            align: "l",
        },
    },
};

const rightShadowLayout: PartialLayout = {
    name: "rightShadow",
    aspects: {
        "1920/4157": {
            width: "100%",
            height: "25%",
            align: "b",
        },
        "1920/3408": {
            width: "100%",
            height: "25%",
            align: "b",
        },
        "1920/2561": {
            width: "100%",
            height: "25%",
            align: "b",
        },
        "1920/1440": {
            width: "25%",
            height: "100%",
            align: "r",
        },
        "1920/1082": {
            width: "25%",
            height: "100%",
            align: "r",
        },
        "1920/887": {
            width: "25%",
            height: "100%",
            align: "r",
        },
    },
};

export const shadowLayout: PartialLayout = {
    name: "backgroundShadow",
    height: "100%",
    width: "100%",
    layouts: [
        leftShadowLayout,
        rightShadowLayout,
    ],
    aspects: {
        "1920/4157": {
            sortBy: "vertical",
        },
        "1920/3408": {
            sortBy: "vertical",
        },
        "1920/2561": {
            sortBy: "vertical",
        },
        "1920/1440": {
            sortBy: "horizontal",
        },
        "1920/1082": {
            sortBy: "horizontal",
        },
        "1920/887": {
            sortBy: "horizontal",
        },
    },
};

export const backgroundLayout: PartialLayout = {
    name: "background_container",
    height: "100%",
    width: "100%",
    layouts: [{
        name: "background",
        top: 0, left: 0,
        alignIn: "c",
        width: "100%", height: "100%",
        scaleBy: "fit.out",
    }],
};
