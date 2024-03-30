import {PartialLayout} from "app/layoutManager/LayoutManager";

const scatterLayout: PartialLayout = {
    name: "scatter_container",
    width: "100%",
    height: "100%",
    top: 0, left: 0,
    layouts: [{
        name: "intro_content_scatter",
        width: "80%", height: "80%",
        top: "10%", left: "15%",
        avoidBounding: "yes",
        scaleBy: "fit.in",
        alignIn: "c",
        aspects: {
            "1920/4157": {
                left: "10%",
            },
            "1920/3408": {
                left: "10%",
            },
            "1920/2561": {
                left: "10%",
            },
            "1920/1440": {
                left: "15%",
            },
            "1920/1082": {
                left: "15%",
            },
            "1920/887": {
                left: "15%",
            },
        },
    }],
};

const wildLayout: PartialLayout = {
    name: "wild_container",
    width: "100%", height: "100%",
    top: 0, left: 0,
    layouts: [{
        name: "intro_content_wild",
        width: "80%", height: "80%",
        top: "10%", left: "5%",
        avoidBounding: "yes",
        scaleBy: "fit.in",
        alignIn: "c",
        aspects: {
            "1920/4157": {
                left: "10%",
            },
            "1920/3408": {
                left: "10%",
            },
            "1920/2561": {
                left: "10%",
            },
            "1920/1440": {
                left: "5%",
            },
            "1920/1082": {
                left: "5%",
            },
            "1920/887": {
                left: "5%",
            },
        },
    }],
};

export const introBackground: PartialLayout = {
    name: "shadow",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    scaleBy: "fit.out",
};
const introLayout: PartialLayout = {
    name: "intro_container",
    width: "100%",
    height: "100%",
    top: "0%",
    left: "0%",
    scaleBy: "fit.in",
    alignIn: "c",
    sortBy: "vertical",
    display: "relative",
    layouts: [
        {
            name: "header",
            width: "100%", height: "20%",
            top: "0%", left: "0%",
            layouts: [{
                width: "80%", height: "100%",
                top: "0%", left: "0%",
                name: "intro_header",
                align: "t",
                alignIn: "c",
                scaleBy: "fit.in",
                aspects: {
                    "1920/4157": {
                        width: "80%",
                    },
                    "1920/3408": {
                        width: "80%",
                    },
                    "1920/2561": {
                        width: "80%",
                    },
                    "1920/1440": {
                        width: "50%",
                    },
                    "1920/1082": {
                        width: "50%",
                    },
                    "1920/887": {
                        width: "50%",
                    },
                },
            }],
        },
        {
            name: "intro_content",
            width: "100%",
            height: "70%",
            top: "0%",
            left: "0%",
            display: "table",
            alignIn: "c",
            layouts: [
                scatterLayout,
                wildLayout,
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
        },
        {
            name: "intro_footer",
            width: "80%",
            height: "10%",
            left: "10%",
            top: "0%",
            avoidBounding: "yes",
            scaleBy: "fit.in",
            alignIn: "c",
        },
    ],
};

export default introLayout;
