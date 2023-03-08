import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import PropertyBinding from "sap/ui/model/PropertyBinding";

import { TestState, createTestData } from "./test-infra/TestHelper";

describe("MobxModel Tests: Property Binding", () => {
  let state: TestState;
  let model: MobxModel<TestState>;
  let binding: PropertyBinding;

  const NEW_VALUE = "one to bind them all";

  beforeEach(() => {
    state = observable(createTestData());
    model = new MobxModel(state);
    binding = model.bindProperty("/text");
  });

  it("smoke test", () => {
    expect(binding.getValue()).toBe(state.text);
  });

  it("fail without path", () => {
    expect(() => model.bindProperty("")).toThrowError("Path is required! Provided value: ");
  });

  it("changing state changes binding", () => {
    state.text = NEW_VALUE;

    // TODO: spy with sinon on change event

    expect(binding.getValue()).toBe(NEW_VALUE);
  });

  it("propertyBinding: changing binding changes state", () => {
    const binding = model.bindProperty("/text");

    binding.setValue(NEW_VALUE);

    expect(state.text).toBe(NEW_VALUE);
  });
});
