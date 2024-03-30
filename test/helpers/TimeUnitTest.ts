import {suite, test, timeout} from "@testdeck/mocha";
import {expect} from "chai";
import {promise, TimeUnit} from "../../src/helpers/TimeHelper";

@suite
export class TimeUnitTest {
    @test
    timeUnitConvertingTest() {
        expect(TimeUnit.mls.toMillis(60_000)).is.eq(60_000);
        expect(TimeUnit.mls.toSeconds(60_000)).is.eq(60);
        expect(TimeUnit.mls.toMinutes(60_000)).is.eq(1);

        expect(TimeUnit.sec.toMillis(60)).is.eq(60_000);
        expect(TimeUnit.sec.toSeconds(60)).is.eq(60);
        expect(TimeUnit.sec.toMinutes(60)).is.eq(1);

        expect(TimeUnit.min.toMillis(1)).is.eq(60_000);
        expect(TimeUnit.min.toSeconds(1)).is.eq(60);
        expect(TimeUnit.min.toMinutes(1)).is.eq(1);
    }

    @test
    @timeout(1000)
    async timeUnitAwaiterTest() {
        const duration = 0.5;
        const time = Date.now();
        await TimeUnit.sec.await(duration);
        expect(Date.now() - time)
            .is.greaterThan(duration * 1000)
            .is.lessThan(duration * 1000 * 2);
    }

    @test
    @timeout(3000)
    async promiseTest() {
        const time = Date.now();
        const expectedSeconds = 2;
        let count = expectedSeconds - 1;
        await promise.in(TimeUnit.sec).tobe(() => {
            return --count <= 0;
        }, expectedSeconds, 1);
        expect(Date.now() - time)
            .is.greaterThan(1000)
            .is.lessThan(1000 * expectedSeconds);
    }
}
