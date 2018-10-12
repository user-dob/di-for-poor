import { expect } from 'chai';
import { Container } from '../src';

describe('Container', () => {

	let container;

	beforeEach(() => {
		container = new Container();
	});

	it('add one inject', () => {
		class Foo {}

		class Bar {
			constructor({foo}) {
				expect(foo).to.be.instanceOf(Foo);
			}
		}

		container.add(Foo);
		container.resolve(Bar);
	});

	it('add two inject', () => {
		class Foo {}

		class Bar {
			constructor({foo}) {
				expect(foo).to.be.instanceOf(Foo);
			}
		}

		class User {
			constructor({foo, bar}) {
				expect(foo).to.be.instanceOf(Foo);
				expect(bar).to.be.instanceOf(Bar);
			}
		}

		container.add(Foo);
		container.add(Bar);
		container.resolve(User);
	});

	it('add singleton', () => {
		class Foo {
			constructor() {
				Foo.instanceCount++;
			}
		}

		Foo.instanceCount = 0;

		class Bar {
			constructor({foo}) {}
		}

		class User {
			constructor({foo, bar}) {}
		}

		container.add(Foo);
		container.add(Bar);
		container.resolve(User);

		expect(Foo.instanceCount).equal(1);
	});

	it('add transient', () => {
		class Foo {
			constructor() {
				Foo.instanceCount++;
			}
		}

		Foo.instanceCount = 0;

		class Bar {
			constructor({foo}) {}
		}

		class User {
			constructor({foo, bar}) {}
		}

		container.addTransient(Foo);
		container.add(Bar);
		container.resolve(User);

		expect(Foo.instanceCount).equal(2);
	});

	it('add factory', () => {
		class Foo {
			constructor() {}
		}

		class Bar {
			constructor({factory}) {
				expect(factory).to.be.instanceOf(Foo);
			}
		}

		container.addFactory('factory', () => new Foo());
		container.resolve(Bar);
	});

	it('toCamelCase', () => {
		class FooManager {
			constructor() {}
		}

		class Bar {
			constructor({fooManager}) {
				expect(fooManager).to.be.instanceOf(FooManager);
			}
		}

		container.add(FooManager);
		container.resolve(Bar);
	});

	it('add service with custom name', () => {
		class FooManager {
			constructor() {}
		}

		class Bar {
			constructor({manager}) {
				expect(manager).to.be.instanceOf(FooManager);
			}
		}

		container.add('manager', FooManager);
		container.resolve(Bar);
	});

	it('throw module not found', () => {
		class Foo {}

		class Bar {
			constructor({foo}) {}
		}

		expect(() => container.resolve(Bar)).to.throw();
	});

	it('throw circular', () => {
		class Foo {
			constructor({bar}) {}
		}

		class Bar {
			constructor({foo}) {}
		}

		container.add(Foo)
		container.add(Bar)

		expect(() => container.resolve(Bar)).to.throw();
	});


})
