import { Note } from "@/models/note.model";
import { range } from "lodash";

const allNotes = range(1, 8).flatMap((octave) =>
  ["C", "D", "E", "F", "G", "A", "B"].map((noteName) => noteName + octave)
);

export const getNoteShift = (note: Note, clef: Note) => {
  const noteIndex = allNotes.indexOf(note.name + note.octave);
  const clefIndex = allNotes.indexOf(clef.name + clef.octave);
  return noteIndex - clefIndex;
};
