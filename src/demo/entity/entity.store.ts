import { IAction, isAction, Json, Store } from "../../lib";
import { IEntity } from "../ientity";
import { EntityAction } from "./entity.action";

export enum EntityStoreEventKind {
	entityAdded,
	entitiesChanged,
	entityAddedError,
	loadingStarted,
	loadingEnded
}

export interface IEntityStoreEvent {
	kind: EntityStoreEventKind;
	data?: Json;
}

export class EntityStore extends Store<IEntityStoreEvent> {

	private _entities: IEntity[] = [];
	get entities () {
		return this._entities;
	}

	protected handler (action: IAction) {
		console.log(action);

		if (isAction(action, EntityAction.createEntity.success)) {
			this._entities.push(action.data);
			this.dispatch({kind: EntityStoreEventKind.entityAdded});

		} else if (isAction(action, EntityAction.getEntities.success)) {
			this._entities = action.data;
			this.dispatch({kind: EntityStoreEventKind.entitiesChanged});

		} else if (isAction(action, EntityAction.createEntity.failed)) {
			this.dispatch({kind: EntityStoreEventKind.entityAddedError, data: "Sometimes it goes wrong.."});
		}

		// Loading related stuff
		if (isAction(action, EntityAction.createEntity.started) || isAction(action, EntityAction.getEntities.started)) {
			this.dispatch({kind: EntityStoreEventKind.loadingStarted});

		} else if (isAction(action, EntityAction.createEntity.done) || isAction(action, EntityAction.getEntities.done)) {
			this.dispatch({kind: EntityStoreEventKind.loadingEnded});
		}
	}
}
