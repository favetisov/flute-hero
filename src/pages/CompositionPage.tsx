"use client";
import { useCompositionStore } from "@/store/composition.store";
import { useEffect } from "react";
import { Composition } from "@/models/composition.model";
import { compositionsList } from "@/tools/composition.list";
import s from "./CompositionPage.module.css";
import { useAppStore } from "@/store/app.store";
import { StaveComponent } from "@/components/StaveComponent/StaveComponent";
import { Tooltip } from "@/components/Tooltip/Tooltip";
import g from "../global.module.css";
import { CheckIcon } from "@/icons/check.icon";
import { AwardGraphicsComponent } from "@/components/AwardGraphicsComponent/AwardGraphicsComponent";

export const CompositionPage = ({ compositionId }) => {
  const store = useCompositionStore();
  const appStore = useAppStore();
  const composition = compositionsList.find(
    (c) => c._id == compositionId
  ) as Composition;

  useEffect(() => {
    store.initialize(composition);
  }, [compositionId]);

  // слушаем микрофон
  useEffect(() => {
    store.startListening();
    return () => {
      store.stopListening();
    };
  }, [compositionId]);

  // вешаем запуск/остановку проигрывания по нажатию на space
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        store.toggleRunning();
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  if (!store.composition) {
    return;
  }

  const renderCheckMark = (speed: string) => {
    if (
      appStore.compositionsStatuses[store.composition?._id]?.completed[speed]
    ) {
      return (
        <CheckIcon
          height={18}
          color="limegreen"
          className={s.speedCompletedIcon}
        />
      );
    }
    return null;
  };

  return (
    <div className={s.compositionPage}>
      <div
        className={s.background}
        style={{ backgroundImage: `url(${store.currentTool?.theme?.cover})` }}
      ></div>
      <h1 className={s.header}>
        {store.composition?.title}
        <img src={store.composition?.cover} />
      </h1>
      <div className={s.controls}>
        <div className={s.control}>
          Скорость:
          <div className={s.speedContainer}>
            {renderCheckMark("slow")}
            <img
              src={"/frog/frog-speed-slow.png"}
              className={store.beatsPerMinute === 40 ? s.selected : ""}
              onClick={() => store.setSpeed(40)}
            />
          </div>
          <div className={s.speedContainer}>
            {renderCheckMark("normal")}
            <img
              src={"/frog/frog-speed-normal.png"}
              className={store.beatsPerMinute === 60 ? s.selected : ""}
              onClick={() => store.setSpeed(60)}
            />
          </div>
          <div className={s.speedContainer}>
            {renderCheckMark("fast")}
            <img
              src={"/frog/frog-speed-fast.png"}
              className={store.beatsPerMinute === 80 ? s.selected : ""}
              onClick={() => store.setSpeed(80)}
            />
          </div>
        </div>
        <div className={s.control}>
          Инструмент:
          {appStore.inventory.map((tool) => (
            <Tooltip
              key={tool._id}
              label={
                <div className={g.tooltip}>
                  <h4>{tool.name}</h4>
                  {tool.description}
                </div>
              }
            >
              <img
                key={tool._id}
                src={tool.icon}
                className={
                  store.currentTool?._id === tool._id ? s.selected : ""
                }
                onClick={() => store.selectTool(tool)}
              />
            </Tooltip>
          ))}
        </div>
      </div>

      <div className={s.staveWrapper}>
        <StaveComponent composition={store.composition} />
      </div>

      {!store.running && (
        <p className={s.pressStartMsg}>Нажми на пробел чтобы начать</p>
      )}

      <AwardGraphicsComponent graphicsData={store.currentShowingGraphics} />
    </div>
  );
};
