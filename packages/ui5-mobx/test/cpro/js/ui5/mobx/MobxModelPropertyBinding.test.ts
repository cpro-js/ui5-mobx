import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import ChangeReason from "sap/ui/model/ChangeReason";
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

  it("simple successful path", () => {
    expect(binding.getValue()).toBe("test");
    expect(binding.getValue()).toBe(state.text);
  });

  it("fail without path", () => {
    expect(() => model.bindProperty("")).toThrowError("Path is required! Provided value: ");
    // @ts-expect-error
    expect(() => model.bindProperty(null)).toThrowError("Path is required! Provided value: null");
    // @ts-expect-error
    expect(() => model.bindProperty(undefined)).toThrowError("Path is required! Provided value: undefined");
    // @ts-expect-error
    expect(() => model.bindProperty()).toThrowError("Path is required! Provided value: undefined");
  });

  it("can handle null values", () => {
    binding = model.bindProperty("/nullProp")
    expect(binding.getValue()).toBeNull();
  });

  it("can handle non existing values", () => {
    binding = model.bindProperty("/doesNotExist")
    expect(binding.getValue()).toBeUndefined();
  });

  it("changing state changes binding", () => {
    // given: spy to check for change event
    // @ts-ignore: UMD import
    const spy = sinon.createSandbox().spy(binding, "fireEvent");

    // when changing the value
    state.text = NEW_VALUE;

    // then value of binding changed
    expect(binding.getValue()).toBe(NEW_VALUE);
    // then change event has been fired
    expect(spy.calledOnce).toBeTrue();
    expect(spy.args[0].length).toBe(2);
    expect(spy.args[0][0]).toBe("change");
    expect(spy.args[0][1]).toEqual({ reason: ChangeReason.Change });
  });

  it("propertyBinding: changing binding changes state", () => {
    binding.setValue(NEW_VALUE);

    expect(state.text).toBe(NEW_VALUE);
  });
});
