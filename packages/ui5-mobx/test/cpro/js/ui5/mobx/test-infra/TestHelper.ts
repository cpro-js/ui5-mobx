import deepClone from "sap/base/util/deepClone";

const TEST_DATA = {
  truth: false,
  text: "test",
  list: [1, 2, 3],
  complex: {
    a: "a",
    b: "b",
    list: [
      {
        a: "a",
        b: "b",
      },
      {
        c: "c",
        d: "d",
      }
    ]
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

export type TestState = typeof TEST_DATA;

export function createTestData(): TestState {
  return deepClone(TEST_DATA);
}
