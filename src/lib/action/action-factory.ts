import { ActionKind, ActionStatusKind, DefaultActionMetadata, IAction, IDataAction } from "./iaction";

/**
 * A factory that allows for an IDataAction to be created
 */
export interface IActionFactory<Data, Metadata> {
	kind: ActionKind;
	status: ActionStatusKind;

	// Call signature
	(data: Data, metadata?: Metadata): IDataAction<Data, Metadata>;
}

/**
 * A factory that allows for an IDataAction to be created based on a specified status kind.
 */
export interface IAsyncActionFactory<ST, SU, FA, IN, DO, ME = DefaultActionMetadata> {
	kind: ActionKind;
	started: IActionFactory<ST, ME>;
	success: IActionFactory<SU, ME>;
	failed: IActionFactory<FA, ME>;
	invalidated: IActionFactory<IN, ME>;
	done: IActionFactory<DO, ME>;
}

/**
 * Default async action factory with types:
 * - started: {}
 * - done: D (generic)
 * - failed: Error
 * - invalidated: {}
 */
export type IDefaultAsyncActionFactory <Data, Metadata = DefaultActionMetadata> = IAsyncActionFactory<void, Data, Error, void, Metadata>;

/**
 * Makes an action factory with a specific kind and status.
 * @param kind
 * @param status
 * @returns {((data:any, metadata?:ActionMetadata)=>IDataAction<any>)&{kind: ActionKind, status: ActionStatusKind}}
 */
function mkActionFactory<Data, Metadata> (kind: ActionKind, status: ActionStatusKind): IActionFactory<Data, Metadata> {
	const func = (data: Data, metadata?: Metadata) => {
		return <IDataAction<Data, Metadata>>{kind, status, data, metadata};
	};

	return Object.assign(func, {kind, status});
}

/**
 * Makes an async action factory with a specified kind.
 * @param kind
 * @returns {{kind: ActionKind, started: IActionFactory<ST>, done: IActionFactory<SU>, failed: IActionFactory<FA>, invalidated: IActionFactory<IN>}}
 */
export function mkAction<ST, SU, FA, IN, DO, ME> (kind: ActionKind): IAsyncActionFactory<ST, SU, FA, IN, DO, ME> {
	return {
		kind: kind,
		started: mkActionFactory<ST, ME>(kind, ActionStatusKind.STARTED),
		success: mkActionFactory<SU, ME>(kind, ActionStatusKind.SUCCESS),
		failed: mkActionFactory<FA, ME>(kind, ActionStatusKind.FAILED),
		invalidated: mkActionFactory<IN, ME>(kind, ActionStatusKind.INVALIDATED),
		done: mkActionFactory<DO, ME>(kind, ActionStatusKind.DONE)
	};
}

/**
 * Makes a default action factory with a provided kind
 * @param kind
 * @returns {IAsyncActionFactory<{}, SU, Error, {}>}
 */
export function mkDefaultAction<SU, ME = DefaultActionMetadata> (kind?: ActionKind): IDefaultAsyncActionFactory<SU> {
	if (kind == null) kind = Math.random().toString();
	return mkAction<void, SU, Error, void, void, ME>(kind);
}

/**
 * Tests if an action was created using a specific action factory
 * @param action
 * @param actionFactory
 * @returns {boolean}
 */
export function isAction<Data, Metadata> (action: IAction, actionFactory: IActionFactory<Data, Metadata>): action is IDataAction<Data, Metadata> {
	return action.kind === actionFactory.kind && action.status === actionFactory.status;
}
