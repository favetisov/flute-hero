export class Theme {
  name: string;
  background: string;
  color: string;

  coverFullscreen: string;
  coverBottomFullWidth?: string;
  coverBottomCenter?: string;
  coverTopRight?: string;

  border: string;
  textFilter: string;
  noteColor: string;
  noteEmptyColor: string;
  noteFilter: string;
  noteProcessedColor: string;
  noteProcessedFilter: string;

  constructor(model?) {
    if (model) {
      this.name = model.name;
      this.background = model.background;
      this.color = model.color;
      this.textFilter = model.textFilter;
      this.border = model.border;

      this.noteColor = model.noteColor;
      this.noteEmptyColor = model.noteEmptyColor;
      this.noteProcessedColor = model.noteProcessedColor;
      this.noteFilter = model.noteFilter;
      this.noteProcessedFilter = model.noteProcessedFilter;

      this.coverFullscreen = model.coverFullscreen;
      this.coverBottomFullWidth = model.coverBottomFullWidth;
      this.coverBottomCenter = model.coverBottomCenter;
      this.coverTopRight = model.coverTopRight;
    }
  }
}
