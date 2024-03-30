import {suite, test} from "@testdeck/mocha";
import dependencyManager from "../../src/model/injection/InjectDecorator";
import LayoutManager, {
    AspectLayoutKey,
    LayoutAlign,
    LayoutGameSize,
    LayoutPlugin,
    LayoutSize,
    PartialLayout,
} from "../../src/layoutManager/LayoutManager";
import {expect} from "chai";
import {stub} from "sinon";

@suite
export class LayoutManagerTest {
    private layoutManager:LayoutManager;
    private gameSize:LayoutGameSize;

    // noinspection JSUnusedGlobalSymbols
    before() {
        dependencyManager.unload();
        this.layoutManager = new LayoutManager();
        this.gameSize = {
            width: 200,
            height: 100,
            scale: 1,
            centerPosition: {x: 100, y: 50},
        };
    }

    @test
    getAspectKeyWithOneAspectKeyTest() {
        const layoutManager = new LayoutManager();
        const aspectKey = layoutManager.getAspectKey(["5/3"], 1.666);
        expect(aspectKey).is.equal("5/3");
    }

    @test
    getAspectKeyForAnyKeysTest() {
        const layoutManager = new LayoutManager();
        const aspects: AspectLayoutKey[] = ["5/3", "4/3", "3/4"];

        expect(layoutManager.getAspectKey(aspects, 4)).is.equal("5/3");
        expect(layoutManager.getAspectKey(aspects, 1.666)).is.equal("5/3");
        expect(layoutManager.getAspectKey(aspects, 1.5)).is.equal("5/3");
        expect(layoutManager.getAspectKey(aspects, 1.4)).is.equal("4/3");
        expect(layoutManager.getAspectKey(aspects, 1.333)).is.equal("4/3");
        expect(layoutManager.getAspectKey(aspects, 0.9)).is.equal("3/4");
        expect(layoutManager.getAspectKey(aspects, 0.75)).is.equal("3/4");
        expect(layoutManager.getAspectKey(aspects, 0)).is.equal("3/4");
    }

    @test
    smartPluginTest() {
        const constructorData = {
            applicationUpdateRequest: () => {},
        };
        const applicationUpdateRequestStub = stub(constructorData, "applicationUpdateRequest");
        this.layoutManager = new LayoutManager(constructorData.applicationUpdateRequest);
        const plugin:LayoutPlugin = {
            afterUpdate():void {},
            beforeUpdate():void {},
            dispose():void {},
            update() {},
        };
        const updateStub = stub(plugin, "update");
        const afterUpdateStub = stub(plugin, "afterUpdate");
        const beforeUpdateStub = stub(plugin, "beforeUpdate");
        const disposeStub = stub(plugin, "dispose");
        expect(applicationUpdateRequestStub.notCalled).to.be.true;
        this.layoutManager.addPlugin(plugin);
        expect(applicationUpdateRequestStub.calledOnce).to.be.true;
        this.layoutManager.addLayout({
            name: "body",
        });
        this.layoutManager.update(this.gameSize);
        expect(updateStub.calledOnce).to.be.true;
        expect(beforeUpdateStub.calledOnce).to.be.true;
        expect(afterUpdateStub.calledOnce).to.be.true;
        expect(disposeStub.notCalled).to.be.true;
        this.layoutManager.removePlugin(plugin);
        expect(disposeStub.calledOnce).to.be.true;
    }

    @test
    addExtendableLayoutTest():void {
        this.layoutManager.addLayout({
            name: "middleSizeBody",
            uid: "middleSizeBody",
            width: "50%",
            height: "50%",
        }, {
            name: "middlePositionBody",
            uid: "middlePositionBody",
            top: "50%",
            left: "50%",
        });
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "item",
            extend: ["middlePositionBody", "middleSizeBody"],
        })[0];

        this.layoutManager.update(this.gameSize);

        expect(partialLayout.finalLayout).to.be.deep.equal(<LayoutSize>{
            width: 100,
            height: 50,
            x: 100,
            y: 50,
        });
    }

    @test
    overrideExtendableLayoutValuesTest():void {
        this.layoutManager.addLayout({
            name: "middlePositionBody",
            uid: "middlePositionBody",
            top: "50%",
            left: "50%",
            width: "25%",
            height: "25%",
        });
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "item",
            extend: "middlePositionBody",
            width: "50%",
            height: "50%",
        })[0];

        this.layoutManager.update(this.gameSize);

        expect(partialLayout.finalLayout).to.be.deep.equal(<LayoutSize>{
            width: 100,
            height: 50,
            x: 100,
            y: 50,
        });
    }

    @test
    addLayoutTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
        })[0];

        expect(partialLayout.finalLayout).to.be.not.undefined;
        expect(partialLayout.finalLayout.x).to.be.undefined;
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.finalLayout.x).to.be.equal(0);
    }

    @test
    getLayoutTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
        })[0];

        expect(this.layoutManager.getLayoutByName("body")).to.be.equal(partialLayout);
    }

    @test
    removeLayoutTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            uid: "body",
        })[0];

        this.layoutManager.removeLayout(partialLayout);
        expect(this.layoutManager.getLayoutByName("body")).to.be.undefined;
    }

    @test
    tableLayoutTest() {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            width: 200,
            height: 100,
            display: "table",
            sortBy: "vertical",
            layouts: [
                {
                    name: "item1",
                    width: "100%",
                    height: "100%",
                },
                {
                    name: "item2",
                    width: "100%",
                    height: "100%",
                },
            ],
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.layouts[0].finalLayout).is.deep.equal({
            x: 0,
            y: 0,
            width: 200,
            height: 50,
        });
        expect(partialLayout.layouts[1].finalLayout).is.deep.equal({
            x: 0,
            y: 50,
            width: 200,
            height: 50,
        });
    }

    @test
    fixedLayoutTest() {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            width: 200,
            height: 100,
            layouts: [{
                name: "innerBody",
                width: "50%",
                height: "50%",
                top: "25%",
                left: "25%",
                display: "fixed",
                layouts: [
                    {
                        name: "item1",
                        width: "100%",
                        height: "100%",
                    },
                    {
                        name: "item2",
                        width: "100%",
                        height: "100%",
                    },
                ],
            }],
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.layouts[0].layouts[0].finalLayout).is.deep.equal({
            x: 50,
            y: 25,
            width: 100,
            height: 50,
        });
        expect(partialLayout.layouts[0].layouts[1].finalLayout).is.deep.equal({
            x: 50,
            y: 25,
            width: 100,
            height: 50,
        });
    }

    @test
    relativeLayoutTest() {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            width: 200,
            height: 100,
            display: "relative",
            sortBy: "horizontal",
            layouts: [
                {
                    name: "item1",
                    width: 25,
                    height: "100%",
                },
                {
                    name: "item2",
                    width: "100%",
                    height: "100%",
                },
            ],
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.layouts[0].finalLayout).is.deep.equal({
            x: 0,
            y: 0,
            width: 25,
            height: 100,
        });
        expect(partialLayout.layouts[1].finalLayout).is.deep.equal({
            x: 25,
            y: 0,
            width: 175,
            height: 100,
        });
    }

    @test
    addEmptyLayoutTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.finalLayout.x).is.equal(0);
        expect(partialLayout.finalLayout.y).is.equal(0);
        expect(partialLayout.finalLayout.width).is.equal(0);
        expect(partialLayout.finalLayout.height).is.equal(0);
    }

    @test
    positionTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            top: "10%",
            left: "10%",
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.finalLayout.x).is.equal(20);
        expect(partialLayout.finalLayout.y).is.equal(10);
    }

    @test
    alignLayoutTest():void {
        const testsData:Map<LayoutAlign, LayoutSize> = new Map();
        testsData.set("t", {
            x: 100,
            y: 0,
            width: 0,
            height: 0,
        });
        testsData.set("r", {
            x: 200,
            y: 50,
            width: 0,
            height: 0,
        });
        testsData.set("b", {
            x: 100,
            y: 100,
            width: 0,
            height: 0,
        });
        testsData.set("l", {
            x: 0,
            y: 50,
            width: 0,
            height: 0,
        });
        testsData.set("c", {
            x: 100,
            y: 50,
            width: 0,
            height: 0,
        });
        testsData.set("tr", {
            x: 200,
            y: 0,
            width: 0,
            height: 0,
        });
        testsData.set("tl", {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        });
        testsData.set("br", {
            x: 200,
            y: 100,
            width: 0,
            height: 0,
        });
        testsData.set("bl", {
            x: 0,
            y: 100,
            width: 0,
            height: 0,
        });
        testsData.forEach((value, align) => {
            this.checkAlignLayout(value, {
                name: "body",
                align: align,
            });
        });
    }

    @test
    alignLayoutForPercentBoundsTest():void {
        const testsData:Map<LayoutAlign, LayoutSize> = new Map();
        testsData.set("t", {
            x: 50,
            y: 0,
            width: 100,
            height: 50,
        });
        testsData.set("r", {
            x: 100,
            y: 25,
            width: 100,
            height: 50,
        });
        testsData.set("b", {
            x: 50,
            y: 50,
            width: 100,
            height: 50,
        });
        testsData.set("l", {
            x: 0,
            y: 25,
            width: 100,
            height: 50,
        });
        testsData.set("c", {
            x: 50,
            y: 25,
            width: 100,
            height: 50,
        });
        testsData.set("tr", {
            x: 100,
            y: 0,
            width: 100,
            height: 50,
        });
        testsData.set("tl", {
            x: 0,
            y: 0,
            width: 100,
            height: 50,
        });
        testsData.set("br", {
            x: 100,
            y: 50,
            width: 100,
            height: 50,
        });
        testsData.set("bl", {
            x: 0,
            y: 50,
            width: 100,
            height: 50,
        });
        testsData.forEach((value, align) => {
            this.checkAlignLayout(value, {
                name: "body",
                align: align,
                width: "50%",
                height: "50%",

            });
        });
    }

    @test("alignLayoutsTest for inner layouts")
    alignLayoutsTest():void {
        const partialLayout:PartialLayout = this.layoutManager.addLayout({
            name: "body",
            width: "50%",
            height: "50%",
            top: "25%",
            left: "25%",
            layouts: [{
                name: "item1",
                top: "10%",
                left: "10%",
                width: "50%",
                height: "50%",
            }],
        })[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.layouts[0].finalLayout).is.deep.equal(<LayoutSize>{
            width: 50,
            height: 25,
            x: 60,
            y: 30,
        });
    }

    checkAlignLayout(expectedLayoutSize:LayoutSize, partialLayout1:PartialLayout) {
        this.layoutManager.clearLayouts();
        const partialLayout:PartialLayout = this.layoutManager.addLayout(partialLayout1)[0];
        this.layoutManager.update(this.gameSize);
        expect(partialLayout.finalLayout).is.deep.equal(expectedLayoutSize);
    }
}
