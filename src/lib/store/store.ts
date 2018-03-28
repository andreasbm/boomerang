import { IAction } from "../";
import { Dispatcher } from "../dispatcher/dispatcher";
import { Subject } from "../subject";

/**
 * Base class for providing the store behavior.
 */
export abstract class Store<T> extends Subject<T> {

	/**
	 * When the store is initialized, the store begins listening to dispatched actions.
	 */
	constructor () {
		super();

		this.handler = this.handler.bind(this);
		Dispatcher.instance.addListener(this.handler);
	}

	/**
	 * Tears down the store by removing all store listeners.
	 */
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