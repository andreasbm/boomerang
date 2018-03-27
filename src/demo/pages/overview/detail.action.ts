import { mkDefaultAction } from "../../../lib";
import { IEntity } from "../../ientity";

export const DetailAction = {
	getEntity: mkDefaultAction<IEntity>()
};
