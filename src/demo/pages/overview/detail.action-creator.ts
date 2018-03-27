import { ActionCreator } from "../../../lib";
import { API } from "../../api";
import { DetailAction } from "./detail.action";

export class DetailActionCreator extends ActionCreator {
	constructor (private api: API) {
		super();
	}

	getEntity (id: number) {
		this.tryCatch(DetailAction.getEntity, () => this.api.getEntity(id));
	}
}
