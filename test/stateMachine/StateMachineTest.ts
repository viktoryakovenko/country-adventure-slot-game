import {suite, test, timeout} from "@testdeck/mocha";
import StateMachine from "../../src/stateMachine/StateMachine";
import {State} from "../../src/stateMachine/State";
import {promiseDelay, TimeUnit} from "../../src/helpers/TimeHelper";
import {spy} from "sinon";
import {expect} from "chai";

type TestStates = "state1" | "state2" | "state3";

@suite
export class StateMachineTest {
    @test()
    @timeout(3000)
    async ttdRunTest() {
        const TestState = class extends State<TestStates> {
            constructor(private uid: 1 | 2 | 3) {
                super();
            }

            async run(): Promise<State<TestStates>> {
                await promiseDelay(1, TimeUnit.mls);
                if (this.uid == 1) {
                    return this;
                }
                return await this.goto(`state${this.uid}`);
            }
        };
        const mainState1 = new TestState(2);
        const mainState2 = new TestState(3);
        const mainState3 = new TestState(1);
        const run1Stub = spy(mainState1, "run");
        const run2Stub = spy(mainState2, "run");
        const run3Stub = spy(mainState3, "run");
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", mainState1);
        await stateMachine.add("state2", mainState2);
        await stateMachine.add("state3", mainState3);
        await stateMachine.goto("state1");
        expect(run1Stub.calledOnce).to.be.true;
        expect(run2Stub.calledOnce).to.be.true;
        expect(run3Stub.calledOnce).to.be.true;
    }

    @test()
    @timeout(3000)
    async stateEnalabilityTest() {
        const TestState = class extends State<TestStates> {
            constructor(private isEnable:boolean) {
                super();
            }

            enable(): boolean {
                return super.enable() && this.isEnable;
            }

            async run(): Promise<State<TestStates>> {
                await promiseDelay(1, TimeUnit.mls);
                return this;
            }
        };
        const mainState1 = new TestState(true);
        const mainState2 = new TestState(false);
        const mainState3 = new TestState(true);
        const run1Stub = spy(mainState1, "run");
        const run2Stub = spy(mainState2, "run");
        const run3Stub = spy(mainState3, "run");
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", mainState1);
        await stateMachine.add("state2", mainState2);
        await stateMachine.add("state3", mainState3);

        await stateMachine.goto("state1");
        await stateMachine.goto("state2");
        await stateMachine.goto("state3");

        expect(run1Stub.calledOnce).to.be.true;
        expect(run2Stub.calledOnce).to.be.false;
        expect(run3Stub.calledOnce).to.be.true;
    }

    @test
    async composeWouldBeCallOnlyOnceTest() {
        await this.checkHowMuchStateMethodsWouldBeCalled("compose", 3, 1);
    }

    @test
    async disposeWouldBeCallOnlyOnceTest() {
        await this.checkHowMuchStateMethodsWouldBeCalled("dispose", 3, 1);
    }

    @test
    async activateWouldBeCallOnlyOnceTest() {
        await this.checkHowMuchStateMethodsWouldBeCalled("activate", 3, 3);
    }

    @test
    async deactivateWouldBeCallOnlyOnceTest() {
        await this.checkHowMuchStateMethodsWouldBeCalled("deactivate", 3, 3);
    }

    @test
    async runWouldBeCallNTimesTest() {
        const TestState = class extends State<TestStates> {
            async run(): Promise<State<TestStates>> {
                return this;
            }
        };
        const testState = new TestState();
        const testState2 = new TestState();
        const stub = spy(testState, "run");
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", testState);
        await stateMachine.add("state2", testState2);
        await stateMachine.goto("state1");
        await stateMachine.goto("state2");
        await stateMachine.goto("state1");
        await stateMachine.goto("state2");
        await stateMachine.goto("state1");
        await stateMachine.goto("state2");
        expect(stub.callCount).to.be.eq(3);
    }

    @test
    async runForNotExistentStateTest() {
        const TestState = class extends State<TestStates> {
            async run(): Promise<State<TestStates>> {
                return this;
            }
        };
        const testState = new TestState();
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", testState);
        try {
            await stateMachine.goto("state2");
        } catch (e) {
            expect(e.message).to.be.eq("state state2 not existent");
        }
    }

    @test
    async removeStateTest() {
        const testState = new EmptyTestState();
        const disposeStub = spy(testState, "dispose");
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", testState);

        await stateMachine.remove("state1");

        expect(disposeStub.calledOnce).to.be.true;
    }

    @test
    async replaceStateTest() {
        const testState1 = new EmptyTestState();
        const testState2 = new EmptyTestState();
        const disposeStub1 = spy(testState1, "dispose");
        const composeStub1 = spy(testState1, "compose");
        const disposeStub2 = spy(testState2, "dispose");
        const composeStub2 = spy(testState2, "compose");
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", testState1);

        await stateMachine.replace("state1", testState2);

        expect(disposeStub1.calledOnce).to.be.true;
        expect(disposeStub2.calledOnce).to.be.false;
        expect(composeStub1.calledOnce).to.be.true;
        expect(composeStub2.calledOnce).to.be.true;
    }

    protected async checkHowMuchStateMethodsWouldBeCalled(
        method: keyof State<TestStates>,
        amountOfCalls: number,
        expectedAmountOfCalls: number
    ) {
        const testState = new EmptyTestState();
        const testState2 = new EmptyTestState();
        const stub = spy(testState, method);
        const stateMachine = new StateMachine<TestStates>();
        await stateMachine.add("state1", testState);
        await stateMachine.add("state2", testState2);
        for (let i = 0; i < amountOfCalls; i++) {
            await stateMachine.goto("state1");
            await stateMachine.goto("state2");
        }
        await stateMachine.dispose();
        expect(stub.callCount).to.be.equal(expectedAmountOfCalls);
    }
}

class EmptyTestState extends State<TestStates> {
    async run(): Promise<State<TestStates>> {
        return this;
    }
}
