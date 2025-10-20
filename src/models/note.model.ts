export enum NoteName {
  "A" = "A",
  "A#" = "A#",
  "B" = "B",
  "C" = "C",
  "C#" = "C#",
  "D" = "D",
  "D#" = "D#",
  "E" = "E",
  "F" = "F",
  "F#" = "F#",
  "G" = "G",
  "G#" = "G#",
}

export enum NoteDuration {
  "whole" = 16,
  "half" = 8,
  "quarter" = 4,
  "eighth" = 2,
  "sixteenth" = 1,
}

export const NoteAliases = {
  C: "До",
  D: "Ре",
  E: "Ми",
  F: "Фа",
  G: "Соль",
  A: "Ля",
  B: "Си",
};

export const NoteAliasesVesnyanka = {
  C: "Ё",
  D: "Ле",
  E: "Ви",
  F: "На",
  G: "Зо",
  A: "Ра",
  B: "Ти",
};

export class Note {
  _id?: number;
  name?: NoteName;
  octave?: number;
  duration?: NoteDuration;
  text?: string;
  alias?: string;
  aliasVesnyanka?: string;

  constructor(model?) {
    if (model) {
      if (typeof model === "string") {
        const [noteNameOctave, durationStr, text] = model.split("_");
        this.name = noteNameOctave.slice(0, -1) as NoteName;
        this.octave = parseInt(noteNameOctave.slice(-1));
        this.duration = 16 / parseInt(durationStr);
        this.text = text;
      } else {
        this._id = model._id;
        this.name = model.name;
        this.octave = model.octave;
        this.duration = model.duration;
        this.text = model.text;
      }
      this.alias = NoteAliases[this.name];
      this.aliasVesnyanka = NoteAliasesVesnyanka[this.name];
    }
  }
}

export class Pause {
  duration?: NoteDuration;

  constructor(model?) {
    if (model) {
      this.duration = model.duration;
    }
  }
}
