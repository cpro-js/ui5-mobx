import { MobxListBinding } from "cpro/js/ui5/mobx/MobxListBinding";
import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";

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

  it("smoke test", () => {
    expect(binding.getLength()).toBe(state.listOfComplex.length);
    expect(binding.getModel()).toBe(model);
  });

  it("fail without path", () => {
    expect(() => model.bindList("")).toThrowError("Path is required! Provided value: ");
  });

  it("changing state changes binding", () => {
    state.listOfComplex = NEW_VALUE;

    // TODO: spy with sinon on change event

    expect(binding.getData()).toEqual(NEW_VALUE);
  });

  it("changing nested state changes binding", () => {
    state.listOfComplex[0].a = "z";

    // TODO: spy with sinon on change event

    expect(binding.getData()[0].a).toEqual("z");
  });

  it("propertyBinding: changing binding changes state", () => {
    binding.setValue(NEW_VALUE);

    expect(state.listOfComplex).toEqual(NEW_VALUE);
  });
});
