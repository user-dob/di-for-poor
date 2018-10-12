const toCamelCase = name => name.replace(/^\w/, c => c.toLowerCase());

export class Container {
	constructor() {
		this.map = new Map();
	}

	normalizeService(args) {
		if (args[1]) {
			return {
				id: args[0],
				name: args[0],
				service: args[1]
			}
		}

		const service = args[0];
		return {
			id: toCamelCase(service.name),
			name: service.name,
			service
		}
	}

	addServiceInstance(data) {
		this.map.set(data.id, data);
	}

	add(...args) {
		const data = this.normalizeService(args);
		data.instance = (() => {
			let cache = null;
			return dictionary => {
				if (cache === null) {
					cache = Reflect.construct(data.service, [dictionary]);
				}
				return cache;
			}
		})();
		this.addServiceInstance(data);
	}

	addTransient(...args) {
		const data = this.normalizeService(args);
		data.instance = dictionary => Reflect.construct(data.service, [dictionary]);
		this.addServiceInstance(data);
	}

	addFactory(...args) {
		const data = this.normalizeService(args);
		data.instance = data.service;
		this.addServiceInstance(data);
	}

	resolve(service) {
		const dictionary = new Proxy(this, {
			get(target, id) {

				if (target.map.has(id)) {
					const data = target.map.get(id);
					try {
						return data.instance(dictionary);
					} catch (error) {
						if (error instanceof RangeError) {
							throw new Error(`It looks like there is a circular dependency in one of the '${data.name}' bindings.`)
						} else {
							throw error;
						}
					}
				}

				throw new Error(`service ${id} not found`);
			}
		});

		return Reflect.construct(service, [dictionary])
	}
}