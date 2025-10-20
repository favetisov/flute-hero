import { Note, NoteDuration } from "./note.model";
import { chunk, range } from "lodash";

export class Composition {
  _id?: string;
  title?: string;
  notes?: Array<Note | null> = Array(1024).fill(null);
  cover: string;
  clef: Note = new Note({ name: "G", octave: 5 });

  constructor(model?, melody?: string) {
    if (model) {
      this._id = model._id;
      this.title = model.title;
      this.notes = model.notes;
      this.cover = model.cover;
      this.clef = model.clefStr ? new Note(model.clefStr) : this.clef;
    }

    if (melody) {
      this.setMelody(melody);
    }
  }

  addNote(note: Note, position?: number) {
    this.notes[position] = note;
  }

  removeNote(position: number) {
    this.notes[position] = null;
  }

  /** получаем ноты, выраженные в виде символов на нотном стане
   * и разбитые по тактам
   * (чтобы лего было отобразить)
   */
  get measures(): Array<Array<{ note?: Note; duration: NoteDuration }>> {
    const measures = [];

    for (const notes of chunk(this.notes, 16)) {
      const line = [];
      let currentPauseLength = 0;
      let i = 0;
      while (i < notes?.length) {
        const note = notes[i];
        if (note) {
          line.push({ note, duration: note.duration });
          i += note.duration;
        } else {
          currentPauseLength = 0;
          while (i < notes?.length && !notes[i + 1]) {
            currentPauseLength++;
            i++;
          }
          line.push({ duration: currentPauseLength });
          i++;
        }
      }
      measures.push(line);
    }
    return measures;
  }

  // ноты передаем одной строкой, через пробел в формате 'C4_1' - целая, 'D#5_2' - половинная и т.д.
  setMelody(notation: string) {
    const INITIAL_SHIFT = 16; // добавляем пустых тактов в начале, чтобы было время подготовиться. такой же блок добавляем в конце.
    let currentPosition = INITIAL_SHIFT;

    const parsedNotes = notation.replace(/\s+/g, " ").trim().split(" ");
    const compositionLength = (() => {
      const rest = parsedNotes.length % 16;
      return rest === 0 ? parsedNotes.length : parsedNotes.length + (16 - rest);
    })();

    this.notes = range(INITIAL_SHIFT + compositionLength + INITIAL_SHIFT).fill(
      null
    );

    for (const noteStr of parsedNotes) {
      const note = new Note(noteStr);
      note._id = currentPosition;
      this.notes[currentPosition] = note;
      currentPosition += note.duration;
    }
  }
}
