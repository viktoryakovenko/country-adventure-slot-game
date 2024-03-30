import {
    TForceRequest,
    TFullUserData,
    TInitResponse,
    TLogin, TResponse,
    TSpinRequest,
    TSpinResponse,
} from "app/server/service/typing";

export interface IRequestService {
    login(username: string): Promise<TInitResponse>;

    spin(request: TSpinRequest & TLogin): Promise<TSpinResponse>;

    getAllUsers(): Promise<TFullUserData[]>;

    forceReelStop(payload: TForceRequest & TLogin): Promise<TResponse>;

    buyCredits(creditsAmount: number): Promise<TResponse>;
}
