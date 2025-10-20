import { Tool } from "@/models/tool.model";
import { create } from "zustand";
import { useAppStore } from "./app.store";

const FRAME_DURATION = 1000 * 2; // продолжительность показа каждого элемента

interface Data {
  completed: boolean;
  speedCompletedFirstTime?: boolean;
  wholeCompletedFirstTime?: boolean;
  speed?: number;
  tool?: Tool;
  totalNotes?: number;
  processedNotes?: number;
}

export interface AwardGrapnicsState {
  initialize: (data) => void;
  data?: Data;
  showState: {
    calculator: boolean;
    like: boolean;
    moneyFirst: boolean;
    moneySecond: boolean;
    speedCheckmark: boolean;
    prizeFirst: boolean;
    prizeSecond: boolean;
    prizeThird: boolean;
  };
}

export const useAwardGraphicsStore = create<AwardGrapnicsState>((set, get) => {
  return {
    showState: {
      calculator: false,
      like: false,
      moneyFirst: false,
      moneySecond: false,
      speedCheckmark: false,
      prizeFirst: false,
      prizeSecond: false,
      prizeThird: false,
    },
    initialize: (data: Data) => {
      get().data = data;
      if (!data) {
        return;
      }
      // принимаем входные параметры и начинаем управляеть
      if (!data.completed) {
        get().showState.calculator = true;
        set({ showState: get().showState });
        setTimeout(() => {
          get().showState.calculator = false;
          set({ showState: get().showState });
        }, 5000);
      } else {
        get().showState.like = true;
        set({ showState: get().showState });
        setTimeout(() => {
          get().showState.like = false;
          get().showState.moneyFirst = true;
          set({ showState: get().showState });
        }, FRAME_DURATION);
        setTimeout(() => {
          get().showState.moneyFirst = false;
          get().showState.moneySecond = true;
          set({ showState: get().showState });
        }, FRAME_DURATION * 2);
      }

      if (data.speedCompletedFirstTime) {
        setTimeout(() => {
          get().showState.moneySecond = false;
          get().showState.speedCheckmark = true;
          set({ showState: get().showState });
        }, FRAME_DURATION * 3);
      }

      if (data.wholeCompletedFirstTime) {
        setTimeout(() => {
          get().showState.speedCheckmark = false;
          get().showState.prizeFirst = true;
          set({ showState: get().showState });
        }, FRAME_DURATION * 4);
        setTimeout(() => {
          get().showState.prizeFirst = false;
          get().showState.prizeSecond = true;
          set({ showState: get().showState });
        }, FRAME_DURATION * 5);
        setTimeout(() => {
          get().showState.prizeSecond = false;
          get().showState.prizeThird = true;
          set({ showState: get().showState });

          // добавляем к инвентарю новый инструмент
          const appState = useAppStore.getState();
          appState.inventory.push(data.tool!);
          appState.saveToLocalStorage();
        }, FRAME_DURATION * 6);
      }
    },
  };
});
