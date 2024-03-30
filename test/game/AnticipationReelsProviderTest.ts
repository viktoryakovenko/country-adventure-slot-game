import {expect} from "chai";
import {SmartAnticipationReelsProvider} from "../../src/game/AnticipationReelsProvider";
import {TScatterWinResult, TSymbolId} from "app/server/service/typing";

describe("AnticipationReelsProvider", () => {
    describe("Smart anticipation reels provider", () => {
        const getScatterWinResult = (scattersOnReels: number[]): TScatterWinResult => {
            const symbolsAmount = scattersOnReels.reduce((value, accum) => value + accum, 0);
            const result: TScatterWinResult = {
                scatters: {
                    wins: [{win: 0, symbols: [], symbolsAmount, symbolId: TSymbolId.SCATTER}],
                    totalWin: 0,
                },
            };
            scattersOnReels.forEach((scattersOnReel, reelIndex) => {
                for (let i = 0; i < scattersOnReel; i++) {
                    result.scatters.wins[0].symbols.push({x: reelIndex, y: i});
                }
            });
            return result;
        };
        context("When scatters could be only on 0, 2, 4 reels", () => {
            const anticipationReelsProvider = new SmartAnticipationReelsProvider(
                5, TSymbolId.SCATTER, 3, [0, 2, 4],
            );
            context("When scatters on [1, 3, 5] reels", () => {
                it("Should be anticipation on 5th reel for scatters: [1, 0, 1, 0, 1]", () => {
                    const scatterWinResult = getScatterWinResult([1, 0, 1, 0, 1]);
                    const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                    expect(anticipationReels).deep.equal([0, 0, 0, 0, 1]);
                });
            });
            context("When scatters on [1, 5] reels", () => {
                [[1, 0, 0, 0, 1], [1, 0, 0, 0, 2]].forEach((scattersOnReels: number[]) => {
                    it(`Should not be anticipation on any reels for scatters: [${scattersOnReels}]`, () => {
                        const scatterWinResult = getScatterWinResult(scattersOnReels);
                        const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                        expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                    });
                });
            });
            context("When scatters on [1, 2] reels", () => {
                [[1, 0, 1, 0, 0]].forEach((scattersOnReels: number[]) => {
                    it(`Should be anticipation on 5th reel for scatters: [${scattersOnReels}]`, () => {
                        const scatterWinResult = getScatterWinResult(scattersOnReels);
                        const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                        expect(anticipationReels).deep.equal([0, 0, 0, 0, 1]);
                    });
                });
                [[1, 0, 2, 0, 0], [1, 0, 3, 0, 0]].forEach((scattersOnReels: number[]) => {
                    it(`Should not be anticipation on any reel for scatters: [${scattersOnReels}]`, () => {
                        const scatterWinResult = getScatterWinResult(scattersOnReels);
                        const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                        expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                    });
                });
                [[2, 0, 1, 0, 1], [2, 0, 2, 0, 1], [2, 0, 3, 0, 0]].forEach((scattersOnReels: number[]) => {
                    it(`Should be anticipation on 3rd reel for scatters: [${scattersOnReels}]`, () => {
                        const scatterWinResult = getScatterWinResult(scattersOnReels);
                        const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                        expect(anticipationReels).deep.equal([0, 0, 1, 0, 0]);
                    });
                });
            });
            context("When no scatters on reels", () => {
                it("Should be empty result", () => {
                    const anticipationReels = anticipationReelsProvider.provide({
                        scatters: {
                            wins: [],
                            totalWin: 0,
                        },
                    });
                    expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                });
            });
        });
        context("When 3 scatters enough for feature win", () => {
            context("When scatters could be on all reels", () => {
                const anticipationReelsProvider = new SmartAnticipationReelsProvider(
                    5, TSymbolId.SCATTER, 3, [0, 1, 2, 3, 4],
                );
                context("When no scatters on reels", () => {
                    it("Should be empty result", () => {
                        const scatterWinResult = getScatterWinResult([0, 0, 0, 0, 0]);
                        const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                        expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                    });
                });
                context("When scatters on [3] reels", () => {
                    [[0, 0, 2, 0, 0]].forEach((scattersOnReels: number[]) => {
                        it(`Should be anticipation at 2nd reel for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 0, 0, 1, 1]);
                        });
                    });
                    [[0, 0, 1, 0, 0]].forEach((scattersOnReels: number[]) => {
                        it(`Should not be anticipations for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
                context("When scatters on [1] reels", () => {
                    [[2, 0, 0, 0, 0]].forEach((scattersOnReels: number[]) => {
                        it(`Should be anticipation at 2nd reel for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 1, 1, 1, 1]);
                        });
                    });
                    [[1, 0, 0, 0, 0]].forEach((scattersOnReels: number[]) => {
                        it(`Should not be anticipations for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 0, 0, 0, 0]);
                        });
                    });
                });
                context("When scatters on [1, 2, *] reels", () => {
                    [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [1, 1, 0, 0, 0]].forEach((scattersOnReels: number[]) => {
                        it(`Should be anticipation at 3rd reel for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 0, 1, 1, 1]);
                        });
                    });
                    [[1, 1, 1, 0, 0], [1, 1, 2, 0, 0], [1, 1, 3, 1, 1]].forEach((scattersOnReels: number[]) => {
                        it(`Should be anticipation on 3rd reel for scatters: [${scattersOnReels}]`, () => {
                            const scatterWinResult = getScatterWinResult(scattersOnReels);
                            const anticipationReels = anticipationReelsProvider.provide(scatterWinResult);
                            expect(anticipationReels).deep.equal([0, 0, 1, 0, 0]);
                        });
                    });
                });
            });
        });
    });
});
