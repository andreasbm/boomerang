import { IAction, isAction, Json, Store } from "../../../lib";
import { DetailAction } from "./detail.action";

export enum DetailStoreEventKind {
	getEntity
}

export interface IDetailStoreEvent {
	data?: Json;
	kind: DetailStoreEventKind;
}

export class DetailStore extends Store<IDetailStoreEvent> {

	protected handler (action: IAction) {
		if (isAction(action, DetailAction.getEntity.success)) {
			this.dispatch({ kind: DetailStoreEventKind.getEntity, data: action.data });
		}
	}
}
