import { create } from "zustand";
import { Tool } from "@/models/tool.model";
import { toolsList } from "@/tools/tools.list";
import { compositionsList } from "@/tools/composition.list";
import { Speed } from "@/models/speed.enum";

interface AppState {
  money: number;
  compositionsStatuses: {
    [_id: number]: {
      currentBpm: number;
      currentToolId: number;
      completed: {
        slow: boolean;
        normal: boolean;
        fast: boolean;
      };
    };
  };
  inventory: Array<Tool>; // список купленных инструментов
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

export const useAppStore = create<AppState>((set, get) => {
  return {
    money: 0,
    compositionsStatuses: {},
    inventory: [toolsList[0], toolsList[1]], // по умолчанию в инвентаре есть простая флейта
    currentTool: toolsList[0],

    saveToLocalStorage: () => {
      const state = get();
      const data = {
        money: state.money,
        compositionsStatuses: state.compositionsStatuses,
        inventory: state.inventory.map((item) => item._id), // сохраняем только коды инструментов
      };
      localStorage.setItem("appState", JSON.stringify(data));
    },

    loadFromLocalStorage: () => {
      const dataString = localStorage.getItem("appState");

      get().compositionsStatuses = compositionsList.reduce(
        (acc, composition) => {
          acc[composition._id] = {
            currentBpm: Speed.slow,
            currentToolId: toolsList[0]._id,
            completed: {
              slow: false,
              normal: false,
              fast: false,
            },
          };
          return acc;
        },
        {} as AppState["compositionsStatuses"]
      );

      if (dataString) {
        const data = JSON.parse(dataString);
        const inventoryItems = toolsList.filter((tool) =>
          data.inventory.includes(tool._id)
        );

        for (const compositionId in data.compositionsStatuses) {
          if (!data.compositionsStatuses.hasOwnProperty(compositionId))
            continue;
          Object.assign(
            get().compositionsStatuses[compositionId],
            data.compositionsStatuses[compositionId]
          );
        }

        set({
          money: data.money || 0,
          compositionsStatuses: get().compositionsStatuses,
          inventory: inventoryItems,
        });
      }
    },
  };
});
