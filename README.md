# UI5-MobX

Use the powerful concepts of [MobX](https://mobx.js.org/README.html#introduction)
to manage state in [UI5](https://sdk.openui5.org/).

`ui5-mobx` provides a special `sap.ui.model.Model` implementation
and reactive bindings (PropertyBinding, ListBinding, ContextBinding)
which support one-way and two-way data binding.

In contrast to other model implementations, the provided `MobxModel`
focuses on state management and change propagation only. It intentionally doesn't
handle webservice requests. Single responsibility!

## Mono Repo vs Module
This is the root of the mono repository, which includes other stuff like example apps.

[Go to the ui5-mobx module](./packages/ui5-mobx).

## Support, Feedback, Contributing
This project is open to feature requests, suggestions, bug reports, usage questions etc.
via [GitHub issues](https://github.com/cpro-js/ui5-mobx/issues).

Contributions and feedback are encouraged and always welcome.

See the [contribution guidelines](https://github.com/cpro-js/ui5-mobx/blob/main/CONTRIBUTING.md) for further information.


## License

MIT
