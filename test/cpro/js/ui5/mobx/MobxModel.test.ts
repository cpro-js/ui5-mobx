import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";

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

describe("MobxModel Tests", () => {
  let state: TestState;
  let model: MobxModel<any>;

  beforeEach(() => {
    state = { ...TEST_DATA };
    model = new MobxModel(observable(state));
  });

  it("dummy", () => {
    expect(model.getData().truth).toBeFalse()
  });

  /*
  it("getData", () => {
    // @ts-ignore
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhh-----------------------------------------");
    expect(model.getData()).toBe(TEST_DATA);
  });
  it("getProperty", () => {
    expect(model.getProperty("truth")).toBe(false);
  });
  */
});
