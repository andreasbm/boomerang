import { mkDefaultAction } from "../../lib";
import { IEntity } from "../ientity";

export const EntityAction = {
	getEntities: mkDefaultAction<IEntity[], { metadata: string }>(),
	createEntity: mkDefaultAction<IEntity>()
};