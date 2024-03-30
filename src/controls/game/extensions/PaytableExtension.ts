import {ControlExtension} from "app/controls/MainControl";
import SpineControl from "app/controls/SpineControl";
import {Text, TextStyleAlign} from "@pixi/text";
import TextStyles from "app/model/TextStyles";
import gameModel from "app/model/GameModel";
import {ensure} from "app/helpers/ObjectHelper";
import {Container} from "@pixi/display";
import {TSymbol, TSymbolId} from "app/server/service/typing";
import {Sprite} from "@pixi/sprite";
import StrictResourcesHelper from "app/pixi/StrictResourcesHelper";
import BetModel from "app/model/BetModel";
import {$} from "app/model/injection/InjectDecorator";
import SpineReelSymbol, {TSkins} from "app/controls/reels/SpineReelSymbol";

class SymbolInfo extends Container {
    constructor(symbol: TSymbol, bet: number) {
        super();
        symbol.pays
            .map((pay, i) => ({pay: pay * bet, i}))
            .filter(value => value.pay != 0)
            .forEach((pay, i) => {
                const symbolsAmountContainer = new Text(`${pay.i + 1} - `, TextStyles.PAYTABLE_TITLE_STYLE);
                symbolsAmountContainer.anchor.set(1, 0.5);
                const payContainer = new Text(`${pay.pay.toFixed(2)}`, TextStyles.PAYTABLE_WHITE_TITLE_STYLE);
                payContainer.anchor.set(0, 0.5);
                payContainer.y = symbolsAmountContainer.y = i * 120;
                this.addChild(payContainer, symbolsAmountContainer);
            });
    }
}

class LineBox extends Container {
    constructor(line: number[]) {
        super();
        line.forEach((value, index) => {
            const reelHeight = 3;
            for (let i = 0; i < reelHeight; i++) {
                const textureId = `ball_${value == i ? "orange" : "white"}.png`;
                const ball = new Sprite(StrictResourcesHelper.getSomeTexture(textureId));
                const scale = reelHeight;
                const padding = 5;
                const size = (16 + padding) * scale;
                ball.scale.set(scale);
                ball.position.set(
                    (index - line.length / 2) * size,
                    (i - reelHeight / 2) * size,
                );
                this.addChild(ball);
            }
        });
    }
}

export default class PaytableExtension implements ControlExtension<SpineControl> {
    init(instance: SpineControl): void {
        instance.spine.spineData.slots
            .filter(value => value.name.includes("to_translate"))
            .map(value => value.name)
            .forEach(value => {
                const style = value.includes("head") ? TextStyles.PAYTABLE_TITLE_STYLE : TextStyles.PAYTABLE_STYLE;
                const align: TextStyleAlign = value.includes("_LA_") ? "left" : "center";
                const alignStyle = {...style, align};
                const text = new Text(value, alignStyle);
                text.anchor.set(0.5);
                text.name = value;
                instance.replace(value, text, true);
            });
        this.initFirstPage(instance);
        this.initPaytablePages(instance);
        this.initLinePages(instance);
    }

    private initFirstPage(spineControl: SpineControl) {
        const fsAmount = new Text("x3 = 5 \nx4 = 10 \nx5 = 20 \nx6 = 40", TextStyles.PAYTABLE_SCATTER_STYLE);
        fsAmount.anchor.set(0.5);
        spineControl.replace("p1_fs_amount_1", fsAmount, true);
        const scatterSymbolData = ensure(gameModel.mainGameInfo.symbols.find(value => value.id == TSymbolId.BONUS));
        const container1 = new Container();
        const container2 = new Container();
        for (let i = 1; i <= 10; i++) {
            const scattersAmount = new Text(`${i} - `, TextStyles.PAYTABLE_TITLE_STYLE);
            scattersAmount.anchor.set(1, 0.5);
            const bonusPay = new Text(`${scatterSymbolData.pays[i - 1]}`, TextStyles.PAYTABLE_WHITE_TITLE_STYLE);
            bonusPay.anchor.set(0, 0.5);
            const container = (i % 2) + 1 == 1 ? container2 : container1;
            const padding = 70;
            bonusPay.y = scattersAmount.y = i * padding - ((i - 1) % 2) * padding;
            container.addChild(bonusPay, scattersAmount);
        }
        spineControl.replace("scatters_on_fs_ammount_column1", container1);
        spineControl.replace("scatters_on_fs_ammount_column2", container2);
    }

    private initPaytablePages(spineControl: SpineControl) {
        const bet = $(BetModel).getChosenBet().value;
        gameModel.mainGameInfo.symbols
            .filter(value => !value.isScatter && !value.isWild && value.name != "blank")
            .forEach((value, i) => {
                spineControl.replace(`symbol/description${i + 1}`, new SymbolInfo(value, bet));
                const spineReelSymbol = new SpineReelSymbol("symbols");
                const skin = <TSkins>value.name.toLowerCase();
                spineControl.replace(skin, spineReelSymbol.container);
                spineReelSymbol.setScale({x: 1.5});
                setTimeout(()=>{
                    spineReelSymbol.setSkin(skin);
                    spineReelSymbol.play("win", {loop: true, timeScale: 0.25});
                }, 1);
            });
    }

    private initLinePages(spineControl: SpineControl) {
        gameModel.mainGameInfo.lines.forEach((value, i) => {
            spineControl.replace(`winline${i + 1}`, new LineBox(value));
        });
    }

    dispose(): void {}
}
