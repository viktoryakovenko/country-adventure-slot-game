import {PartialLayout} from "app/layoutManager/LayoutManager";

export const betPanelLayout: PartialLayout = {
    name: "body",
    width: "100%",
    height: "100%",
    sortBy: "horizontal",
    layouts: [
        {
            name: "balance_label",
            avoidBounding: "yes",
            alignIn: "c",
            align: "l",
            scaleBy: "fit.in",
            width: "80%",
            height: "70%",
        },
        {
            name: "win_label",
            avoidBounding: "yes",
            alignIn: "c",
            align: "c",
            scaleBy: "fit.in",
            width: "80%",
            height: "70%",
        },
        {
            name: "total_bet",
            avoidBounding: "yes",
            alignIn: "c",
            align: "r",
            scaleBy: "fit.in",
            width: "80%",
            height: "70%",
        },
    ],
};
