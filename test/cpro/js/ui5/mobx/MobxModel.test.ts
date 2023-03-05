import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import deepClone from "sap/base/util/deepClone";

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

  /*
 it("getProperty", () => {
   expect(model.getProperty("truth")).toBe(false);
 });
 */
});
