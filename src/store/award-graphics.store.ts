import { Tool } from "@/models/tool.model";
import { create } from "zustand";
import { useAppStore } from "./app.store";
import { Speed } from "@/models/speed.enum";
import { Composition } from "@/models/composition.model";

const FRAME_DURATION = 1000 * 2; // продолжительность показа каждого элемента

interface Data {
  composition: Composition;
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
    moneyFirst: boolean; // нашла монетку
    moneySecond: boolean; // кладет в копилку
    moneyThird: boolean; // показываем копилку
    moneyFourth: boolean; // жаба дает монтку
    moneyFifth: boolean; // показываем копилку
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
      moneyThird: false,
      moneyFourth: false,
      moneyFifth: false,
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

      const showState = (stateKey: string) => {
        const newState = {};
        for (const key in get().showState) {
          newState[key] = stateKey == key;
        }
        set({ showState: newState });
      };

      let currentTimeout = 0;

      // принимаем входные параметры и начинаем управляеть
      if (!data.completed) {
        showState("calculator");
        setTimeout(() => {
          get().showState.calculator = false;
          set({ showState: get().showState });
        }, 5000);
      } else {
        showState("like");
        currentTimeout += FRAME_DURATION;
        console.log(currentTimeout, "currentTimeout");
        setTimeout(() => {
          showState("moneyFirst");

          useAppStore.getState().addMoney(1);
        }, currentTimeout);

        currentTimeout += FRAME_DURATION / 1.5;
        setTimeout(() => {
          showState("moneySecond");
        }, currentTimeout);

        currentTimeout += FRAME_DURATION / 1.5;
        setTimeout(() => {
          console.log("m3");
          showState("moneyThird");
        }, currentTimeout);

        if (
          useAppStore.getState().moneyToadPosition ==
          get().data!.composition._id
        ) {
          currentTimeout += FRAME_DURATION;
          setTimeout(() => {
            showState("moneyFourth");
            const appState = useAppStore.getState();
            appState.addMoney(1);
            appState.relocateMoneyToad(get().data!.composition._id);
          }, currentTimeout);

          currentTimeout += FRAME_DURATION;
          setTimeout(() => {
            showState("moneyFifth");
          }, currentTimeout);
        }

        currentTimeout += FRAME_DURATION; // держим подольше изображение копилки
      }

      if (data.speedCompletedFirstTime) {
        currentTimeout += FRAME_DURATION;
        setTimeout(() => {
          showState("speedCheckmark");
        }, currentTimeout);
      }

      if (
        data.speedCompletedFirstTime &&
        data.speed == Speed.fast &&
        data.tool
      ) {
        currentTimeout += FRAME_DURATION;
        setTimeout(() => {
          showState("prizeFirst");
        }, currentTimeout);

        currentTimeout += FRAME_DURATION;
        setTimeout(() => {
          showState("prizeSecond");
        }, currentTimeout);

        currentTimeout += FRAME_DURATION;
        setTimeout(() => {
          showState("prizeThird");
          // добавляем к инвентарю новый инструмент
          const appState = useAppStore.getState();
          appState.addToolToInventory(data.tool!);
        }, currentTimeout);
        currentTimeout += FRAME_DURATION * 2; // держим подольше
      }

      setTimeout(() => {
        // сбрасываем всё состояние
        console.log("ok");
        showState("");
        set({ data: undefined });
      }, currentTimeout + FRAME_DURATION);
    },
  };
});
