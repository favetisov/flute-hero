"use client";
import { compositionsList } from "@/tools/composition.list";
import s from "./CareerPage.module.css";
import { useAppStore } from "@/store/app.store";

export const CareerPage = () => {
  const appStore = useAppStore();

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

          <div className={s.speedIndicators}>
            <img
              src={"/frog/frog-speed-slow.png"}
              className={
                appStore.compositionsStatuses[composition._id]?.completedSlow &&
                s.completedImg
              }
            />
            <img src={"/frog/frog-speed-normal.png"} />
            <img src={"/frog/frog-speed-scooter.png"} />
          </div>

          <img src={"/prize.png"} className={s.prizeImg} />
        </a>
      ))}
    </div>
  );
};
