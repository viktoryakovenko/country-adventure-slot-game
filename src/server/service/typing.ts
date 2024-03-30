export enum TSymbolId {
    SCATTER = 1,
    BONUS,
    WILD,
    LOW1,
    LOW2,
    LOW3,
    LOW4,
    LOW5,
    HIGH1,
    HIGH2,
    HIGH3,
    HIGH4,
    BLANK,
    WILD_BONUS1,
    WILD_BONUS2,
}

export type TStripSymbol<SymbolId extends number> = {
    id: SymbolId;
    name: string;
    pays: number[];
};

export type TSymbol = {
    isScatter: boolean;
    isWild: boolean;
    pays: number[];
} & TStripSymbol<TSymbolId>;

export type TFullUserData = {
    general: TUserData,
    loginData: TUserLoginData,
    stats: TUserStatsData
};
export type TUserData = {
    userId: string,
    login: string,
    lang: string,
    denominator: number,
    currency: string
};

export type TUserLoginData = {
    pass: string,
    login: string,
};

export type TUserStatsData = {
    freeGames: number,
    balance: number,
    reelStops: number[],
    betId: number,
    lineId: number,
};

export type TBet = {
    id: number;
    value: number
};

export type TBetRequest = {
    bet_id: string;
};
export type TLinesRequest = {
    lines_amount: string;
};

export type TLogin = {login: string};

export type TSpinRequest = TBetRequest & TLinesRequest & TLogin & TGameKeyDto;

export type TBuyAmountRequest = {
    /**
     * amount of credits that should be added to the user balance
     */
    buy_amount: string;
} & TLogin;

export type TForceRequest = {
    /**
     * it should be json array like: '[0,0,0,0,0]'
     */
    reel_stops: string;
} & TLogin;

export type TReel = [number, number, number];
export type TReelWindow = [TReel, TReel, TReel, TReel, TReel];
export type TFeatureWin = {
    totalWin: number;
};
export type FeatureWin<T, PropertyName extends string> = { [key in PropertyName]: T } & TFeatureWin;
export type TInitGameData = {
    autoPlays: number[];
    strips: TSymbolId[][];
    lines: number[][];
    bets: TBet[];
    symbols: TSymbol[];
};
export type TInitResponse = {
    user: TUserData;
    userStats: TUserStatsData;
} & TInitGameData;

export type TSymbolPosition = {
    x: number;
    y: number;
};

export type TScatterWin = {
    symbolId: number;
    symbolsAmount: number;
    win: number;
    symbols: TSymbolPosition[]
};
export type TWin = {
    lineId: number;
    symbolId: TSymbolId;
    symbolsAmount: number;
    win: number;
};

type TResponseStatus = "Ok" | "Bad";

export type TResponse = {
    status: TResponseStatus;
    reason: string;
};
export type TGameKey = "png" | "internship";
export type TGameKeyDto = {
    gameKey: TGameKey,
};

export type TFreeSpinsResponse<T> = {
    spins: T[],
} & TFeatureWin;

export type TFreeSpinsFeature<T> = {
    freeSpins: TFreeSpinsResponse<T & TFreeSpinsFeature<T>>;
};

export type TWinLineResult = {winLines: FeatureWin<TWin[], "wins">};
export type TScatterWinResult = {scatters: FeatureWin<TScatterWin[], "wins">};
export type TJumpingWild = {
    jumpFrom: TSymbolPosition,
    jumpTo: TSymbolPosition,
    replaceOn: TSymbolId,
};
export type TJumpingWildFeature = { wildFeature: FeatureWin<TJumpingWild[][], "jumps"> };

export type TReelSpinResult = {
    userStats: TUserStatsData;
    finalReelWindow: number[][];
    reelWindow: number[][];
} & TFeatureWin;
type TReelSpinResultWithFeatures =
    TReelSpinResult &
    TWinLineResult &
    TScatterWinResult &
    TJumpingWildFeature;
export type TFreeSpinsFeatureResult = TFreeSpinsFeature<TReelSpinResultWithFeatures>;
export type TSpinResult = TReelSpinResultWithFeatures & TFreeSpinsFeatureResult;

export type TSpinResponse = {
    user: TUserData;
} & TSpinResult;

