# `nano-di`
A tiny tool to improve DX when writing (and more importantly **testing**) Object-Oriented typescript code.

✅ Tiny footprint, good practices baked in

  * 🦥 Lazy instantiation automagically prevents unncessary instantiation of unused dependencies.
  * 🐔 Once instantiated the dependency is remembered and reused for all subsequent calls

✅ Explicit dependency declaration without the work for it.

* ☢️ No need to fumble with decorators
* 🤡 No need to manually declare single-use interfaces
* 🤯 No need to bend your mind around injection Containers
* 🥳 No special notation for injectable classes. All classes are fair game.
* Runs anywhere JS runs, no need for `ReflectMetadata` support

☮️ Aiming for the testing Zen
* 🏋️ No need to fumble around to remember that are the dependencies of the class you're testing. Explicit dependencies mean typescript can now remember you
* 🌠 Developer-first architecture - Optional explicit dependency method declaration means you can now keep things under (some) control even in large codebases
* 😱 Lower the pain of having to manually stub and clean dependencies.

✅ Batteries included, easily replaceable
* Adapters for Jest and Mocha work out of the box. Integration your own is just a piece of cake.
* Easily disable `nano-di` when you need to run integration tests. No pain inflicted, guaranteed.

# The Problem
Let’s take a look at a quick example of what is so very often the standard implementation of classes in Typescript

```typescript
export class ExampleService {
	private dynamo: DynamoDBClient;
	private slack: SlackClient;

	constructor() {
		this.dynamo = new DynamoDBClient("TableName");
		this.slack = new SlackClient("#RoomName");
	}

	async doSomething(thingId: string, newValue: string, user: User) {
		const thing = await this.dynamo.getById(thingId);

		const userRoles = await RoleService.getRoles(user.id);

		if (!userRoles.includes(RoleType.ADMIN)) {
			throw new ForbiddenError("How dare you?");
		}

		const transformedThing = {
			...thing,
			newValue,
			updatedAt: new Date().toISOString(),
			updatedBy: user.id,
		};
		
		await this.dynamo.update(thingId, transformedThing);

		await this.slack.sendMessage(`Something happened: ${newValue}`);

		return transformedThing;
	}
}
```