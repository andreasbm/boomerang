import { ActionCreator } from "../../lib";
import { API } from "../api";
import { EntityAction } from "./entity.action";

export class EntityActionCreator extends ActionCreator {

	constructor (private api: API) {
		super();
	}

	getEntities () {
		this.tryCatch(EntityAction.getEntities, async () => {
			return await this.api.getEntities();
		}, {message: "hello"});
	}

	createEntity () {
		this.tryCatch(EntityAction.createEntity, async () => {
			return await this.api.createEntity();
		});
	}
}
