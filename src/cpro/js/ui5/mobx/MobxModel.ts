import { MobxContextBinding } from "cpro/js/ui5/mobx/MobxContextBinding";
import { MobxListBinding } from "cpro/js/ui5/mobx/MobxListBinding";
import { isObservable } from "mobx";
import Context from "sap/ui/model/Context";
import ContextBinding from "sap/ui/model/ContextBinding";
import Filter from "sap/ui/model/Filter";
import Model from "sap/ui/model/Model";
import Sorter from "sap/ui/model/Sorter";

import { MobxPropertyBinding } from "./MobxPropertyBinding";

export interface MobxModelType<T extends object = any> extends Model {
  getData: () => T;
  setData: (model: T) => void;

  getProperty(path: string, context?: Context): any;

  setProperty(path: string, value: any, context?: Context): boolean;

  getContext(path: string): Context;

  getSizeLimit(): number;
}

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxModel<T extends object> extends Model implements MobxModelType<T> {
  constructor(private observable: T) {
    super();

    this.setData(observable);
  }

  // workaround for missing typings of Model class
  private resolve(path: string, ctx?: Context): string | undefined {
    //@ts-expect-error: resolve method of Model class is not included in typings
    return super.resolve(path, ctx);
  }

  // workaround for missing typings of Model class
  public getContext(path: string): Context {
    //@ts-expect-error: getContext method of Model class is not included in typings
    return super.getContext(path);
  }

  public getSizeLimit(): number {
    //@ts-expect-error: no typing available
    return this.iSizeLimit;
  }

  public getData() {
    return this.observable;
  }

  /**
   * TODO: JSONModel provides for merge option. Needed?
   *
   * @param observable
   */
  public setData(observable: T) {
    if (!isObservable(observable)) {
      throw new Error("MobxModel: Passed data is not a mobx observable!");
    }
    this.observable = observable;
  }

  private getNode(path: string, context?: Context) {
    const resolvedPath = this.resolve(path, context);
    if (!resolvedPath) {
      return undefined;
    }

    // retrieve the value by recursively traversing the path parts
    const parts = resolvedPath.substring(1).split("/");
    return parts.reduce((node: any, current: string) => {
        return node && current ? node[current] : null;
    }, this.observable);
  }

  public getProperty = (path: string, context?: Context): any => {
    return this.getNode(path, context);
  };

  public setProperty(path: string, value: any, context?: Context) {
    const resolvedPath = this.resolve(path, context);

    if (!resolvedPath) {
      return false;
    }
    // If data is set on root, call setData instead
    if (resolvedPath === "/") {
      throw new Error(
        'invariant: setting a new root object (observable) "/" after constructing the model is not yet supported in MobxModel'
      );
      // this.setData(value);
      // return true;
    }

    const lastSlash = resolvedPath.lastIndexOf("/");
    const property = resolvedPath.substring(lastSlash + 1);

    // TODO: refactor
    const node = lastSlash === 0 ? this.observable : this.getNode(resolvedPath.substring(0, lastSlash), context);
    if (node) {
      node[property] = value;
      return true;
    }
    return false;
  }

  /**
   * Follows the implementation of sap.ui.model.ClientModel which is used by
   * the JSONModel.
   *
   * @param path
   * @param ctx
   * @param parameters
   * @param callback
   * @param reload
   */
  public createBindingContext(
    path: string,
    ctx?: Context,
    parameters?: object,
    callback?: Function,
    reload?: boolean
  ): Context | undefined {
    // optional parameter handling
    if (typeof ctx === "function") {
      callback = ctx;
      ctx = undefined;
    }
    if (typeof parameters === "function") {
      callback = parameters;
    }
    // resolve path and create context
    const ctxPath = this.resolve(path, ctx);
    let newCtx = ctxPath === undefined ? null : this.getContext(ctxPath || "/");
    if (!newCtx) {
      newCtx = null;
    }
    if (callback) {
      callback(newCtx);
    }

    // @ts-ignore: actually we might return null instead of undefined
    return newCtx;
  }

  /**
   * Noop. Nothing to do.
   * @param ctx
   */
  public destroyBindingContext(ctx: Context) {}

  public bindContext(path: string, ctx: Context, parameters?: object, events?: object): ContextBinding {
    if (!path) {
      throw new Error(`Path is required! Provided value: ${path}`);
    }
    return new MobxContextBinding(this, path, ctx, parameters, events);
  }

  public bindProperty(path: string, ctx?: Context, parameters?: object): MobxPropertyBinding {
    if (!path) {
      throw new Error(`Path is required! Provided value: ${path}`);
    }
    return new MobxPropertyBinding(this, path, ctx, parameters);
  }

  public bindList(
    path: string,
    ctx?: Context,
    sorters?: Sorter | Sorter[],
    filters?: Filter | Filter[],
    parameters?: object
  ): MobxListBinding {
    if (!path) {
      throw new Error(`Path is required! Provided value: ${path}`);
    }
    return new MobxListBinding(this, path, ctx, sorters, filters, parameters);
  }

  /*
    bindTree(
      sPath: string,
      oContext?: Context,
      aFilters?: Filter[],
      mParameters?: object,
      aSorters?: Sorter[]
    ): TreeBinding {
      return super.bindTree(sPath, oContext, aFilters, mParameters, aSorters);
    }*/
}
