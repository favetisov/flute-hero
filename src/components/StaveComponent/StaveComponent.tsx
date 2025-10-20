import { useCompositionStore } from "@/store/composition.store";
import { useMemo } from "react";
import { getNoteShift } from "./note-shifts";
import { Note } from "@/models/note.model";
import s from "./StaveComponent.module.css";
import { range } from "lodash";
import { ClefIcon } from "@/icons/clef.icon";
import { FrogIcon } from "@/icons/frog.icon";
import { Tooltip } from "../Tooltip/Tooltip";
import { NoteIcon } from "@/icons/note.icon";
import { MosquitoIcon } from "@/icons/mosquito.icon";
import g from "../../global.module.css";
import { classNames } from "@/tools/class-names";
const LINE_SPACING = 30;

export const StaveComponent = () => {
  const store = useCompositionStore();

  const clefPosition = useMemo(() => {
    return (
      getNoteShift(new Note("D6"), store.composition.clef) * LINE_SPACING * 0.5
    );
  }, [store.composition]);

  const getNotePosition = (note: Note) => {
    const position =
      clefPosition -
      getNoteShift(note, store.composition.clef) * LINE_SPACING * 0.5;
    return position;
  };

  return (
    <div className={s.stave}>
      {range(5).map((i) => (
        <div
          key={i}
          className={s.line}
          style={{ top: LINE_SPACING * i + "px" }}
        ></div>
      ))}

      <div className={s.clefContainer} style={{ top: clefPosition }}>
        <Tooltip
          label={
            <div className={g.tooltip}>
              <h4>Ключ</h4>
              <div>Показывает, где располагается звук Ё</div>
              <div>
                Положение ключа можно менять, вместе с ним будет меняться
                положение нот
              </div>
            </div>
          }
        >
          <ClefIcon height={90} />
        </Tooltip>
      </div>

      <div
        className={s.frogContainer}
        style={{
          top: store.lastPlayedNote
            ? getNotePosition(store.lastPlayedNote)
            : clefPosition,
        }}
      >
        <Tooltip
          label={
            <div className={g.tooltip}>
              <h4>Фиона</h4>
              <div>
                Чтобы перемещать Фиону вверх и вниз, играй на флейте ноты.
              </div>

              <div>
                Следи за тем, чтобы дырочки были закрыты плотно, чтобы ноты
                звучали чисто.
              </div>
            </div>
          }
        >
          <FrogIcon height={40} isEating={Boolean(store.currentPlayedNote)} />
        </Tooltip>
      </div>

      <div
        className={s.measuresContainer}
        style={{
          transform: `translateX(calc(${store.currentBeat} * -20px + 250px ))`, // 20px - ширина одного бита, 200px - сдвиг вправо, чтобы не упереться в край
          transition: `transform ${
            60000 / (store.beatsPerMinute * 4)
          }ms linear`,
        }}
      >
        {store.composition.measures.map((measure, mIdx) => (
          <div className={s.measure} key={mIdx}>
            {measure.map((i, idx) => (
              <div
                key={idx}
                className={s.beat}
                style={{ flex: i.duration / 16 }}
              >
                {i.note ? (
                  <>
                    <div className={s.noteTitle}>
                      {i.note.aliasVesnyanka?.toUpperCase() || i.note.name}
                    </div>
                    {i.note.text && (
                      <div className={s.noteText}>{i.note.text}</div>
                    )}

                    <div
                      className={s.noteSignContainer}
                      style={{ top: getNotePosition(i.note) }}
                    >
                      <NoteIcon
                        height={42}
                        note={i.note}
                        className={classNames(
                          s.noteSign,
                          store.processedNotesIds?.[i.note._id] &&
                            s.noteSignProcessed
                        )}
                      />
                      {!store.processedNotesIds?.[i.note._id] && (
                        <MosquitoIcon className={s.mosquito} height={12} />
                      )}
                    </div>
                  </>
                ) : (
                  <div className={s.pause}>Z</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
