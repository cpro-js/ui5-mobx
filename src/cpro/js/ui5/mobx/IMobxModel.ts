import Context from "sap/ui/model/Context";
import Model from "sap/ui/model/Model";

export interface IMobxModel<T extends object = any> extends Model {
  getData: () => T;
  setData: (model: T) => void;
  getProperty(path: string, context?: Context): any;
  setProperty(path: string, value: any, context: Context): boolean;
}
