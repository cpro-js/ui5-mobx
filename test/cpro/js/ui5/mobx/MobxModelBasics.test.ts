import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import Context from "sap/ui/model/Context";

import { TestState, createTestData } from "./test-infra/TestHelper";

describe("MobxModel Tests", () => {
  let state: TestState;
  let model: MobxModel<TestState>;

  beforeEach(() => {
    state = observable(createTestData());
    model = new MobxModel(state);
  });

  it("smoke test", () => {
    expect(model.getSizeLimit()).toBe(100);
  });

  it("getData", () => {
    expect(model.getData()).toBeTruthy();
    expect(model.getData()).toEqual(state);

    // one-time reassurance, that data matches
    expect(model.getData()).toEqual(createTestData());
  });

  it("setData", () => {
    const newData: TestState = {
      truth: true,
      text: "ho",
      list: [],
      complex: { a: "z", b: "y", list: [] },
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
});
