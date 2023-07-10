# UI5-MobX

Use the powerful concepts of [MobX](https://mobx.js.org/README.html#introduction)
to manage state in [UI5](https://sdk.openui5.org/).

`ui5-mobx` provides a special `sap.ui.model.Model` implementation
and reactive bindings (PropertyBinding, ListBinding, ContextBinding)
which support one-way and two-way data binding.

In contrast to other model implementations, the provided `MobxModel`
focuses on state management and change propagation only. It intentionally doesn't
handle webservice requests. Single responsibility!

## Status Quo

First versions. Pretty much alpha.

Currently, the ContextBinding doesn't work.

More tests are missing.

## The Gist

1. Externalize your state as Mobx observable
2. Init `MobxModel` with state and bind to view
3. Only interact with externalized state from here on

```typescript
import { MobxModel } from "ui5-mobx";
import { makeAutoObservable } from "mobx";

export default class MobxMainController extends BaseController {
  // 1. here we create our state and make it observable
  private state = makeAutoObservable({
    searchForm: {firstName: "", lastName: ""},
    people: []
  });

  onInit() {
    // 2. initialize the MobxModel with our state and pass it to the view
    const model = new MobxModel(this.state);
    this.getView().setModel(model);
  }

  onEvent() {
    // 3. directly retrieve your state preserving all of it types
    const { searchForm, people } = this.state;
    ...

    // 4. manipulate state => it will result in a view change
    people.push({firstName: "Heinz", lastName: "Tester"});
  }

}
```

## Origins

The origins of this approach date back to early 2017 or, more specifically, this Sap Blog article:
[Reactive State Management in SAPUI5 via MobX](https://blogs.sap.com/2017/01/30/advanced-state-management-in-sapui5-via-mobx/).

## Installation

Mobx itself is only a peer-dependency for `ui5-mobx`, so it must be installed additionally:

```
npm install --save mobx mobx ui5-mobx
```

## Documentation

None yet.

## Examples

None yet.

## License

MIT
