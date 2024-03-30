import {HrefParamReader} from "app/helpers/HrefParamReader";
// todo: extract to wrapper
export interface TokenProvider {
    getToken(): Promise<{token:string, sessionId:string}>;
}
export class ScgsFromHrefTokenProvider implements TokenProvider {
    getToken(): Promise<{token: string; sessionId: string}> {
        const token = new HrefParamReader(location.href).get("token");
        return Promise.resolve({sessionId: "sessionId", token: token});
    }
}
export class ScgsFromUserServiceTokenProvider implements TokenProvider {
    protected readonly userServiceUrl: string;
    constructor(userServiceUrl: string, readonly userId: string) {
        this.userServiceUrl = userServiceUrl;
    }

    async getToken(): Promise<{token:string, sessionId:string}> {
        const params = {
            userId: this.userId,
        };
        const url = `${this.userServiceUrl}/user/login`;
        __DEV__ && console.log(`fetch(${url})`);
        const result = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-version": "1",
            },
            body: JSON.stringify(params),
        });
        const response: {token:string, sessionId:string} = (await result.json());
        __DEV__ && console.log(response);
        return response;
    }
}
