import { MobxModelType } from "cpro/js/ui5/mobx/MobxModel";
import Context from "sap/ui/model/Context";
import ContextBinding from "sap/ui/model/ContextBinding";

/**
 * @namespace cpro.js.ui5.mobx
 */
export class MobxContextBinding extends ContextBinding {
  constructor(model: MobxModelType, path: string, ctx?: Context | null, parameters?: object, events?: object) {
    super(model, path, ctx!, parameters, events);

    model.createBindingContext(this.path, this.context, parameters, (context: Context) => {
      // @ts-ignore: not typed
      this.bInitial = false;
      // @ts-ignore: not typed
      this.oElementContext = context;
    });
  }

  private get model(): MobxModelType {
    // @ts-ignore
    return this.oModel;
  }

  private get path(): string {
    // @ts-ignore
    return this.sPath;
  }

  private get context(): Context | undefined {
    // @ts-ignore
    return this.oContext;
  }

  private get parameters(): object {
    // @ts-ignore
    return this.mParameters;
  }

  public initialize() {
    //recreate Context: force update
    this.model.createBindingContext(
      this.path,
      this.context,
      this.parameters,
      (context: Context) => {
        // @ts-ignore: not typed
        this.oElementContext = context;
        // @ts-ignore: not typed
        this._fireChange();
      },
      true
    );
  }
}
