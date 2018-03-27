import { ActionKind, ActionStatusKind, DefaultActionMetadata, IAction, IDataAction } from "./iaction";

/**
 * A factory that allows for an IDataAction to be created
 */
export interface IActionFactory<Data, Metadata> {
	kind: ActionKind;
	status: ActionStatusKind;

	(data: Data, metadata?: Metadata): IDataAction<Data, Metadata>;
}

/**
 * A factory that allows for an IDataAction to be created based on a specified status kind.
 */
export interface IAsyncActionFactory<S, D, F, I, M = DefaultActionMetadata> {
	kind: ActionKind;
	started: IActionFactory<S, M>;
	failed: IActionFactory<F, M>;
	invalidated: IActionFactory<I, M>;
	success: IActionFactory<D, M>;
	done: IActionFactory<S, M>;
}

/**
 * Default async action factory with types:
 * - started: {}
 * - done: D (generic)
 * - failed: Error
 * - invalidated: {}
 */
export type IDefaultAsyncActionFactory <D, M = DefaultActionMetadata> = IAsyncActionFactory<void, D, Error, void, M>;

/**
 * Makes an action factory with a specific kind and status.
 * @param kind
 * @param status
 * @returns {((data:any, metadata?:ActionMetadata)=>IDataAction<any>)&{kind: ActionKind, status: ActionStatusKind}}
 */
function mkActionFactory<Data, Metadata> (kind: ActionKind, status: ActionStatusKind): IActionFactory<Data, Metadata> {
	const func = (data: Data, metadata?: Metadata) => {
		return <IDataAction<Data, Metadata>>{
			kind: kind,
			status: status,
			data: data,
			metadata: metadata
		};
	};

	return Object.assign(func, {
		kind: kind,
		status: status
	});
}

/**
 * Makes an async action factory with a specified kind.
 * @param kind
 * @returns {{kind: ActionKind, started: IActionFactory<S>, done: IActionFactory<D>, failed: IActionFactory<F>, invalidated: IActionFactory<I>}}
 */
export function mkAction<S, D, F, I, M> (kind: ActionKind): IAsyncActionFactory<S, D, F, I, M> {
	return {
		kind: kind,

		started: mkActionFactory<S, M>(kind, ActionStatusKind.STARTED),
		success: mkActionFactory<D, M>(kind, ActionStatusKind.SUCCESS),
		failed: mkActionFactory<F, M>(kind, ActionStatusKind.FAILED),
		done: mkActionFactory<S, M>(kind, ActionStatusKind.DONE),
		invalidated: mkActionFactory<I, M>(kind, ActionStatusKind.INVALIDATED)
	};
}

/**
 * Makes a default action factory with a provided kind
 * @param kind
 * @returns {IAsyncActionFactory<{}, D, Error, {}>}
 */
export function mkDefaultAction<D, M = DefaultActionMetadata> (kind?: ActionKind): IDefaultAsyncActionFactory<D> {
	if (kind == null) kind = Math.random().toString();
	return mkAction<void, D, Error, void, M>(kind);
}

/**
 * Tests if an action was created using a specific action factory
 * @param action
 * @param actionFactory
 * @returns {boolean}
 */
export function isAction<T, U> (action: IAction, actionFactory: IActionFactory<T, U>): action is IDataAction<T, U> {
	return action.kind === actionFactory.kind && action.status === actionFactory.status;
}
