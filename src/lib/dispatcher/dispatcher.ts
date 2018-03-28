import { IAction } from "../action/iaction";
import { Subject } from "../subject";

/**
 * Takes care of dispatching events and notifying the listeners.
 */
export class Dispatcher extends Subject<IAction> {

	/**
	 * Singleton for the global instance of the dispatcher.
	 */
	private static _instance: Dispatcher;
	static get instance () {
		if (this._instance == null) {
			this._instance = new Dispatcher();
		}

		return this._instance;
	}
}