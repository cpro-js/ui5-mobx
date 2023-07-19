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
    binding = model.bindContext("complex", new Context(model, ""));
    ctx = binding.getBoundContext()!;
  });

  it("createBindingContext", () => {
    expect(model.createBindingContext("")).toBeNull();

    ctx = model.createBindingContext("", new Context(model, ""))!;
    expect(ctx.getPath()).toBe("/");
    expect(ctx.getModel()).toBe(model);
  });

  it("base tests", () => {
    expect(binding.getPath()).toBe("complex");
    expect(binding.getResolvedPath()).toBe("/complex");
    expect(binding.getModel()).toBe(model);
    expect(binding.getContext().getPath()).toEqual("");
    expect(ctx.getPath()).toEqual("/complex");
    expect(ctx.getObject("")).toBe(state.complex);
    expect(ctx.getObject("list")).toBe(state.complex.list);
    expect(ctx.getProperty("list")).toBe(state.complex.list);
    expect(ctx.getProperty("a")).toBe(state.complex.a);
  });

  it("fail without path", () => {
    expect(() => model.bindContext("", ctx)).toThrowError("Path is required! Provided value: ");
    // @ts-expect-error
    expect(() => model.bindContext(null, ctx)).toThrowError("Path is required! Provided value: null");
    // @ts-expect-error
    expect(() => model.bindContext(undefined, ctx)).toThrowError("Path is required! Provided value: undefined");
  });

  it("with wrong path", () => {
    const nonPath = "xxx DoesntExist xxx";
    const b = model.bindContext(nonPath, new Context(model, ""));

    expect(b.getPath()).toBe(nonPath);
    expect(b.getBoundContext()!.getProperty("xxx")).toBeNull();
  });

  it("without context", () => {
    const b = model.bindContext("complex");
    expect(b.getPath()).toBe("complex");
    expect(b.getBoundContext()).toBeNull();

    expect(model.bindContext("complex", undefined).getBoundContext()).toBeNull();
    expect(model.bindContext("complex", null).getBoundContext()).toBeNull();
  });

  it("works with propertyBinding", () => {
    // when using bound context with property binding
    const propBinding = model.bindProperty("a", ctx);

    // then we get a value
    expect(propBinding.getValue()).toBe(state.complex.a);
  });

  it("works with listBinding", () => {
    // when using bound context with list binding
    const listBinding = model.bindList("list", ctx);

    // then we get a value
    expect(listBinding.getCount()).toBe(state.complex.list.length);
  });

  it("changing state changes property binding", () => {
    // given a property binding
    const propBinding = model.bindProperty("a", ctx);

    // when changing the value
    state.complex.a = NEW_VALUE;

    // then value of prop binding changed
    expect(propBinding.getValue()).toBe(NEW_VALUE);
    // change also visible from context
    expect(propBinding.getContext()!.getProperty("a")).toBe(NEW_VALUE);
    expect(ctx.getProperty("a")).toBe(NEW_VALUE);
  });

  it("changing property binding changes state", () => {
    // given a property binding
    const propBinding = model.bindProperty("a", ctx);

    // when changing the value
    propBinding.setValue(NEW_VALUE);

    // then state changed
    expect(state.complex.a).toBe(NEW_VALUE);
  });

  it("changing state changes list binding", () => {
    // given a list binding
    const listBinding = model.bindList("list", ctx);

    // when changing the value
    state.complex.list[0].a = NEW_VALUE;

    // then value changed
    expect(listBinding.getData()![0].a).toBe(NEW_VALUE);
  });

  it("changing list binding changes state", () => {
    // given a list binding
    const listBinding = model.bindList("list", ctx);

    // when changing the value
    listBinding.setValue([]);

    // then state changed
    expect(state.complex.list).toEqual([]);
  });
});
