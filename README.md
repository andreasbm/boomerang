# @appnest/state

## 🧐 What is this?

A simple flux-inspired state management library.

If you want to brush up your flux skills I can recommend [this](https://blog.andrewray.me/flux-for-stupid-people/) article.

## Benefits

- Typesafe
- `started`, `success`, `failed`, `invalidated` and `done` actions are dispatched along side your own actions! **This is super convenient for making stuff as for example loading and error handling**.

## 👌 Step 1 - Install the dependency

```javascript
npm i @appnest/state --save
```

## 👊 Step 2 - Create the actions

The first step towards your glorious state management is to define the actions. An action is of the type `IAction` that contains a `kind`, `status` and an optional `data` and `metadata`. The way you usually want to create actions is by using the `mkDefaultAction` function. Here you need to specify the `data` and the `metadata` types of the `IAction`.

Here's an example on how to create actions. The below example defines two actions. The first action, `getEntities` has the type `IEntity[]` as data and the type `string` as metadata. The other action `createEntity` has the type `IEntity` as data and does not contain any metadata.

```javascript
export const EntityAction = {
  getEntities: mkDefaultAction<IEntity[], string>(),
  createEntity: mkDefaultAction<IEntity>()
};
```

## 👏 Step 3 - Dispatch the actions

The next step is to dispatch the actions. You could dispatch the actions through the `Dispatcher` class like this.

```javascript
// Get entities
const data = await this.api.getEntities();
const metadata = "Hello World";
Dispatcher.instance.dispatch(EntityAction.getEntities.success(data, metadata));

// Create entity
const data = await this.api.createEntity();
Dispatcher.instance.dispatch(EntityAction.getEntities.success(data, null));

```

This works,but it would quickly get very repetitious to type if many of your views need to dispatch this action. Also, all of your views would need to know the specific action which is not optimal. In flux we are recommended to use an abstraction, called action creators, which just abstracts the above into a function.

Action creators should extend the `ActionCreator` class for easier dispatching of events. Here's an example of the above turned into an action creator.

```javascript
export class EntityActionCreator extends ActionCreator {

  constructor (private api: API) {
    super();
  }

  getEntities () {
    this.tryCatch(EntityAction.getEntities, async () => {
      return await this.api.getEntities();
    }, "Hello World"});
  }

  createEntity () {
    this.tryCatch(EntityAction.createEntity, async () => {
      return await this.api.createEntity();
    });
  }
}
```

You might be wondering what the `tryCatch` function does. This method is really clever. It ensures that the `started`, `success`, `failed`, `invalidated` and `done` actions are dispatched along side your own actions! **This is super convenient for making stuff as for example loading and error handling**. What happens inside the `tryCatch` function is really simple as shown in the below code.

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

## 💪 Step 4 - Handle the actions

Soo.. Now you have some actions and you are dispatching them. You now need a store that can handle them. To create a store, you will need to extend the `Store` class that provides the store behavior by subscribing to the `Dispatcher`. The only thing you will need to do now is to implement the `protected abstract handler (action: IAction): void;` and handle the relevant actions. To handle an action you are encouraged to use the `isAction` method. Here's an example on how a store could look.

```javascript
export class EntityStore extends Store<IEntityStoreEvent> {
  protected handler (action: IAction) {
    if (isAction(action, EntityAction.createEntity.success)) {
      // TODO: Add the new entity to the list

    } else if (isAction(action, EntityAction.getEntities.success)) {
      // TODO: Handle the new entities (can be cound in the action.data)

    } else if (isAction(action, EntityAction.createEntity.failed)) {
      // TODO: Handle that the creation failed
    }

    // Loading related stuff
    if (isAction(action, EntityAction.createEntity.started) || isAction(action, EntityAction.getEntities.started)) {
      // TODO: Handle the loading started event

    } else if (isAction(action, EntityAction.createEntity.done) || isAction(action, EntityAction.getEntities.done)) {
      // TODO: Handle the loading ended event
    }
  }
}
```

## 👍 Step 5 - Update the view

We can now handle the actions! The last step is to update the view. The view needs to know of the store and is able to subscribe to the store since it extends the `Subject` class. It is therefore possible for the store to dispatch events and for the view to listen to them. Here's an example on how that could look.

```javascript
export enum EntityStoreEventKind {
  entityAdded,
  entitiesChanged,
  entityAddedError,
  loadingStarted,
  loadingEnded
}

export interface IEntityStoreEvent {
  kind: EntityStoreEventKind;
  data?: Json;
}
export class EntityStore extends Store<IEntityStoreEvent> {

  private _entities: IEntity[] = [];
  get entities () {
    return this._entities;
  }

  protected handler (action: IAction) {
    console.log(action);

    if (isAction(action, EntityAction.createEntity.success)) {
      this._entities.push(action.data);
      this.dispatch({kind: EntityStoreEventKind.entityAdded});

    } else if (isAction(action, EntityAction.getEntities.success)) {
      this._entities = action.data;
      this.dispatch({kind: EntityStoreEventKind.entitiesChanged});

    } else if (isAction(action, EntityAction.createEntity.failed)) {
      this.dispatch({kind: EntityStoreEventKind.entityAddedError, data: "Sometimes it goes wrong.."});
    }

    // Loading related stuff
    if (isAction(action, EntityAction.createEntity.started) || isAction(action, EntityAction.getEntities.started)) {
      this.dispatch({kind: EntityStoreEventKind.loadingStarted});

    } else if (isAction(action, EntityAction.createEntity.done) || isAction(action, EntityAction.getEntities.done)) {
      this.dispatch({kind: EntityStoreEventKind.loadingEnded});
    }
  }
}
```

And here's the view that listens to changes in the `EntityStore` and dispatches actions through the `EntityActionCreator`.

```javascript
class OverviewComponent {

  private isLoading = false;

  constructor (private entityActionCreator = new EntityActionCreator(new API()),
               private entityStore = new EntityStore()) {
    this.entityStoreListener = this.entityStoreListener.bind(this);
  }

  connectedCallback () {
    this.entityStore.addListener(this.entityStoreListener);
    this.entityActionCreator.getEntities();
  }

  private entityStoreListener (e: IEntityStoreEvent) {
    switch (e.kind) {
      case EntityStoreEventKind.entitiesChanged:
        break;
      case EntityStoreEventKind.entityAdded:
        break;
      case EntityStoreEventKind.entityAddedError:
        alert(e.data);
        return;
      case EntityStoreEventKind.loadingStarted:
        this.isLoading = true;
        break;
      case EntityStoreEventKind.loadingEnded:
        this.isLoading = false;
        break;
    }

    this.invalidate();
  }

  disconnectedCallback () {
    this.entityStore.removeListener(this.entityStoreListener);
  }

  private createEntity () {
    this.entityActionCreator.createEntity();
  }

  ...
}

```

## 🎉 License

Licensed under [MIT](https://opensource.org/licenses/MIT).
