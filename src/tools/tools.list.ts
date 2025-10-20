import { Theme } from "@/models/theme.model";
import { Tool } from "@/models/tool.model";

export const toolsList = [
  new Tool({
    _id: 1,
    icon: "/tools/simple-flute.png",
    name: "Простая флейта",
    description: "Простая деревянная флейта. Подходит для начинающих.",
    theme: new Theme({
      name: "Простая",
      background: "#fff8e2",
      color: "#5b3a00",
      cover: "/themes/simple-theme-cover.png",
      border: "1px dotted rgba(0, 0, 0, 0.1)",
    }),
  }),
  new Tool({
    _id: 2,
    icon: "/tools/night-flute.png",
    name: "Флейта ночи",
    description: "Флейта звездного неба. Звучит плавно и спокойно",
    theme: new Theme({
      name: "Ночная",
      background: "#000000",
      color: "#4f81a2",
      cover: "/wallpapers/night.jpg",
      noteFilter:
        "drop-shadow(0px 1px 3px rgba(0, 255, 0, 0.5)) drop-shadow(0px 0px 6px rgba(100, 148, 237, 0.5))",
      noteProcessedColor: "#9ddbffff",
      noteProcessedFilter:
        "drop-shadow(0px 1px 3px rgba(0, 255, 0, 0.5)) drop-shadow(0px 0px 6px rgba(100, 148, 237, 0.5))",
    }),
  }),
  // new Tool({
  //   _id: 3,
  //   icon: "/tools/fire-flute.png",
  //   name: "Флейта огня",
  //   description: "Флейта, выкованная в пламени дракона. Звучит громче и ярче.",
  //   theme: new Theme({
  //     name: "Огненная",
  //     background: "#000000",
  //     color: "#fff3f3aa",
  //     cover: "/wallpapers/fire.jpg",
  //     border: "1px dotted rgba(0, 0, 0, 0.1)",
  //     noteFilter:
  //       "drop-shadow(0px 1px 3px rgba(255, 166, 0, 0.5)) drop-shadow(1px 1px 3px rgba(255, 0, 0, 0.5))",
  //   }),
  // }),
];
