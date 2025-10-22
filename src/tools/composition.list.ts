import { Composition } from "@/models/composition.model";
import { toolsList } from "./tools.list";

export const compositionsList = [
  new Composition(
    {
      _id: 1,
      title: "Спать пора",
      cover: "/frog/frog-sleeping.png",
      clefStr: "C5",
      prize: toolsList["night-flute"],
    },
    `
       E5_4_СПАТЬ E5_4_ПО G5_2_РА
       E5_4_СПАТЬ E5_4_ПО G5_2_РА
       E5_4_ВСЕ E5_4_УС G5_4_НУ G5_4_ЛИ
       E5_4_ДО E5_4_УТ G5_2_РА 
           `
  ),
  new Composition(
    {
      _id: 2,
      title: "Тук-тук молотком",
      cover: "/frog/frog-building.png",
      clefStr: "C5",
      prize: toolsList["fire-flute"],
    },
    `
    G5_2 E5_2 
    G5_4 G5_4 E5_2  
    G5_4 G5_4 E5_4 E5_4 
    G5_4 G5_4 E5_2    
    `
  ),
  new Composition(
    {
      _id: 3,
      title: "Петушок",
      cover: "/frog/frog-rooster.png",
      clefStr: "C5",
      prize: toolsList["solar-flute"],
    },
    `
    A5_4_ПЕ A5_4_ТУ G5_2_ШОК
    A5_4_ПЕ A5_4_ТУ E5_2_ШОК
    A5_4_ЗО A5_4_ЛО G5_2_ТОЙ
    A5_4_ГРЕ A5_4_БЕ E5_2_ШОК
    `
  ),

  new Composition(
    {
      _id: 4,
      title: "Мажорный звукоряд",
      cover: "/frog/frog-happy.png",
      clefStr: "C5",
      prize: toolsList["ice-flute"],
    },
    `
    E5_4 F5_4 G5_4 A5_4 
    A5_4 G5_4 F5_4 E5_4
    `
  ),
];
