Object.defineProperty(String.prototype, 'isBlank', {
	get: function (this: string) {
		if (this == null) {
			return true;
		}
		return this.trim().length === 0;
	},
	configurable: true,
	enumerable: false,
});

Object.defineProperty(String.prototype, 'startsWithOrEndsWithSpaces', {
	get: function (this: string) {
		return /^\s|\s$/.test(this);
	},
	configurable: true,
	enumerable: false,
});

Object.defineProperty(String.prototype, 'isValidEmail', {
	get: function (this: string) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this);
	},
	configurable: true,
	enumerable: false,
});
