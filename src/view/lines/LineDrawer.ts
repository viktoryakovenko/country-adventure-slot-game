import {Graphics} from "@pixi/graphics";
import gameModel from "app/model/GameModel";

export default class LineDrawer {
    static draw(data: {linePath: number[], color: number, fillColor: number}) {
        const {linePath, color, fillColor} = data;
        const width = 4;
        const mainGameInfo = gameModel.mainGameInfo;
        const symbol = mainGameInfo.symbol;
        const graphics = new Graphics();
        const lineYOffset = linePath[0];
        graphics.lineStyle(width * 2.5 + 5, 0x000);
        this.drawLine(graphics, symbol, linePath, lineYOffset, 0);
        graphics.lineStyle(width * 2.5, color);
        this.drawLine(graphics, symbol, linePath, lineYOffset, 0);
        graphics.lineStyle(width, fillColor);
        this.drawLine(graphics, symbol, linePath, lineYOffset, -2);
        return graphics;
    }

    private static drawLine(
        graphics: Graphics,
        symbol: {width: number, height: number},
        linePath: number[],
        lineYOffset: number, lineYOffset2: number,
    ) {
        const mainGameInfo = gameModel.mainGameInfo;
        const reels = mainGameInfo.reels;
        const symbolWidth = symbol.width;
        const reelFrameGap = reels.reelFrameGap;
        const reelGap = reels.reelGap;
        const someGapToReelFrame = 5;
        graphics.moveTo(reelFrameGap, lineYOffset2);
        graphics.lineTo(symbolWidth * .5 + reelFrameGap, lineYOffset2);
        linePath.forEach((yOffset, x: number) => {
            graphics.lineTo(
                x * (symbolWidth + reelGap) + symbolWidth * .5 + reelFrameGap * 2,
                (yOffset - lineYOffset) * symbol.height + lineYOffset2,
            );
        });
        graphics.lineTo(
            linePath.length * (symbolWidth + reelGap) + someGapToReelFrame + reelFrameGap,
            (linePath[linePath.length - 1] - lineYOffset) * symbol.height + lineYOffset2,
        );
    }
}
