import {TSpinRequest} from "app/server/service/typing";
import {IRequestService} from "app/server/service/IRequestService";
import ScgsRequestService from "app/server/service/ScgsRequestService";
import LegacyRequestService from "app/server/service/LegacyRequestService";
import {Factory} from "app/common/factory/Factory";
import {Builder} from "app/common/builder/Builder";
import {HrefParamReader} from "app/helpers/HrefParamReader";
import gameModel from "app/model/GameModel";
import {ScgsFromHrefTokenProvider, ScgsFromUserServiceTokenProvider} from "app/server/service/TokenProvider";

const hrefParamReader = new HrefParamReader();
const serverUrl = SERVER_URL ?? hrefParamReader.get("server_url", origin);

export class ServerCommunicatorBuilder implements Builder<ServerType, ServerCommunicator> {
    private readonly requestServiceFactory = new Factory<ServerType, IRequestService>()
        .add("scgs", new class implements Builder<void, IRequestService> {
            build(): IRequestService {
                const gameid = hrefParamReader.get("gameid");
                const operatorid = hrefParamReader.get("operatorid");
                const channel = hrefParamReader.get("channel", "desktop");
                const operatorPayload = hrefParamReader.get("operatorpayload", "operator-payload");
                const tokenProvider = hrefParamReader.has("token") ?
                    new ScgsFromHrefTokenProvider() :
                    new ScgsFromUserServiceTokenProvider(
                        EXTERNAL_USER_SERVICE_URL,
                        hrefParamReader.get("userid"),
                    );
                return new ScgsRequestService(
                    serverUrl,
                    gameid, operatorid, channel, operatorPayload,
                    tokenProvider,
                );
            }
        })
        .add("legacy", new class implements Builder<void, IRequestService> {
            build(): IRequestService {
                return new LegacyRequestService(serverUrl);
            }
        });

    constructor() {
    }

    build(payload: ServerType): ServerCommunicator {
        return new ServerCommunicator(this.requestServiceFactory.build(payload));
    }
}

export default class ServerCommunicator {
    static builder = new ServerCommunicatorBuilder();

    private request: IRequestService;
    private userName = "Lo";

    constructor(request: IRequestService) {
        this.request = request;
    }

    async login(userName: string) {
        const response = await this.request.login(userName);
        gameModel.game.signals.data.login.emit(response);
        this.userName = response.user.login;
        return response;
    }

    async spin(request: Omit<TSpinRequest, "login">) {
        const response = await this.request.spin({...request, login: this.userName});
        gameModel.game.signals.data.spin.emit(response);
        return response;
    }

    async getAllUsers() {
        const response = await this.request.getAllUsers();
        gameModel.game.signals.data.users.emit(response);
        return response;
    }

    async forceReelStop(reels: Array<number>) {
        const response = await this.request.forceReelStop({
            reel_stops: JSON.stringify(reels), login: this.userName,
        });
        gameModel.game.signals.data.stopReel.emit(response);
        return response;
    }

    async buyCredits(bet: number) {
        const response = await this.request.buyCredits(bet);
        gameModel.game.signals.data.buyAmount.emit(response);
        return response;
    }
}
