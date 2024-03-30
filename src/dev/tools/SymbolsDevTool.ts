import SpineReelSymbol, {TAnimations, TSkins} from "app/controls/reels/SpineReelSymbol";
import ReelsControl from "app/controls/reels/ReelsControl";

export class SymbolsDevTool {
    constructor(readonly reelsControl: ReelsControl) {
    }

    getTool() {
        const eachAllSymbols = (callBack: (symbol: SpineReelSymbol)=>void)=>{
            this.reelsControl.reels.forEach(value => {
                value.getSymbolsSymbols().forEach(symbol => {
                    callBack(symbol);
                });
            });
        };
        const devToolProceed = (callBack: (symbol: SpineReelSymbol)=>void)=>{
            if (symbols.all) {
                eachAllSymbols(callBack);
            } else {
                callBack(this.reelsControl.reels[symbols.x].getSymbol(symbols.y));
            }
        };
        const symbols = {
            x: 0, y: 0,
            all: false,
            scale: {
                scale: 1,
                _scaleUpdate: () => {
                    devToolProceed(symbol => symbol.setScale({x: symbols.scale.scale}));
                },
            },
            skin: {
                skin: <TSkins>"wild",
                _skinItems: <TSkins[]>[
                    "high1",
                    "high2",
                    "high3",
                    "high4",
                    "low1",
                    "low2",
                    "low3",
                    "low4",
                    "low5",
                    "scatter",
                    "bonus",
                    "wild",
                    "blank",
                    "blur/high1",
                    "blur/high2",
                    "blur/high3",
                    "blur/high4",
                    "blur/low1",
                    "blur/low2",
                    "blur/low3",
                    "blur/low4",
                    "blur/low5",
                    "blur/scatter",
                    "blur/bonus",
                    "blur/wild",
                    "blur/blank",
                ],
                set: async () => {
                    devToolProceed(symbol => symbol.setSkin(symbols.skin.skin));
                },
            },
            play: {
                animation: <TAnimations>"win",
                track: 0,
                play: async () => {
                    devToolProceed(symbol => symbol.play(symbols.play.animation, {
                        trackIndex: symbols.play.track, loop: true,
                    }));
                },
            },

        };
        return symbols;
    }
}
