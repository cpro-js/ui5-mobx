import { isObservable } from "mobx";
import Context from "sap/ui/model/Context";
import Model from "sap/ui/model/Model";
import PropertyBinding from "sap/ui/model/PropertyBinding";

import { IMobxModel } from "./IMobxModel";
import { MobxPropertyBinding } from "./MobxPropertyBinding";

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxModel<T extends object> extends Model implements IMobxModel<T> {
  constructor(private observable: T) {
    super();

    this.setData(observable);
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
    // @ts-expect-error: resolve method of model class is not included in typings
    const resolvedPath = this.resolve(path, context);
    if (!resolvedPath) {
      return undefined;
    }

    // retrieve the value by recursively traversing the path parts
    const parts = resolvedPath.substring(1).split("/");
    return parts.reduce((node: any, current: string) => {
      return node[current];
    }, this.observable);
  }

  public getProperty(path: string, context?: Context): any {
    return this.getNode(path, context);
  }

  public setProperty(path: string, value: any, context?: Context) {
    // @ts-expect-error: resolve method of model class is not included in typings
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
  //
  // bindContext(sPath: string, oContext?: Context, mParameters?: object, oEvents?: object): ContextBinding {
  //   return super.bindContext(sPath, oContext, mParameters, oEvents);
  // }
  //
  // bindList(
  //   sPath: string,
  //   oContext?: Context,
  //   aSorters?: Sorter | Sorter[],
  //   aFilters?: Filter | Filter[],
  //   mParameters?: object
  // ): ListBinding {
  //   return super.bindList(sPath, oContext, aSorters, aFilters, mParameters);
  // }

  public bindProperty(path: string, context?: Context, mParameters?: object): PropertyBinding {
    if (!path || !context) {
      throw new Error(`Path [${path}] or context is null [${typeof context}]`);
    }
    return new MobxPropertyBinding(this, path, context, mParameters);
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
