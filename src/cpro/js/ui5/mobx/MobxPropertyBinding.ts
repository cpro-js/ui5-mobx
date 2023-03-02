import { reaction } from "mobx";
import ChangeReason from "sap/ui/model/ChangeReason";
import Context from "sap/ui/model/Context";
import PropertyBinding from "sap/ui/model/PropertyBinding";

import { IMobxModel } from "./IMobxModel";

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxPropertyBinding extends PropertyBinding {
  private disposer: () => void;

  constructor(private mobxModel: IMobxModel, private path: string, private context: Context, params?: object) {
    super(mobxModel, path, context, params);

    this.disposer = reaction(mobxModel.getProperty.bind(this, path, context), () => {
      this.fireEvent("change", { reason: ChangeReason.Change });
    });
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
