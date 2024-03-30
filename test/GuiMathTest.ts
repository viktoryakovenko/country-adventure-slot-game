import {getCirclePolygons, hexToRgb} from "../src/helpers/GuiMath";
import {expect} from "chai";

describe("GuiMathTest", function() {
    it("should convert hex to rgb", function() {
        expect(hexToRgb("#ffffff")).to.be.not.null;
        expect(hexToRgb("#ffffff")).deep.equal({
            r: 255,
            g: 255,
            b: 255,
        });
    });

    it("should get circle polygons", function() {
        const circlePolygons = getCirclePolygons({radius: 10, steps: 4});
        expect(circlePolygons).deep.equal([20, 10, 10, 20, 0, 10, 10, 0]);
    });
});
