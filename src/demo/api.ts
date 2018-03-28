import { IEntity } from "./ientity";

const chanceOfFailing = 0.2;
const maxSleepDuration = 500;
const maxId = 10000;

/**
 * Simulates a the time it takes to speak with the server.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep (ms?: number): Promise<void> {
	if (ms == null) {
		ms = Math.random() * maxSleepDuration;
	}
	return new Promise<void>((res, rej) => {
		setTimeout(res, ms);
	});
}

/**
 * API that simulates talking with the server.
 */
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
	 * Returns the entity with a given ID.
	 * @returns {Promise<IEntity>}
	 */
	async getEntity (id: number): Promise<IEntity> {
		await sleep();
		const match = this.entities.find(entity => entity.id === id);

		if (match != null) {
			return match;
		}

		throw new Error(`Entity with the ID '${id}' does not exist.`);
	}

	/**
	 * Creates a new entity.
	 * @returns {Promise<IEntity>}
	 */
	async createEntity (): Promise<IEntity> {
		await sleep();
		if (Math.random() > 1 - chanceOfFailing) throw new Error("It failed!");
		const id = Math.floor(Math.random() * maxId);
		const entity = {
			id: id,
			title: `Entity with id ${id}`,
			liked: false
		};

		this.entities.push(entity);

		return entity;
	}
}
