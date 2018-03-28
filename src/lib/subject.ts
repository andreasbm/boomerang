/**
 * Allows observers to subscribe and unsubscribe to events and allows other entities to dispatch them.
 */
export class Subject<T> {
	protected listeners: ((T) => void)[] = [];

	/**
	 * Adds a listener to the subject.
	 * @param {(T) => void} listener
	 */
	addListener (listener: ((T) => void)) {
		this.listeners.push(listener);
	}

	/**
	 * Removes a listener from the subject.
	 * @param {(T) => void} listener
	 */
	removeListener (listener: ((T) => void)) {
		const matchIndex = this.listeners.indexOf(listener);
		if (matchIndex >= 0) {
			this.listeners.splice(matchIndex, 1);
		}
	}

	/**
	 * Dispatches an event to the listeners.
	 * @param {T} data
	 */
	dispatch (data: T) {
		this.listeners.forEach(listener => listener(data));
	}
}
