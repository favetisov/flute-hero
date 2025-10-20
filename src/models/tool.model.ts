import { Theme } from "./theme.model";

export class Tool {
  _id: number;
  icon: string;
  name: string;
  description: string;
  theme?: Theme;

  constructor(model?) {
    if (model) {
      this._id = model._id;
      this.icon = model.icon;
      this.name = model.name;
      this.description = model.description;
      this.theme = model.theme ? new Theme(model.theme) : undefined;
    }
  }
}
