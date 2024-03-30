import {TForceRequest, TFullUserData, TInitResponse, TLogin, TResponse, TSpinRequest, TSpinResponse} from "./typing";

export default class RequestService {
    protected readonly baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async login(username: string): Promise<TInitResponse> {
        const url = `${this.baseUrl}user/login/?login=${username}`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TInitResponse = JSON.parse(await result.text());
        __DEV__ && console.log(response);
        return response;
    }

    async spin(request: TSpinRequest & TLogin): Promise<TSpinResponse> {
        const url = `${this.baseUrl}game/spin/?${new URLSearchParams(request)}`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TSpinResponse = JSON.parse(await result.text());
        __DEV__ && console.log(response);
        return response;
    }

    async getAllUsers(): Promise<TFullUserData[]> {
        const url = `${this.baseUrl}user/all/`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TFullUserData[] = JSON.parse(await result.text());
        __DEV__ && console.log(response);
        return response;
    }

    async forceReelStop(payload: TForceRequest & TLogin): Promise<TResponse> {
        const url = `${this.baseUrl}game/spin/force/?${new URLSearchParams(payload)}`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TResponse = JSON.parse(await result.text());
        __DEV__ && console.log(response);
        return response;
    }

    async buyCredits(bet: number): Promise<TResponse> {
        const url = `${this.baseUrl}user/buy/?buy_amount=${bet}`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url);
        const response: TResponse = JSON.parse(await result.text());
        __DEV__ && console.log(response);
        return response;
    }
}
