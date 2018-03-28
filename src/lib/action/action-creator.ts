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
	protected started<S, D, F, I, M> (actionFactory: IAsyncActionFactory<S, D, F, I>, data: S, metadata?: M): void {
		Dispatcher.instance.dispatch(actionFactory.started(data, metadata));
	}

	/**
	 * Finished an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected done<S, D, F, I, M> (actionFactory: IAsyncActionFactory<S, D, F, I>, data: S, metadata?: M): void {
		Dispatcher.instance.dispatch(actionFactory.done(data, metadata));
	}

	/**
	 * Fails an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected failed<S, D, F, I, M> (actionFactory: IAsyncActionFactory<S, D, F, I>, data: F, metadata?: M): void {
		Dispatcher.instance.dispatch(actionFactory.failed(data, metadata));
	}

	/**
	 * Invalidates an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected invaliated<S, D, F, I, M> (actionFactory: IAsyncActionFactory<S, D, F, I>, data: I, metadata?: M): void {
		Dispatcher.instance.dispatch(actionFactory.invalidated(data, metadata));
	}

	/**
	 * Invalidates an action based on a specific action factory
	 * @param actionFactory
	 * @param data
	 * @param metadata
	 */
	protected success<S, D, F, I, M> (actionFactory: IAsyncActionFactory<S, D, F, I>, data: D, metadata?: M): void {
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
	protected tryCatch<D, M> (actionFactory: IDefaultAsyncActionFactory<D, M>, bodyFunction: () => Promise<D>, metadata?: M): void {
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