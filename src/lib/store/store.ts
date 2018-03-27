import { IAction } from "../";
import { Dispatcher } from "../dispatcher/dispatcher";
import { Subject } from "../subject";

export abstract class Store<T> extends Subject<T> {
	constructor () {
		super();

		this.handler = this.handler.bind(this);
		Dispatcher.instance.addListener(this.handler);
	}

	tearDown () {
		Dispatcher.instance.removeListener(this.handler);

		// Remove all store listeners
		for (const listener of this.listeners) {
			this.removeListener(listener);
		}
	}

	/**
	 * Handler to handle dispatched actions. Subclasses must implement this method.
	 */
	protected abstract handler (action: IAction): void;
}