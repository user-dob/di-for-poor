# di-for-poor

```js
import { Container } from 'di-for-poor';

class Foo {}

class Bar {
	constructor({foo}) {
		this.foo = foo;
	}
}

class User {
	constructor({foo, bar, factory}) {
		this.foo = foo;
		this.bar = bar;
		this.factory = factory;
	}
}

const container = new Container();

container.add(Foo)
container.addTransient(Bar);
container.addFactory('factory', () => new Foo());

const user = container.resolve(User);
```