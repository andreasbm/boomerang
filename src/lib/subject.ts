export class Subject<T> {
	protected listeners: ((T) => void)[] = [];

	addListener (listener: ((T) => void)) {
		this.listeners.push(listener);
	}

	removeListener (listener: ((T) => void)) {
		const matchIndex = this.listeners.indexOf(listener);
		if (matchIndex >= 0) {
			this.listeners.splice(matchIndex, 1);
		}
	}

	dispatch (data: T) {
		this.listeners.forEach(listener => listener(data));
	}
}
