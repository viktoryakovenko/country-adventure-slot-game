import {State} from "app/stateMachine/State";
import {TGameStates} from "app/game/states/TGameStates";

export default class NextState extends State<TGameStates> {
    async run(): Promise<this> {
        return this;
    }
}
