# @appnest/state

## 🧐 What is this?

A simple flux-inspired state management library.

### Benefits

- Typesafe
- Started, failed, done, invalidated and success versions of the dispatched actions

## 🙃 Step 1 - Install the dependency

```javascript
npm i @appnest/state --save
```

## 😃 Step 2 - Create the actions

The first step towards your glorious state management is to define the actions. An action is of the type `IAction` that contains a `kind`, `status` and an optional `data` and `metadata`. The way you usually want to create actions is by using the `mkDefaultAction` function. Here you need to specify the `data` and the `metadata` types of the `IAction`.

Here's an example on how to create actions. The below example defines two actions. The first action, `getEntities` has the type `IEntity[]` as data and the type `string` as metadata. The other action `createEntity` has the type `IEntity` as data and does not contain any metadata.

```javascript
export const EntityAction = {
	getEntities: mkDefaultAction<IEntity[], string>(),
	createEntity: mkDefaultAction<IEntity>()
};
```

## Step 3 - Dispatch the actions

The next step is to dispatch the actions. You could dispatch the actions through the `Dispatcher` class like this.

```javascript
const data = [ ... ]; // The entities
const metadata = "Hello World";
Dispatcher.instance.dispatch(EntityAction.getEntities.success(data, success));
```

This would work, but it would quickly get very repetitious to type if many of your views need to dispatch this action. Also, all of your views would need to know the specific action which is not optimal. In flux we are recommended to use an abstraction, called action creators, which just abstracts the above into a function.

Action creators should extend the `ActionCreator` class for easier dispatching of events. Here's an example of the above turned into an action creator.

```javascript
export class EntityActionCreator extends ActionCreator {

  constructor (private api: API) {
    super();
  }

  getEntities () {
    this.tryCatch(EntityAction.getEntities, async () => {
      return await this.api.getEntities();
    }, {message: "hello"});
  }

  createEntity () {
    this.tryCatch(EntityAction.createEntity, async () => {
      return await this.api.createEntity();
    });
  }
}
```

You might be wondering what the `tryCatch` function does. This method is really clever. It ensure that the `started`, `success`, `failed`, `invalidated` and `done` actions are also dispatched! **This is super convenient for making stuff as for example loading and error handling**. What happens inside the `tryCatch` function is really simple as shown in the below code:

```javascript
protected tryCatch<Data, Metadata> (actionFactory: IDefaultAsyncActionFactory<Data, Metadata>, bodyFunction: () => Promise<Data>, metadata?: Metadata): void {
  (async () => {
    this.started(actionFactory, undefined, metadata);

    try {
      const data = await bodyFunction();
      this.success(actionFactory, data, metadata);

    } catch (e) {
      this.failed(actionFactory, e, metadata);
    }

    this.done(actionFactory, undefined, metadata);
  })();
}
```


You can always use the

Add an action creator to your application. The action creator

## 🎉 License

Licensed under [MIT](https://opensource.org/licenses/MIT).
