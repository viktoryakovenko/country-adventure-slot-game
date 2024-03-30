import {suite, test, timeout} from "@testdeck/mocha";
import Signal from "../../../../src/helpers/signals/signal/Signal";
import {expect} from "chai";
import SignalSlotCounter from "../../../../src/helpers/signals/signal/SignalSlotCounter";

@suite
export class SignalTest {
    @test("add will not throw any errors")
    @timeout(1000)
    async addToSignalTest() {
        const signal = new Signal<string>();
        signal.add(() => {
        });
    }

    @test("emit will call signal slots")
    @timeout(1000)
    async emitWillCallAddedSlotsTest() {
        const signal = new Signal<string>();
        const signalSlotCounter1 = new SignalSlotCounter();
        const signalSlotCounter2 = new SignalSlotCounter();
        signal.add(signalSlotCounter1.signalSlot);
        signal.add(signalSlotCounter2.signalSlot);
        expect(signalSlotCounter1.counter).is.eq(0);
        expect(signalSlotCounter2.counter).is.eq(0);
        signal.emit("Hi");
        expect(signalSlotCounter1.counter).is.eq(1);
        expect(signalSlotCounter2.counter).is.eq(1);
    }

    @test("emit will call signal slots in priory")
    @timeout(1000)
    async emitWillCallAddedSlotsByPrioryTest() {
        const signal = new Signal<string>();
        const signalSlotCounter1 = new SignalSlotCounter();
        const signalSlotCounter2 = new SignalSlotCounter();
        signal.add(signalSlotCounter1.signalSlot);
        signal.add(signalSlotCounter2.signalSlot);
        signal.add(() => {
            signal.remove(signalSlotCounter2.signalSlot);
        }, this, -1);
        expect(signalSlotCounter1.counter).is.eq(0);
        expect(signalSlotCounter2.counter).is.eq(0);
        signal.emit("Hi");
        expect(signalSlotCounter1.counter).is.eq(1);
        expect(signalSlotCounter2.counter).is.eq(0);
    }

    @test("emit will call signal slots in priory")
    @timeout(1000)
    async reAddTest() {
        const signal = new Signal<string>();
        const signalSlotCounter1 = new SignalSlotCounter();
        const signalSlotCounter2 = new SignalSlotCounter();
        signal.add(signalSlotCounter1.signalSlot);
        signal.add(signalSlotCounter1.signalSlot);
        signal.reAdd(signalSlotCounter2.signalSlot);
        signal.reAdd(signalSlotCounter2.signalSlot);
        expect(signalSlotCounter1.counter).is.eq(0);
        expect(signalSlotCounter2.counter).is.eq(0);
        signal.emit("Hi");
        expect(signalSlotCounter1.counter).is.eq(2);
        expect(signalSlotCounter2.counter).is.eq(1);
    }

    @test()
    @timeout(1000)
    async promiseSignalTest() {
        const signal = new Signal<string>();
        setTimeout(() => {
            signal.emit("Hello World");
        }, 10);
        const promiseResult = await signal.promise();
        expect(promiseResult).to.be.eq("Hello World");
    }

    @test()
    @timeout(1000)
    async signalWillNotWorkAfterRemoveTest() {
        const signalCalculator = new SignalSlotCounter();
        const signal = new Signal<string>();
        signal.add(signalCalculator.signalSlot);
        expect(signalCalculator.counter).to.be.eq(0);
        signal.emit("Hello World");
        expect(signalCalculator.counter).to.be.eq(1);
        signal.remove(signalCalculator.signalSlot);
        signal.emit("Hello World");
        signal.emit("Hello World");
        signal.emit("Hello World");
        expect(signalCalculator.counter).to.be.eq(1);
    }

    @test()
    @timeout(1000)
    async signalWillNotWorkAfterRemoveWithCtxTest() {
        const signalCalculator = new SignalSlotCounter();
        const signal = new Signal<string>();
        signal.add(signalCalculator.signalSlot, this);
        expect(signalCalculator.counter).to.be.eq(0);
        signal.emit("Hello World");
        expect(signalCalculator.counter).to.be.eq(1);
        signal.remove(signalCalculator.signalSlot);
        signal.emit("Hello World");
        signal.emit("Hello World");
        signal.emit("Hello World");
        expect(signalCalculator.counter).to.be.eq(1);
    }

    @test()
    @timeout(1000)
    async filterSignalTest() {
        const signal = new Signal<string>();
        setTimeout(() => {
            signal.emit("UnExpected Signal");
            signal.emit("Expected Signal");
        }, 10);
        const promiseResult = await signal.filter(payload => payload == "Expected Signal").promise();
        expect(promiseResult).to.be.eq("Expected Signal");
    }

    @test()
    @timeout(1000)
    async filterSignalCouldBeUnloadedTest() {
        const signal = new Signal<string>();
        setTimeout(() => {
            signal.emit("UnExpected Signal");
            signal.emit("Expected Signal");
        }, 10);
        const filteredSignal = signal.filter(payload => payload == "Expected Signal", this);
        const promiseResult = await filteredSignal.promise();
        expect(promiseResult).to.be.eq("Expected Signal");
        setTimeout(() => {
            signal.emit("UnExpected Signal");
            signal.emit("Expected Signal");
        }, 10);
        const promiseResult2 = await filteredSignal.promise();
        expect(promiseResult2).to.be.eq("Expected Signal");
        setTimeout(() => {
            signal.emit("UnExpected Signal");
            signal.emit("Expected Signal");
        }, 10);
        signal.unload(this);
        const promiseResult3 = await Promise.race([
            filteredSignal.promise(),
            new Promise(resolve => setTimeout(() => resolve("Timeout Break Result"), 100)),
        ]);
        expect(promiseResult3).to.be.eq("Timeout Break Result");
    }
}
