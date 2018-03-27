import { API } from "./api";
import { EntityActionCreator } from "./entity/entity.action-creator";
import { EntityStore } from "./entity/entity.store";

export class Container {
	private static _instance: Container;
	static get instance () {
		if (this._instance == null) {
			this._instance = new Container();
		}

		return this._instance;
	}

	api = new API();
	entityStore = new EntityStore();
	entityActionCreator = new EntityActionCreator(this.api);
}
