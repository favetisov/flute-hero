import { Composition } from "@/models/composition.model";
import { Note } from "@/models/note.model";
import { create } from "zustand";
import { minBy, debounce } from "lodash";
import { noteByFrequency } from "@/tools/note-by-frequency";
import { toolsList } from "@/tools/tools.list";
import { Tool } from "@/models/tool.model";
import { isServerSide } from "@/tools/is-server-side";
import { useAppStore } from "./app.store";
import { Speed } from "@/models/speed.enum";

const INITIAL_BEAT = 0;

interface CompositionState {
  composition?: Composition;
  setComposition: (composition: Composition) => void;
  running: boolean;
  currentBeat: number;
  currentNote: Note | null;
  curentNoteTillBeat: number;
  toggleRunning: () => void;
  intervalId?: any;
  beatsPerMinute?: number;
  setSpeed?: (bpm: number) => void;

  listeningInitialized: boolean;
  listeningIsRunning: boolean;
  startListening: () => void;
  stopListening: () => void;

  currentPlayedNote: Note | null; // нота, которая играется прямо сейчас
  lastPlayedNote?: Note; // последняя сыгранная нота (для отображения)

  processedNotesIds?: { [id: number]: true }; // для подсветки успешно сыгранных нот
  metronomeEnabled?: boolean;
  toggleMetronome?: () => void;

  displayingAward?: string; // показываем награду в конце песни

  currentTool?: Tool;
  selectTool?: (tool: Tool) => void;

  initialize: (composition: Composition) => Promise<void>;

  currentShowingGraphics?: any; // в конце композиции отображаем графику с наградами и проч
}

export const useCompositionStore = create<CompositionState>((set, get) => {
  let stream: MediaStream; // аудио поток с микрофона
  let audioContext: AudioContext; // аудио контекст
  let microphone: MediaStreamAudioSourceNode; // микрофонный вход
  let detector; // детектор pitchfinder
  let processor; // процессор для обработки данных

  const debounceErasePlayedNote = debounce(() => {
    set({ currentPlayedNote: null });
  }, 250);

  const stopRunning = () => {
    clearInterval(get().intervalId);
    set({
      running: false,
      currentNote: null,
      curentNoteTillBeat: -1,
      currentBeat: INITIAL_BEAT,
      processedNotesIds: {},
    });
  };

  const playMetronomeClick = () => {
    // думаем как реализовать
  };

  const processCompositionResults = () => {
    const totalNotes = get().composition.notes.filter((n) => n).length;
    const processedNotes = Object.keys(get().processedNotesIds).length;

    const as = useAppStore.getState();
    const compositionData = as.compositionsStatuses[get().composition?._id];

    if (processedNotes < totalNotes) {
      return {
        completed: false,
        totalNotes,
        processedNotes,
      };
    } else {
      // текущая скорость пройдена первый раз
      const speedCompletedFirstTime =
        !compositionData.completed[get().beatsPerMinute];

      // впервые пройдены все скорости
      const wholeCompletedFirstTime =
        speedCompletedFirstTime &&
        !Object.values(Speed).some(
          (speed) =>
            speed != get().beatsPerMinute && !compositionData.completed[speed]
        );

      return {
        completed: true,
        speedCompletedFirstTime,
        wholeCompletedFirstTime,
        speed: get().beatsPerMinute,
      };
    }
  };

  const startRunning = () => {
    get().currentBeat = INITIAL_BEAT;
    get().processedNotesIds = {};
    const shiftBeat = () => {
      get().currentBeat = get().currentBeat + 1;

      if (get().metronomeEnabled && get().currentBeat % 4 === 0) {
        playMetronomeClick();
      }

      // если песня закончилась - тормозим (к длине песни добавляем паузу в 1 такт)
      if (get().currentBeat >= get().composition.notes?.length + 16) {
        clearInterval(get().intervalId);

        // считаем количество съеденных комариков. Если есть пропущенные - показываем количество съеденных и

        set({
          running: false,
          displayingAward:
            Object.keys(get().processedNotesIds).length ==
            get().composition.notes.filter((n) => n).length
              ? "frog-celebrate"
              : "frog-happy",
        });
      } else {
        set({
          currentBeat: get().currentBeat,
        });

        if (get().curentNoteTillBeat < get().currentBeat) {
          // смотрим, какая нота сейчас должна играться
          const note = get().composition.notes[get().currentBeat];
          if (note) {
            set({
              currentNote: note,
              curentNoteTillBeat: get().currentBeat - 1 + note.duration,
            });
          } else {
            set({
              currentNote: null,
            });
          }

          // todo temp. временно сразу обрабатываем ноту как сыгранную
          if (note) {
            set({
              processedNotesIds: {
                ...get().processedNotesIds,
                [note._id]: true,
              },
            });
          }
        }
      }
    };
    get().intervalId = setInterval(
      shiftBeat,
      60000 / (get().beatsPerMinute * 4)
    );
    shiftBeat();
    set({ running: true });
  };

  const guessNote = (frequency: number): Note | void => {
    const nearestNote = minBy(Object.keys(noteByFrequency), (noteFreq) =>
      Math.abs(parseFloat(noteFreq) - frequency)
    );
    return new Note(noteByFrequency[nearestNote]);
  };

  return {
    composition: null,
    running: false,
    currentBeat: INITIAL_BEAT,
    currentNote: null,
    curentNoteTillBeat: -1,
    beatsPerMinute: Speed.slow,
    listeningInitialized: false,
    listeningIsRunning: false,
    currentPlayedNote: null,
    lastPlayedNote: null,
    processedNotesIds: {},
    metronomeEnabled: true,
    displayingAward: null,
    currentTool: toolsList[0],

    initialize: async (composition: Composition) => {
      if (isServerSide()) {
        get().composition = null; // временно отключаем рендеринг на сервере. надо будет разобраться с работой с LS
        return;
      }
      if (!isServerSide() && get().composition?._id == composition._id) {
        return;
      }

      if (!isServerSide()) {
        get().composition = composition;
        set({ composition });

        // на клиенте пробуем восстановить состояние из локального хранилища
        const as = useAppStore.getState();
        // на всякий случай загружаем состояние приложения
        await as.loadFromLocalStorage();
        console.log(as.compositionsStatuses[composition._id], "com sta");

        get().beatsPerMinute =
          as.compositionsStatuses[composition._id]?.currentBpm || Speed.slow;
        const toolId = as.compositionsStatuses[composition._id]?.currentToolId;
        if (toolId) {
          const tool = as.inventory.find((t) => t._id === toolId);
          if (tool) {
            get().currentTool = tool;
            get().selectTool(tool);
          }
        }
      }
    },

    toggleMetronome: () => {
      set({ metronomeEnabled: !get().metronomeEnabled });
    },

    toggleRunning: () => {
      if (!get().running) {
        startRunning();
      } else {
        stopRunning();
      }
    },

    setSpeed: (bpm: number) => {
      stopRunning();

      const as = useAppStore.getState();
      as.compositionsStatuses[get().composition._id].currentBpm = bpm;
      as.saveToLocalStorage();

      set({ beatsPerMinute: bpm });
    },

    setComposition: (composition: Composition) => {
      set({
        composition,
        currentBeat: INITIAL_BEAT,
        currentNote: null,
        curentNoteTillBeat: -1,
      });
    },

    startListening: async () => {
      if (get().listeningIsRunning) return; // уже запущено
      if (!get().listeningInitialized) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
          video: false,
        });
        audioContext = new AudioContext();
        microphone = audioContext.createMediaStreamSource(stream);
        const { YIN } = await import("pitchfinder");
        detector = YIN({
          sampleRate: audioContext.sampleRate,
          probabilityThreshold: 0.9, // Минимальная уверенность
          threshold: 0.01, // Чувствительность алгоритма
        });
        processor = audioContext.createScriptProcessor(4096, 1, 1);
        processor.onaudioprocess = (event) => {
          if (!get().listeningIsRunning) return;
          const inputData = event.inputBuffer.getChannelData(0);
          const frequency = detector(inputData);
          if (frequency > 200 && frequency < 1100) {
            const note = guessNote(frequency);
            if (note) {
              set({ currentPlayedNote: note, lastPlayedNote: note });
              debounceErasePlayedNote(); // держим ноту в течении 250мс после последнего срабатывания
              if (
                note.name === get().currentNote?.name &&
                note.octave === get().currentNote?.octave &&
                get().currentBeat < get().curentNoteTillBeat
              ) {
                // нота угадана верно
                set({
                  processedNotesIds: {
                    ...get().processedNotesIds,
                    [get().currentNote._id]: true,
                  },
                });
              }
            }
          }
        };
        microphone.connect(processor);
        processor.connect(audioContext.destination);
        set({ listeningInitialized: true });
      }
      audioContext.resume();
      set({ listeningIsRunning: true });
    },

    stopListening: () => {
      if (!get().listeningIsRunning) return; // уже остановлено
      audioContext.suspend();
      set({ listeningIsRunning: false, currentNote: null });
    },

    selectTool: (tool: Tool) => {
      set({ currentTool: tool });

      const as = useAppStore.getState();
      as.compositionsStatuses[get().composition._id].currentToolId = tool._id;
      as.saveToLocalStorage();

      if (tool.theme) {
        document.documentElement.style.setProperty(
          "--background-color",
          tool.theme.background
        );
        document.documentElement.style.setProperty(
          "--foreground",
          tool.theme.color
        );
        document.documentElement.style.setProperty(
          "--border",
          tool.theme.border
        );
        document.documentElement.style.setProperty(
          "--note-color",
          tool.theme.noteColor
        );
        document.documentElement.style.setProperty(
          "--note-filter",
          tool.theme.noteFilter
        );
        document.documentElement.style.setProperty(
          "--note-processed-color",
          tool.theme.noteProcessedColor
        );
        document.documentElement.style.setProperty(
          "--note-processed-filter",
          tool.theme.noteProcessedFilter
        );
      }
    },
  };
});
