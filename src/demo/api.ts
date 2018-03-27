import { IEntity } from "./ientity";

function sleep (ms: number = 500): Promise<void> {
	return new Promise<void>((res, rej) => {
		setTimeout(res, ms);
	});
}

export class API {

	private entities = [
		{
			id: 1,
			title: "Hey",
			liked: false
		},
		{
			id: 2,
			title: "You",
			liked: true
		},
		{
			id: 3,
			title: ":D",
			liked: false
		}
	];

	/**
	 * Returns a list of entities
	 * @returns {Promise<IEntity[]>}
	 */
	async getEntities (): Promise<IEntity[]> {
		await sleep();
		return this.entities.concat([]);
	}

	/**
	 * Returns an entity with the given ID.
	 * @returns {Promise<IEntity>}
	 */
	async getEntity (id: number): Promise<IEntity | null> {
		await sleep();
		return this.entities.find(entity => entity.id === id);
	}

	async createEntity (): Promise<IEntity> {
		await sleep();
		if (1 === Math.round(Math.random() * 3)) throw new Error("It failed!");
		const id = Math.floor(Math.random() * /*tslint:disable:no-magic-numbers*/10000/*tslint:enable:no-magic-numbers*/);
		const entity = {
			id: id,
			title: `Entity with id ${id}`,
			liked: false
		};

		this.entities.push(entity);

		return entity;
	}
}
