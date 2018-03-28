/*tslint:disable:no-any*/

/**
 * Action kind type.
 */
export type ActionKind = string;

/**
 * Optional metadata for any action.
 */
export type Json = any;
export type DefaultActionMetadata = any;
export type DefaultActionData = any;

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

/**
 * All dispatched actions must implement this interface.
 */
export interface IAction {
	kind: ActionKind;
	status: ActionStatusKind;
	metadata?: DefaultActionMetadata;
	data?: DefaultActionData;
}

/**
 * Interface used for any action that comes with a required data field and an optional metadata field.
 */
export interface IDataAction<Data = DefaultActionData, Metadata = DefaultActionMetadata> extends IAction {
	data: Data;
	metadata?: Metadata;
}
