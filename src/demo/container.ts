import { API } from "./api";
import { EntityActionCreator } from "./entity/entity.action-creator";
import { EntityStore } from "./entity/entity.store";

/**
 * The dependency container of our app.
 */
export class Container {

	/**
	 * Singleton.
	 */
	private static _instance: Container;
	static get instance () {
		if (this._instance == null) {
			this._instance = new Container();
		}

		return this._instance;
	}

	// Dependencies
	api = new API();
	entityStore = new EntityStore();
	entityActionCreator = new EntityActionCreator(this.api);
}
