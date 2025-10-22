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
import { Speed } from "@/models/speed.enum";
import { classNames } from "@/tools/class-names";
import { HomeIcon } from "@/icons/home.icon";

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

  const renderBackgrounds = () => (
    <>
      {store.currentTool?.theme?.coverBottomCenter && (
        <div
          className={classNames(s.background, s.backgroundBottomCenter)}
          style={{
            backgroundImage: `url(${store.currentTool?.theme?.coverBottomCenter})`,
          }}
        ></div>
      )}
      {store.currentTool?.theme?.coverBottomFullWidth && (
        <div
          className={classNames(s.background, s.backgroundBottomFullWidth)}
          style={{
            backgroundImage: `url(${store.currentTool?.theme?.coverBottomFullWidth})`,
          }}
        ></div>
      )}
      {store.currentTool?.theme?.coverTopRight && (
        <div
          className={classNames(s.background, s.backgroundTopRight)}
          style={{
            backgroundImage: `url(${store.currentTool?.theme?.coverTopRight})`,
          }}
        ></div>
      )}
      {store.currentTool?.theme?.coverFullscreen && (
        <div
          className={classNames(s.background, s.backgroundFullscreen)}
          style={{
            backgroundImage: `url(${store.currentTool?.theme?.coverFullscreen})`,
          }}
        ></div>
      )}
    </>
  );

  return (
    <div className={s.compositionPage}>
      {renderBackgrounds()}

      {appStore.moneyToadPosition == composition._id && (
        <div className={s.moneyToad}>
          <Tooltip
            label={
              <div className={g.tooltip}>
                <h4>Денежная жаба!</h4>
                <div>Дополнительная награда за композицию</div>
              </div>
            }
          >
            <img src={"/frog/old-frog.png"} />
          </Tooltip>
        </div>
      )}

      <h1 className={s.header}>
        <span className={s.titleWrapper}>
          <Tooltip label={"К списку заданий"}>
            <a href="/career">
              <HomeIcon width={50} height={50} />
            </a>
          </Tooltip>
          {store.composition?.title}
        </span>

        <img src={store.composition?.cover} />
      </h1>
      <div className={s.controls}>
        <div className={s.control}>
          Скорость:
          <div className={s.speedContainer}>
            {renderCheckMark("slow")}
            <img
              src={"/frog/frog-speed-slow.png"}
              className={store.beatsPerMinute === Speed.slow ? s.selected : ""}
              onClick={() => store.setSpeed(Speed.slow)}
            />
          </div>
          <div className={s.speedContainer}>
            {renderCheckMark("normal")}
            <img
              src={"/frog/frog-speed-normal.png"}
              className={
                store.beatsPerMinute === Speed.normal ? s.selected : ""
              }
              onClick={() => store.setSpeed(Speed.normal)}
            />
          </div>
          <div className={s.speedContainer}>
            {renderCheckMark("fast")}
            <img
              src={"/frog/frog-speed-fast.png"}
              className={store.beatsPerMinute === Speed.fast ? s.selected : ""}
              onClick={() => store.setSpeed(Speed.fast)}
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
        <p className={s.pressStartMsg} onClick={store.toggleRunning}>
          Нажми на пробел чтобы начать
        </p>
      )}

      <AwardGraphicsComponent graphicsData={store.awardData} />

      {/* <img src={"/pig.png"} /> */}
    </div>
  );
};
