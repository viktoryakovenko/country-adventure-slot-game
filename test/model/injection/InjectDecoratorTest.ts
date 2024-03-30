import {suite, test} from "@testdeck/mocha";
import dependencyManager, {inject} from "../../../src/model/injection/InjectDecorator";
import {assert, expect} from "chai";
import {Composer, Disposer} from "../../../src/scenes/model/Scene";

@suite
export class InjectDecoratorTest {
    before() {
        dependencyManager.unload();
    }

    @test
    async injectionTest() {
        const testTarget = new TestTarget();
        dependencyManager.register(TestTarget, testTarget);
        const testClass = new TestClass();
        await testClass.compose();
        expect(testClass.target)
            .is.not.equal(undefined);
        expect(testClass.target).is.equal(testTarget);
        await testClass.dispose();
        expect(testClass.target).is.equal(undefined);
    }

    @test
    resolveTest() {
        const expectedResult = new TestTarget();
        const actualResult = dependencyManager.resolve(TestTarget, () => {
            return expectedResult;
        });
        expect(actualResult).is.equal(expectedResult);
    }

    @test
    resolveWithNullInstanceTest() {
        assert.throw(() => {
            dependencyManager.resolve(TestTarget);
        }, "key: class TestTarget {\r\n} is not defined.");
    }

    @test
    hasTest() {
        const expectedResult = new TestTarget();
        expect(dependencyManager.has(TestTarget)).is.equal(false);
        expect(
            dependencyManager
                .register(TestTarget, expectedResult)
                .has(TestTarget)
        ).is.equal(true);
    }
}

class TestTarget {

}

class TestClass implements Composer<void>, Disposer<void> {
    @inject(TestTarget)
    public target: TestTarget;

    compose() {}

    dispose(): void {}
}
