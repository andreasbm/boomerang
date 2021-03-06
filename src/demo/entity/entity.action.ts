import { mkDefaultAction } from "../../lib";
import { IEntity } from "../ientity";

export const EntityAction = {
	getEntities: mkDefaultAction<IEntity[], { message: string }>(),
	createEntity: mkDefaultAction<IEntity>()
};