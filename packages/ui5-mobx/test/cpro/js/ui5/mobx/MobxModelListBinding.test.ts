import { MobxListBinding } from "cpro/js/ui5/mobx/MobxListBinding";
import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import ChangeReason from "sap/ui/model/ChangeReason";

import { TestState, createTestData } from "./test-infra/TestHelper";

describe("MobxModel Tests: List Binding", () => {
  let state: TestState;
  let model: MobxModel<TestState>;
  let binding: MobxListBinding;

  const NEW_VALUE = [
    {
      a: "z",
      b: "y",
    },
    {
      c: "x",
      d: "w",
    },
  ];

  beforeEach(() => {
    state = observable(createTestData());
    model = new MobxModel(state);
    binding = model.bindList("/listOfComplex");
  });

  it("test basics", () => {
    expect(binding.getModel()).toBe(model);
    expect(binding.getContext()).toBeUndefined();
    expect(binding.getLength()).toBe(state.listOfComplex.length);
    expect(binding.getCount()).toBe(state.listOfComplex.length);
    expect(binding.getData()).toBe(state.listOfComplex);
    expect(binding.getContexts().length).toBe(2);
    expect(binding.getContexts()[0].toString()).toBe("/listOfComplex/0");
  });

  it("fail without path", () => {
    expect(() => model.bindList("")).toThrowError("Path is required! Provided value: ");
    // @ts-expect-error
    expect(() => model.bindList(null)).toThrowError("Path is required! Provided value: null");
    // @ts-expect-error
    expect(() => model.bindList(undefined)).toThrowError("Path is required! Provided value: undefined");
    // @ts-expect-error
    expect(() => model.bindList()).toThrowError("Path is required! Provided value: undefined");
  });

  it("changing state changes binding", () => {
    // given: spy to check for change event
    // @ts-ignore: UMD import
    const spy = sinon.createSandbox().spy(binding, "fireEvent");

    // when changing the value
    state.listOfComplex = NEW_VALUE;

    // then value of binding changed
    expect(binding.getData()).toEqual(NEW_VALUE);
    // then change event has been fired
    expect(spy.calledOnce).toBeTrue();
    expect(spy.args[0].length).toBe(2);
    expect(spy.args[0][0]).toBe("change");
    expect(spy.args[0][1]).toEqual({ reason: ChangeReason.Change });
  });

  it("changing nested state changes binding", () => {
    // @ts-ignore: UMD import
    const spy = sinon.createSandbox().spy(binding, "fireEvent");

    state.listOfComplex[0].a = "z";

    expect(binding.getData()[0].a).toEqual("z");
    // TODO: check if this is interesting at all
    expect(spy.called).toBeFalse();
  });

  it("changing binding changes state", () => {
    binding.setValue(NEW_VALUE);

    expect(state.listOfComplex).toEqual(NEW_VALUE);
  });

  it("using property binding", () => {
    const propBinding = model.bindProperty("a", binding.getContexts()[0])

    expect(propBinding.getPath()).toBe("a")
    expect(propBinding.getValue()).toBe("a")

    // change via binding
    propBinding.setValue("z")
    expect(state.listOfComplex[0].a).toEqual("z");

    // change via state
    state.listOfComplex[0].a = "b";
    expect(state.listOfComplex[0].a).toEqual("b");
  });

});
