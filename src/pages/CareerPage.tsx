"use client";
import { compositionsList } from "@/tools/composition.list";
import s from "./CareerPage.module.css";
import g from "../global.module.css";
import { useAppStore } from "@/store/app.store";
import { useEffect, useState } from "react";
import { classNames } from "@/tools/class-names";
import { Tooltip } from "@/components/Tooltip/Tooltip";

export const CareerPage = () => {
  const [loaded, setLoaded] = useState(false);
  const appStore = useAppStore();
  useEffect(() => {
    appStore.loadFromLocalStorage();
    setLoaded(true);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <div className={s.page}>
      <h1>Задания для флейты</h1>
      {compositionsList.map((composition) => (
        <a
          className={s.compositionCard}
          key={composition._id}
          href={`/composition/${composition._id}`}
        >
          <img
            src={composition.cover}
            alt={composition.title}
            className={s.titleImg}
          />
          <h2>{composition.title}</h2>

          {appStore.moneyToadPosition == composition._id && (
            <Tooltip
              label={
                <div className={g.tooltip}>
                  <h4>Денежная жаба!</h4>
                  <div>Дополнительная награда за композицию</div>
                </div>
              }
            >
              <img src={"/frog/old-frog.png"} className={s.moneyToadImg} />
            </Tooltip>
          )}
          {appStore.compositionsStatuses[composition._id]?.completed.fast ? (
            <Tooltip
              label={
                <div className={g.tooltip}>
                  <h4>Приз!</h4>
                  <div>{composition.prize.name}</div>
                </div>
              }
            >
              {" "}
              <img
                src={composition.prize.icon}
                className={classNames(s.completedImg, s.prizeImg)}
              />
            </Tooltip>
          ) : (
            <img src={"/prize.png"} className={s.prizeImg} />
          )}
        </a>
      ))}
    </div>
  );
};
