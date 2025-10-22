import { create } from "zustand";
import { Tool } from "@/models/tool.model";
import { toolsList } from "@/tools/tools.list";
import { compositionsList } from "@/tools/composition.list";
import { Speed } from "@/models/speed.enum";
import { random } from "lodash";

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
  addToolToInventory: (tool: Tool) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  addMoney: (amount: number) => void;
  completeComposition: (compositionId: number, speed: string) => void;
  moneyToadPosition?: number;
  relocateMoneyToad: (idToExclude: number) => void;
}

export const useAppStore = create<AppState>((set, get) => {
  const generateRandomToadPosition = () => {
    let position = random(1, compositionsList.length);
    return position;
  };

  return {
    money: 0,
    compositionsStatuses: {},
    inventory: [toolsList["simple-flute"]], // по умолчанию в инвентаре есть простая флейта
    currentTool: toolsList["simple-flute"],
    moneyToadPosition: generateRandomToadPosition(),

    addToolToInventory: (tool: Tool) => {
      const inventory = get().inventory;
      if (!inventory.find((item) => item._id === tool._id)) {
        inventory.push(tool);
        set({ inventory });
        get().saveToLocalStorage();
      }
    },

    addMoney: (amount: number) => {
      const newAmount = get().money + amount;
      set({ money: newAmount });
      get().saveToLocalStorage();
    },

    completeComposition: (compositionId: number, speed: string) => {
      const compositionsStatuses = get().compositionsStatuses;
      if (
        compositionsStatuses[compositionId] &&
        !compositionsStatuses[compositionId].completed[speed]
      ) {
        compositionsStatuses[compositionId].completed[speed] = true;
        set({ compositionsStatuses });
        get().saveToLocalStorage();
      }
    },

    saveToLocalStorage: () => {
      const state = get();
      const data = {
        money: state.money,
        compositionsStatuses: state.compositionsStatuses,
        inventory: state.inventory.map((item) => item._id), // сохраняем только коды инструментов
        moneyToadPosition: state.moneyToadPosition,
      };
      localStorage.setItem("appState", JSON.stringify(data));
    },

    loadFromLocalStorage: () => {
      const dataString = localStorage.getItem("appState");

      get().compositionsStatuses = compositionsList.reduce(
        (acc, composition) => {
          acc[composition._id] = {
            currentBpm: Speed.slow,
            currentToolId: get().inventory[0]._id,
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
        const inventoryItems = Object.values(toolsList).filter((tool) =>
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

        get().money = data.money || 0;
        get().inventory = inventoryItems;
        get().moneyToadPosition =
          data.moneyToadPosition || get().moneyToadPosition;

        set({
          money: get().money,
          compositionsStatuses: get().compositionsStatuses,
          inventory: get().inventory,
        });
      }
    },
    relocateMoneyToad: (idToExclude: number) => {
      let random = generateRandomToadPosition();
      while (random === idToExclude) {
        random = generateRandomToadPosition();
      }

      set({ moneyToadPosition: random });
      get().saveToLocalStorage();
    },
  };
});
