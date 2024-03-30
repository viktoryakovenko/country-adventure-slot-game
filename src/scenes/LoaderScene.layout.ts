import {PartialLayout} from "app/layoutManager/LayoutManager";

const loaderLayout: PartialLayout = {
    name: "loader_container",
    width: "80%",
    height: "40%",
    left: "10%",
    top: "20%",
    scaleBy: "fit.in",
    alignIn: "c",
    sortBy: "vertical",
    layouts: [
        {
            name: "logo",
            width: "60%",
            left: "20%",
            height: "90%",
            scaleBy: "fit.in",
            alignIn: "b",
        },
        {
            name: "bar",
            width: "100%",
            height: "75%",
            scaleBy: "fit.in",
            avoidBounding: "yes",
            top: "25%",
            alignIn: "t",
        },
    ],
};

export default loaderLayout;
