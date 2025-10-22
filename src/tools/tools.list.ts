import { Theme } from "@/models/theme.model";
import { Tool } from "@/models/tool.model";

export const toolsList = {
  "simple-flute": new Tool({
    _id: 1,
    icon: "/tools/simple-flute.png",
    name: "Простая флейта",
    description: "Простая деревянная флейта. Подходит для начинающих.",
    theme: new Theme({
      name: "Простая",
      background: "#fff8e2",
      color: "#5b3a00",
      border: "1px dotted rgba(0, 0, 0, 0.1)",
      noteEmptyColor: "#fff8e2",
      noteProcessedColor: "#80ad4f",
    }),
  }),
  "night-flute": new Tool({
    _id: 2,
    icon: "/tools/night-flute.png",
    name: "Флейта ночи",
    description: "Флейта звездного неба. Звучит плавно и спокойно",
    theme: new Theme({
      name: "Ночная",
      background: "#000000",
      color: "#4f81a2",
      noteEmptyColor: "#000000",
      coverFullscreen: "/wallpapers/night.jpg",
      noteFilter:
        "drop-shadow(0px 1px 3px rgba(0, 255, 0, 0.5)) drop-shadow(0px 0px 6px rgba(100, 148, 237, 0.5))",
      noteProcessedColor: "#9ddbffff",
      noteProcessedFilter:
        "drop-shadow(0px 1px 3px rgba(0, 255, 0, 0.5)) drop-shadow(0px 0px 6px rgba(100, 148, 237, 0.5))",
    }),
  }),
  "fire-flute": new Tool({
    _id: 3,
    icon: "/tools/fire-flute.png",
    name: "Огненная флейта",
    description: "Флейта пламени. Звучит ярко и энергично.",
    theme: new Theme({
      name: "Огненная",
      background: "radial-gradient(circle at bottom, #770000, #000000)",
      border: "1px solid rgba(255, 69, 0, 0.05)",
      color: "#ff6600",
      coverBottomCenter: "/wallpapers/fire.png",
      noteEmptyColor: "#770000",
      noteFilter:
        "drop-shadow(0px 1px 3px rgba(255, 69, 0, 0.5)) drop-shadow(0px 0px 6px rgba(255, 140, 0, 0.5))",
      noteProcessedColor: "#ff0000",
      noteProcessedFilter:
        "drop-shadow(0 0 1px orange) drop-shadow(0px 1px 3px rgba(252, 220, 59, 0.8)) drop-shadow(0px 0px 6px rgba(255, 17, 17, 0.8))",
    }),
  }),
  "solar-flute": new Tool({
    _id: 4,
    icon: "/tools/solar-flute.png",
    name: "Солнечная флейта",
    description: "Флейта солнечного света. Звучит тепло и радостно.",
    theme: new Theme({
      name: "Солнечная",
      background: "radial-gradient(circle at right top, #fff7d4, #00e5ffff)",
      color: "#426a1dff",
      noteEmptyColor: "#fff7d4",
      coverBottomFullWidth: "/wallpapers/grass.png",
      coverTopRight: "/wallpapers/sun.png",
      noteProcessedColor: "#fffc30ff",
      noteProcessedFilter: "drop-shadow(0px 0px 15px rgba(255, 221, 0, 1)",
    }),
  }),
  "ice-flute": new Tool({
    _id: 5,
    icon: "/tools/ice-flute.png",
    name: "Ледяная флейта",
    description: "Флейта зимнего ветра. Звучит свежо и чисто.",
    theme: new Theme({
      name: "Ледяная",
      border: "1px solid rgba(173, 216, 230, 0.5)",
      background: "linear-gradient(to bottom, #e0f7ff, #a0e0ff)",
      color: "#004466",
      noteEmptyColor: "#e0f7ff",
      coverFullscreen: "/wallpapers/snow.png",
      coverBottomCenter: "/wallpapers/hockey.png",
      noteFilter:
        "drop-shadow(0px 1px 3px rgba(173, 216, 230, 0.5)) drop-shadow(0px 0px 6px rgba(135, 206, 250, 0.5))",
      noteProcessedColor: "#a0e0ffff",
      noteProcessedFilter:
        "drop-shadow(0px 0px 1px rgba(0,0,0,1)) drop-shadow(0px 1px 3px rgba(173, 216, 230, 0.8)) drop-shadow(0px 0px 6px rgba(135, 206, 250, 0.8))",
    }),
  }),
};
