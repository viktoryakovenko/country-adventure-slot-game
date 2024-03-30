import MainControl from "app/controls/MainControl";
import gameModel from "app/model/GameModel";
import LineDrawer from "app/view/lines/LineDrawer";
import {Graphics} from "@pixi/graphics";
import {TWin} from "app/server/service/typing";
import pgsap from "app/helpers/promise/gsap/PromisableGsap";
import {Container} from "@pixi/display";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import {ensure} from "app/helpers/ObjectHelper";
import {Color} from "pixi.js";
import SpineControl from "app/controls/SpineControl";
interface LineViewControl {
    highlight(): Promise<void>;
}
export class LineSpineViewControl extends SpineControl implements LineViewControl {
    constructor(readonly id: number) {
        super("paylines");
    }

    async highlight() {
        await this.show();
        this.container.alpha = 0.5;
        await pgsap.to(this.container, {duration: 0.0625, alpha: 1});
        await pgsap.to(this.container, {duration: 0.125, alpha: 0});
        this.container.alpha = 1;
        await this.hide();
    }

    async show(): Promise<this> {
        await super.show();
        await this.play(`${this.id}`);
        return this;
    }
}
export class LineViewControlImpl extends MainControl {
    constructor(linePath: number[], lineColor: number) {
        super();
        const line = LineDrawer.draw({
            linePath, color: lineColor, fillColor: 0xFFFFFF,
        });
        this.container.addChild(line);
    }

    async highlight() {
        await this.show();
        this.container.alpha = 0.5;
        await pgsap.to(this.container, {duration: 0.0625, alpha: 1});
        await pgsap.to(this.container, {duration: 0.125, alpha: 0});
        this.container.alpha = 1;
        await this.hide();
    }
}

type LineConfig = {
    id: number,
    orderOffset: number,
    yOffset: number,
    color: Color,
};

export class LineControl extends MainControl {
    protected readonly line: MainControl & LineViewControl;

    constructor(container: Container, lineConfig: LineConfig) {
        super(container);
        const mainGameInfo = gameModel.mainGameInfo;
        const lines = mainGameInfo.lines;
        const yPadding = 40;
        const reelHeight = 866;
        const reelWidth = 1410;
        const yOffset = (reelHeight - yPadding) / lines.length;
        const y = lineConfig.yOffset + lineConfig.orderOffset * yOffset + yPadding;
        this.line = new LineSpineViewControl(lineConfig.id);
        this.line.container.name = `${lineConfig.id}_line`;
        this.line.setPosition({
            x: reelWidth * .5,
            y: y,
        });
        this.line.hide().then();
        this.add(this.line);
    }

    async highlight() {
        await this.line.highlight();
    }

    async show(): Promise<this> {
        await this.line.show();
        return super.show();
    }

    async hide() {
        await this.line.hide();
        return this;
    }
}

export default class LinesControl extends MainControl {
    readonly config = {
        lineColours: [
            new Color("#f370e0"),
            new Color("#8800ff"),
            new Color("#ff0000"),
            new Color("#ffff00"),
            new Color("#7ad8fd"),
            new Color("#00ff00"),
            new Color("#ff8800"),
            new Color("#91efe8"),
            new Color("#ffc08c"),
            new Color("#ff008c"),
            new Color("#ff008c"),
        ],
        lines: <LineConfig[]>[
            {
                id: 4,
                orderOffset: 0,
                yOffset: 80,
                color: new Color("#f370e0"),
            },
            {
                id: 7,
                orderOffset: 1,
                yOffset: 30,
                color: new Color("#8800ff"),
            },
            {
                id: 0,
                orderOffset: 2,
                yOffset: -20,
                color: new Color("#ff0000"),
            },
            {
                id: 1,
                orderOffset: 3,
                yOffset: 50,
                color: new Color("#ffff00"),
            },
            {
                id: 3,
                orderOffset: 4,
                yOffset: 0,
                color: new Color("#7ad8fd"),
            },
            {
                id: 2,
                orderOffset: 5,
                yOffset: -50,
                color: new Color("#00ff00"),
            },
            {
                id: 8,
                orderOffset: 6,
                yOffset: 20,
                color: new Color("#ff8800"),
            },
            {
                id: 6,
                orderOffset: 7,
                yOffset: -30,
                color: new Color("#91efe8"),
            },
            {
                id: 5,
                orderOffset: 8,
                yOffset: -80,
                color: new Color("#ffc08c"),
            },
            {
                id: 9,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 10,
                orderOffset: 1,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 11,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 12,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 13,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 14,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 15,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 16,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 17,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 18,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 19,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
            {
                id: 20,
                orderOffset: 9,
                yOffset: -90,
                color: new Color("#ff008c"),
            },
        ].sort((a, b) => {
            return (gameModel.mainGameInfo.lines[a.id] ?? [3])[0] - (gameModel.mainGameInfo.lines[b.id] ?? [3])[0];
        }),
    };
    protected readonly lines: LineControl[] = [];

    constructor() {
        super();
    }

    init() {
        super.init();
        const mainGameInfo = gameModel.mainGameInfo;
        const lines = mainGameInfo.lines;
        this.config.lines.forEach((line, index) => {
            line.orderOffset = index;
            line.color = this.config.lineColours[index % this.config.lineColours.length];
            line.yOffset = 0;
        });
        const reelTexture = StrictResourcesHelper.getSomeTexture("reels.png");
        const reels = mainGameInfo.reels;
        const symbolWidth = mainGameInfo.symbol.width;
        const reelGap = reels.reelGap;
        const width = reels.amount * (symbolWidth + reelGap);
        const height = width * (reelTexture.height / reelTexture.width);
        const body = new Graphics()
            .beginFill(0xff0000, 0.0)
            .drawRect(0, 0, width, height);
        this.container.addChild(body);
        for (let i = 0; i < lines.length; i++) {
            const lineConfig = ensure(this.config.lines.find(value => value.id == i));
            this.lines.push(new LineControl(this.container, lineConfig));
        }
    }

    async showLine(lineNumber: number) {
        await this.lines[lineNumber].show();
    }

    async showLines(wins: TWin[]) {
        await wins.map(value => value.lineId).map(async value => {
            await this.lines[value].show();
        }).promise().all();
    }

    async hideLines(wins: TWin[]) {
        await wins.map(value => value.lineId).map(async value => {
            await this.lines[value].hide();
        }).promise().all();
    }

    async hideAllLines() {
        await this.lines.map(async value => await value.hide()).promise().all();
    }
}
