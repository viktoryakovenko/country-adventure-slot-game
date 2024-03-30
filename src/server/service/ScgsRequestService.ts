import {
    TForceRequest,
    TFullUserData,
    TInitResponse,
    TLogin,
    TResponse,
    TSpinRequest,
    TSpinResponse,
} from "./typing";
import {IRequestService} from "app/server/service/IRequestService";
import {TokenProvider} from "app/server/service/TokenProvider";
import {$} from "app/model/injection/InjectDecorator";
import BetModel from "app/model/BetModel";

export type GameAction =
    | "spin"
    | "gamble"
    | "pick";
type ScgsActionResponse = {
    balance: {
        initial: string,
        afterbet: string,
        final: string,
    },
    gamepayload: Omit<TSpinResponse, "user"> & {
        reelStops: number[],
    },
};
type ScgsActionRequest = {
    gameid: string;
    operatorid: string;
    channel: string | "desktop";
    operatorpayload?: string;
    gamesessionid: string;
    gamepayload: {
        bet: number,
        lines: number,
    };
    action: GameAction;
    bet: number;

};
type ScgsInitRequest = {
    gameid: string,
    operatorid: string,
    channel: string,
    token: string,
};
type ScgsInitResponse = {
    gamesessionid: string;
    account: {
        userid: string,
        balance: string,
        currency: string,
    },
    gamepayload: Omit<TInitResponse, "user">,
};
type GameApi = "/game/init" | "/game/action";
export default class ScgsRequestService implements IRequestService {
    protected readonly baseUrl: string;
    protected readonly gameid: string;
    protected readonly operatorid: string;
    protected readonly channel: string;
    protected readonly tokenProvider: TokenProvider;
    protected readonly operatorPayload: string;
    private userId = "-1";
    private gamesessionid = "illegal game session id";

    constructor(
        baseUrl: string,
        gameid: string,
        operatorid: string,
        channel: string,
        operatorPayload: string | "operator-payload",
        tokenProvider: TokenProvider,
    ) {
        this.baseUrl = baseUrl;
        this.gameid = gameid;
        this.operatorid = operatorid;
        this.channel = channel;
        this.tokenProvider = tokenProvider;
        this.operatorPayload = operatorPayload;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(userName: string): Promise<TInitResponse> {
        const token = (await this.tokenProvider.getToken()).token;
        const params = {
            gameid: this.gameid,
            operatorid: this.operatorid,
            channel: this.channel,
            token: token,
        };
        const response = await this.fetch<ScgsInitRequest, ScgsInitResponse>("/game/init", params);
        const initResponse: TInitResponse = {
            ...response.gamepayload,
            user: {
                userId: response.account.userid,
                login: userName,
                currency: response.account.currency,
                lang: "en",
                denominator: 1,
            },
            userStats: {
                ...response.gamepayload.userStats,
                balance: parseFloat(response.account.balance),
            },
        };
        this.userId = initResponse.user.userId;
        this.gamesessionid = response.gamesessionid;
        __DEV__ && console.log(response);
        __DEV__ && console.log(initResponse);
        return initResponse;
    }

    async spin(request: TSpinRequest & TLogin): Promise<TSpinResponse> {
        const bet = $(BetModel).getBet(parseInt(request.bet_id)).value;
        const params: ScgsActionRequest = {
            action: "spin",
            bet: bet,
            operatorpayload: this.operatorPayload,
            gamepayload: {
                bet: bet,
                lines: parseInt(request.lines_amount),
            },
            gameid: this.gameid,
            operatorid: this.operatorid,
            channel: this.channel,
            gamesessionid: this.gamesessionid,
        };
        const response = await this.fetch<ScgsActionRequest, ScgsActionResponse>("/game/action", params);
        return {
            ...response.gamepayload,
            user: {
                login: request.login,
                userId: this.userId,
                lang: "en",
                denominator: 1,
                currency: "COIN",
            },
            userStats: {
                balance: parseInt(response.balance.final),
                betId: parseInt(request.bet_id),
                lineId: parseInt(request.lines_amount),
                reelStops: response.gamepayload.reelStops,
                freeGames: 1,
            },
        };
    }

    async getAllUsers(): Promise<TFullUserData[]> {
        throw new Error("[getAllUsers] not implemented");
    }

    async forceReelStop(payload: TForceRequest & TLogin): Promise<TResponse> {
        throw new Error("[spin] not implemented for: " + JSON.stringify(payload));
    }

    async buyCredits(creditsAmount: number): Promise<TResponse> {
        throw new Error("[buyCredits] not implemented for: " + JSON.stringify(creditsAmount));
    }

    async fetch<T, R>(method: GameApi, params: T): Promise<R> {
        const url = `${this.baseUrl}${method}`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = <R>(await (await fetch(url, {
            method: "POST",
            credentials: CREDENTIALS,
            headers: {
                "Content-Type": "application/json",
                "x-api-version": X_API_VERSION,
            },
            body: JSON.stringify(params),
        })).json());
        __DEV__ && console.log(result);
        return result;
    }
}
