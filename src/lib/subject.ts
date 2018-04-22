export declare type SubjectCallback<T> = (T) => void;

/**
 * Allows observers to subscribe and unsubscribe to events and allows other entities to dispatch them.
 */
export class Subject<T> {
	protected listeners: SubjectCallback<T>[] = [];

	/**
	 * Adds a listener to the subject.
	 * @param listener
	 */
	addListener (listener: SubjectCallback<T>) {
		this.listeners.push(listener);
	}

	/**
	 * Removes a listener from the subject.
	 * @param listener
	 */
	removeListener (listener: SubjectCallback<T>) {
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
