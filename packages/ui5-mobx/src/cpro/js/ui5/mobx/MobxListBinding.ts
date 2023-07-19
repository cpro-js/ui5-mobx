import { MobxModelType } from "cpro/js/ui5/mobx/MobxModel";
import { reaction } from "mobx";
import ChangeReason from "sap/ui/model/ChangeReason";
import Context from "sap/ui/model/Context";
import Filter from "sap/ui/model/Filter";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxListBinding extends ListBinding {
  private disposer: () => void;

  constructor(
    private mobxModel: MobxModelType,
    path: string,
    context?: Context,
    sorters?: Sorter | Sorter[],
    filters?: Filter | Filter[],
    params?: object
  ) {
    super(mobxModel, path, context!, sorters, filters, params);

    this.disposer = reaction(
      () => {
        const observable = mobxModel.getProperty(path, context);
        return Array.isArray(observable) ? observable.slice() : null;
      },
      () => {
        this.fireEvent("change", { reason: ChangeReason.Change });
      }
    );
  }

  private get path(): string {
    // @ts-ignore
    return this.sPath;
  }

  private get context(): Context | undefined {
    // @ts-ignore
    return this.oContext;
  }

  public destroy() {
    this.disposer();
    super.destroy();
  }

  public getData(): Array<any> | null | undefined {
    return this.mobxModel.getProperty(this.path, this.context);
  }

  public getLength(): number {
    return this.getData()?.length || 0;
  }

  public getContexts(startIndex: number = 0, size: number = 0): Context[] {
    const sizeLimit = size || this.mobxModel.getSizeLimit();
    const ctxSize = Math.min(this.getLength() - startIndex, sizeLimit);

    let prefix = this.getResolvedPath() || "";
    if (prefix && !prefix.endsWith("/")) {
      prefix += "/";
    }

    if (ctxSize < 1) {
      return [];
    }

    // create array of known size
    return (
      [...Array(ctxSize).keys()]
        // shift index
        .map((idx) => startIndex + idx)
        // map to context
        .map((idx) => this.mobxModel.getContext(prefix + idx))
    );
  }

  public setValue(value: any) {
    if (this.isSuspended()) {
      return;
    }
    this.mobxModel.setProperty(this.path, value, this.context);
  }
}
