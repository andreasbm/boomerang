
/**
 * Action kind type
 */
export type ActionKind = string;

/*tslint:disable:no-any*/
/**
 * Optional metadata for any action
 */
export type DefaultActionMetadata = any;
export type DefaultActionData = any;
/*tslint:enable:no-any*/

/*tslint:disable:no-any*/

/**
 * Action status is a first class action concept.
 * These are the accepted action statuses.
 * A dispatched action will always have a status.
 */
export enum ActionStatusKind {
	STARTED = <any>"STARTED",
	INVALIDATED = <any>"INVALIDATED",
	FAILED = <any>"FAILED",
	SUCCESS = <any>"SUCCESS",
	DONE = <any>"DONE"
}

/*tslint:enable:no-any*/

/**
 * All dispatched actions must use this interface.
 */
export interface IAction {
	kind: ActionKind;
	status: ActionStatusKind;
	metadata?: DefaultActionMetadata;
	data?: DefaultActionData;
}

/**
 * Interface used for any action that comes with a data field and a metadata field
 */
export interface IDataAction<Data = DefaultActionData, Metadata = DefaultActionMetadata> extends IAction {
	data: Data;
	metadata?: Metadata;
}
