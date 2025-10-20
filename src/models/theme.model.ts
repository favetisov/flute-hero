export class Theme {
  name: string;
  background: string;
  color: string;
  cover: string;
  border: string;
  textFilter: string;
  noteColor: string;
  noteFilter: string;
  noteProcessedColor: string;
  noteProcessedFilter: string;

  constructor(model?) {
    if (model) {
      this.name = model.name;
      this.background = model.background;
      this.color = model.color;
      this.cover = model.cover;
      this.textFilter = model.textFilter;
      this.border = model.border;

      this.noteColor = model.noteColor;
      this.noteProcessedColor = model.noteProcessedColor;
      this.noteFilter = model.noteFilter;
      this.noteProcessedFilter = model.noteProcessedFilter;
    }
  }
}
