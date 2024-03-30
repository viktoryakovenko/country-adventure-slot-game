import {suite, test} from "@testdeck/mocha";
import {expect} from "chai";
import {correctDivision, correctMultiplication} from "../src/helpers/MathUtils";

@suite
export class MathUtilsTest {
    before() {
        // nothing
    }

    @test
    correctDivisionTest() {
        expect(correctDivision(0.15, 0.05)).equal(3);
    }

    @test
    correctMultiplicationTest() {
        expect(correctMultiplication(0.8, 3)).equal(2.4);
    }
}
