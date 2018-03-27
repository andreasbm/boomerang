import { IAction } from "../action/iaction";
import { Subject } from "../subject";

export class Dispatcher extends Subject<IAction> {

	private static _instance: Dispatcher;
	static get instance () {
		if (this._instance == null) {
			this._instance = new Dispatcher();
		}

		return this._instance;
	}
}