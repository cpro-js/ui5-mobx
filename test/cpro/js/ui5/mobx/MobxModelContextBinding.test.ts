import { MobxContextBinding } from "cpro/js/ui5/mobx/MobxContextBinding";
import { MobxModel } from "cpro/js/ui5/mobx/MobxModel";
import { observable } from "mobx";
import Context from "sap/ui/model/Context";

import { TestState, createTestData } from "./test-infra/TestHelper";

describe("MobxModel Tests: Context Binding", () => {
  let state: TestState;
  let model: MobxModel<TestState>;
  let binding: MobxContextBinding;
  let ctx: Context;

  const NEW_VALUE = "one to bind them all";

  beforeEach(() => {
    state = observable(createTestData());
    model = new MobxModel(state);
    ctx = new Context(model, "/complex");
    binding = model.bindContext("a", ctx);
  });

  it("smoke test", () => {
    expect(binding.getModel()).toBe(model);
    expect(binding.getBoundContext()).not.toBeNull();
  });

  it("fail without path", () => {
    expect(() => model.bindContext("", ctx)).toThrowError("Path is required! Provided value: ");
  });

  it("changing state changes binding", () => {
    // when changing the value
    state.complex.a = NEW_VALUE;

    // then value of binding changed both in the context
    // and the bound context (the value behind 'a')
    expect(binding.getContext().getProperty("a")).toBe(NEW_VALUE);
    expect(binding.getBoundContext()!.getProperty("")).toBe(NEW_VALUE);
  });

  // unsure if testing it the other way around would make sense
  // it("contextBinding: changing binding changes state", () => {
  //   // not resolved => returns proxy object, instead of direct value 'a'
  //   (binding.getContext().getObject() as TestState["complex"]).a = NEW_VALUE;
  //   expect(state.complex.a).toBe(NEW_VALUE);
  // });
});
