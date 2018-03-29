import { Dispatcher } from "../dispatcher/dispatcher";
import { IAsyncActionFactory, IDefaultAsyncActionFactory } from "./action-factory";

/**
 * Base class for providing the action creator behavior.
 */
export abstract class ActionCreator {

	/**
	 * Starts an action based on a specific action factory
	 * @param {IAsyncActionFactory<ST, SU, FA, IN, DO>} actionFactory
	 * @param {ST} data
	 * @param {ME} metadata
	 */
	protected started<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: ST, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.started(data, metadata));
	}

	/**
	 * Finished an action based on a specific action factory
	 * @param {IAsyncActionFactory<ST, SU, FA, IN, DO>} actionFactory
	 * @param {DO} data
	 * @param {ME} metadata
	 */
	protected done<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: DO, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.done(data, metadata));
	}

	/**
	 * Fails an action based on a specific action factory
	 * @param {IAsyncActionFactory<ST, SU, FA, IN, DO>} actionFactory
	 * @param {FA} data
	 * @param {ME} metadata
	 */
	protected failed<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: FA, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.failed(data, metadata));
	}

	/**
	 * Invalidates an action based on a specific action factory
	 * @param {IAsyncActionFactory<ST, SU, FA, IN, DO>} actionFactory
	 * @param {IN} data
	 * @param {ME} metadata
	 */
	protected invaliated<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: IN, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.invalidated(data, metadata));
	}

	/**
	 * Suceeds an action based on a specific action factory
	 * @param {IAsyncActionFactory<ST, SU, FA, IN, DO>} actionFactory
	 * @param {SU} data
	 * @param {ME} metadata
	 */
	protected success<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: SU, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.success(data, metadata));
	}

	/**
	 * Starts and action, waits for the body function to finish.
	 * Then it dispatches the done action using the returned value from the body function.
	 * If an exception is thrown the failed action is dispatched instead.
	 * @param {IDefaultAsyncActionFactory<Data, Metadata>} actionFactory
	 * @param {() => Promise<Data>} bodyFunction
	 * @param {Metadata} metadata
	 */
	protected tryCatch<Data, Metadata> (actionFactory: IDefaultAsyncActionFactory<Data, Metadata>, bodyFunction: () => Promise<Data>, metadata?: Metadata): void {
		(async () => {
			this.started(actionFactory, undefined, metadata);

			try {
				const data = await bodyFunction();
				this.success(actionFactory, data, metadata);

			} catch (e) {
				this.failed(actionFactory, e, metadata);
			}

			this.done(actionFactory, undefined, metadata);
		})();
	}
}