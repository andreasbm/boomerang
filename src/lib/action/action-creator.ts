import { Dispatcher } from "../";
import { IAsyncActionFactory, IDefaultAsyncActionFactory } from "./action-factory";

/**
 * Base class for providing the action creator behavior.
 */
export abstract class ActionCreator {

	/**
	 * Starts an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected started<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: ST, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.started(data, metadata));
	}

	/**
	 * Finished an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected done<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: DO, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.done(data, metadata));
	}

	/**
	 * Fails an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected failed<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: FA, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.failed(data, metadata));
	}

	/**
	 * Invalidates an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected invaliated<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: IN, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.invalidated(data, metadata));
	}

	/**
	 * Invalidates an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected success<ST, SU, FA, IN, DO, ME> (actionFactory: IAsyncActionFactory<ST, SU, FA, IN, DO>, data: SU, metadata?: ME): void {
		Dispatcher.instance.dispatch(actionFactory.success(data, metadata));
	}

	/**
	 * Starts and action, waits for the body function to finish.
	 * Then it dispatches the done action using the returned value from the body function.
	 * If an exception is thrown the failed action is dispatched instead.
	 * @param actionFactory
	 * @param bodyFunction
	 * @param metadata
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