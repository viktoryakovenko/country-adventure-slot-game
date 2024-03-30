import {Composer, Disposer} from "app/scenes/model/Scene";
import {TUserData, TUserStatsData} from "app/server/service/typing";
import Signal from "app/helpers/signals/signal/Signal";

export default class UserModel implements Composer<void>, Disposer<void> {
    private user: TUserData & TUserStatsData;
    readonly balanceChanged = new Signal<number>();
    readonly betChanged = new Signal<number>();

    constructor(user: TUserData, userStats: TUserStatsData) {
        this.user = {
            userId: user.userId,
            freeGames: 0,
            lang: user.lang,
            currency: user.currency,
            denominator: user.denominator,
            login: user.login,
            balance: userStats.balance,
            reelStops: userStats.reelStops,
            betId: userStats.betId,
            lineId: userStats.lineId,
        };
    }

    takeBet(value: number) {
        this.user.balance -= value;
        this.balanceChanged.emit(this.user.balance);
    }

    setBet(betId: number) {
        if (this.user.betId !== betId) {
            this.user.betId = betId;
            this.betChanged.emit(betId);
        }
    }

    updateUserStats(userStats: TUserStatsData, forceUpdate = false) {
        this.user.balance = userStats.balance;
        this.user.reelStops = userStats.reelStops;
        this.balanceChanged.emit(this.user.balance);
        if (this.user.betId !== userStats.betId || forceUpdate) {
            this.betChanged.emit(userStats.betId);
        }
        this.user.betId = userStats.betId;
        this.user.lineId = userStats.lineId;
    }

    public getCurrentBalance() : number {
        return this.user.balance;
    }

    compose(): void {

    }

    dispose(): void {
    }
}
