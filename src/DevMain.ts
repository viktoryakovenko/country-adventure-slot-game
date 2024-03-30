import {Main} from "app/Main";
import DevController from "app/dev/DevController";

export class DevMain extends Main {
    devInit() {
        new DevController();
    }
}
const main = new DevMain();
main.init();
main.devInit();
