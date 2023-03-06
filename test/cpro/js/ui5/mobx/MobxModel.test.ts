import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import deepClone from "sap/base/util/deepClone";
import Context from "sap/ui/model/Context";

const TEST_DATA = {
  truth: false,
  text: "test",
  list: [1, 2, 3],
  complex: {
    a: "a",
    b: "b",
  },
  listOfComplex: [
    {
      a: "a",
      b: "b",
    },
    {
      c: "c",
      d: "d",
    },
  ],
};

type TestState = typeof TEST_DATA;

function createTestData(): TestState {
  return deepClone(TEST_DATA);
}

describe("MobxModel Tests", () => {
  let state: TestState;
  let model: MobxModel<TestState>;

  beforeEach(() => {
    state = observable(createTestData());
    model = new MobxModel(state);
  });

  it("getData", () => {
    expect(model.getData()).toBeTruthy();
    expect(model.getData()).toEqual(state);

    // one-time reassurance, that data matches
    expect(model.getData()).toEqual(TEST_DATA);
  });

  it("setData", () => {
    const newData: TestState = {
      truth: true,
      text: "ho",
      list: [],
      complex: { a: "z", b: "y" },
      listOfComplex: [],
    };
    model.setData(observable(newData));

    expect(model.getData()).toEqual(newData);
    expect(model.getData()).not.toEqual(state);
  });

  it("getProperty", () => {
    expect(model.getProperty("/text")).toBe(state.text);
    expect(model.getProperty("/truth")).toBe(state.truth);
    expect(model.getProperty("/list")).toEqual(state.list);
    expect(model.getProperty("/complex")).toEqual(state.complex);
    expect(model.getProperty("/complex/a")).toBe(state.complex.a);
    expect(model.getProperty("/listOfComplex")).toEqual(state.listOfComplex);
    expect(model.getProperty("/xxxNotFoundxxx")).toBeUndefined();
  });

  it("getProperty with context", () => {
    const ctx = new Context(model, "/complex");
    expect(model.getProperty("a", ctx)).toBe(state.complex.a);
  });

  it("setProperty", () => {
    // given: new prop
    const newText = "Merry Christmas 1999!";

    // when: set new prop value
    let result = model.setProperty("/text", newText);

    // then
    expect(result).toBeTruthy();
    expect(model.getProperty("/text")).toBe(newText);
  });

  it("setProperty with context", () => {
    // given
    const newValue = "xxXXxx";
    const ctx = new Context(model, "/complex");

    // when
    let result = model.setProperty("a", newValue, ctx);

    // then
    expect(result).toBeTrue();
    expect(model.getProperty("a", ctx)).toBe(newValue);
  });

  it("propertyBinding: basics", () => {
    const binding = model.bindProperty("/text");

    expect(binding.getValue()).toBe(state.text);
  });

  it("propertyBinding: changing state changes binding", () => {
    const newValue = "one to bind them all";
    const binding = model.bindProperty("/text");

    state.text = newValue;

    // TODO: spy with sinon on change event

    expect(binding.getValue()).toBe(newValue);
  });

  it("propertyBinding: changing binding changes state", () => {
    const newValue = "two to unbind";
    const binding = model.bindProperty("/text");

    binding.setValue(newValue);

    expect(state.text).toBe(newValue);
  });
});
