# internship-slot-backend
internship-slot-backend

### Main domain:
https://us-central1-internship-slot-backend.cloudfunctions.net/app/

---

## Login:
* https://domain.com/user/login/?login=user_name

It will create a new dev profile or log in to the existing one.

`user_name` you can define as a unique login name for you. Or use already existent for someone who.

Request: `TUserLoginData`
Response: `TInitResponse`
---
## Spin:
* https://domain.com/game/spin/?bet_id=3&lines_amount=8&login=user_name

This request needs to get a spin result, reel stop positions, wins, new balance, etc.;

`bet_id` this is chosen bet value id that needs to use while spinning;
`lines_amount` this is chosen lines amount that needs to use while spinning;
`user_name` user name that playing now;

Request: `TSpinRequest`
Response: `TSpinResponse`

---
## For dev:
* https://domain.com/user/all/

It will return a list of all existent users;

Request: `void`
Response: `TFullUserData[]`
 ---
## Force:
* https://domain.com/game/spin/force/?reel_stops=[0,0,0,0,0]&login=user_name

This request needs to get a next spin result, with expected reel stops positions;

`reel_stops` list of reel stop positions in json array style;
`user_name` user name that playing now;

Request: `TForceRequest`
Response: `TResponse`

---
## Test:
* http://localhost:3000/game/spin/test?bet_id=5&repeat=10&spins_amount=3000&login=user_name

This request needs to get statistics for each spin;

`bet_id` this is chosen bet value id that needs to use while spinning;
`repeat` repeat amount for spins set;
`spins_amount` amount of spins to get average vision;
`user_name` user name that playing now;

Request: `TSpinTestRequest`
Response: `Html table`

---

## Buy balance:
* https://domain.com/user/buy/?buy_amount=100&login=user_name

This request needs to add new credits to the user;

`buy_amount` number which you need to add to logged user balance;
`user_name` user name that playing now;

Request: `TBuyAmountRequest`
Response: `TResponse`

---
---

#Typing:

```
export type TFullUserData = {
    general: TUserData,
    loginData: TUserLoginData,
    stats: TUserStatsData
};
export type TUserData = {
    login: string,
    lang: string,
    denominator: number,
    currency: string
}

export type TUserLoginData = {
    pass: string,
    login: string,
}

export type TUserStatsData = {
    freeGames: number,
    balance: number,
    reelStops: number[],
    betId:number,
    lineId:number,
}

export type TSymbols = {
    name: string,
    isWild: boolean,
    isScatter: boolean,
    id: number,
}

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

export type TSpinRequest = TBetRequest & TLinesRequest & TLogin;

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

export type TInitResponse = {
    autoPlays: number[];
    strips: number[][];
    lines: number[][];
    bets: TBet[];
    symbols: TSymbols[];
    user: TUserData;
    userStats: TUserStatsData;
}

type TSymbolPosition = {
    x: number;
    y: number;
}

export type TScatterWin = {
    symbolId: number;
    symbolsAmount: number;
    win: number;
    symbols: TSymbolPosition[]
}
export type TWin = {
    lineId: number;
    symbolId: number;
    symbolsAmount: number;
    win: number;
}

type TResponseStatus = "Ok" | "Bad"

export type TResponse = {
    status: TResponseStatus;
    reason: string;
}

export type TSpinTestRequest = {
    spins_amount: string,
    repeat: string,
} & TBetRequest & TLinesRequest & TLogin;

export type TFreeSpinsResponse = {
    spins: TSpinResult[],
    totalWin: number,
}

export type TSpinResult = {
    userStats: TUserStatsData;
    wins: TWin[];
    scatterWins: TScatterWin[];
    totalWin: number;
    finalReelWindow: TReelWindow;
    freeSpins: TFreeSpinsResponse;
}

export type TSpinResponse = {
    user: TUserData;
} & TSpinResult;


```
