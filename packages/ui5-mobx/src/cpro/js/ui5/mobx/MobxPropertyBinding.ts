import { MobxModelType } from "cpro/js/ui5/mobx/MobxModel";
import { reaction } from "mobx";
import ChangeReason from "sap/ui/model/ChangeReason";
import Context from "sap/ui/model/Context";
import PropertyBinding from "sap/ui/model/PropertyBinding";

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxPropertyBinding extends PropertyBinding {
  private disposer: () => void;

  constructor(private mobxModel: MobxModelType, path: string, context?: Context, params?: object) {
    super(mobxModel, path, context!, params);

    this.disposer = reaction(mobxModel.getProperty.bind(this, path, context), () => {
      this.fireEvent("change", { reason: ChangeReason.Change });
    });
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

  public getValue(): any {
    return this.mobxModel.getProperty(this.path, this.context);
  }

  public setValue(value: any) {
    if (this.isSuspended()) {
      return;
    }
    this.mobxModel.setProperty(this.path, value, this.context);
  }
}
