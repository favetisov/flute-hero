import { CheckIcon } from "@/icons/check.icon";
import s from "./AwardGraphicsComponent.module.css";
import { useAwardGraphicsStore } from "@/store/award-graphics.store";
import { useEffect } from "react";
import { Speed } from "@/models/speed.enum";
import { toolsList } from "@/tools/tools.list";
import { useAppStore } from "@/store/app.store";

export const AwardGraphicsComponent = ({ graphicsData }) => {
  const store = useAwardGraphicsStore();
  const appStore = useAppStore();

  useEffect(() => {
    console.log(graphicsData);
    store.initialize(graphicsData);
  }, [graphicsData]);

  const hasShowingState = Object.values(store.showState).some((v) => v);
  if (!hasShowingState) {
    return null;
  }

  const speedName = (() => {
    switch (store.data?.speed) {
      case Speed.slow:
        return "slow";
      case Speed.normal:
        return "normal";
      case Speed.fast:
        return "fast";
    }
    return "normal";
  })();

  return (
    <div className={s.awardModal}>
      {store.showState.calculator && (
        <img src={"/frog/frog-calculator.png"} className={s.mainImg} />
      )}
      {store.showState.like && (
        <img src={"/frog/frog-like.png"} className={s.mainImg} />
      )}
      {store.showState.moneyFirst && (
        <img src={"/frog/frog-coin.png"} className={s.mainImg} />
      )}
      {store.showState.moneySecond && (
        <img src={"/frog/frog-puts-coin.png"} className={s.mainImg} />
      )}
      {(store.showState.moneyThird || store.showState.moneyFifth) && (
        <div className={s.moneyContainer}>
          <img src={"/pig.png"} className={s.mainImg} />
          <div className={s.coin}>{appStore.money}</div>
        </div>
      )}
      {store.showState.moneyFourth && (
        <img src={"/frog/old-frog-gives-money.png"} className={s.mainImg} />
      )}

      {store.showState.speedCheckmark && (
        <>
          <CheckIcon height={80} color="limegreen" className={s.checkIcon} />
          <img
            src={`/frog/frog-speed-${speedName}.png`}
            className={s.mainImg}
          />
        </>
      )}
      {store.showState.prizeFirst && (
        <img src={`/frog/frog-celebrate.png`} className={s.mainImg} />
      )}
      {store.showState.prizeSecond && (
        <img src={`/prize.png`} className={s.mainImg} />
      )}

      {store.showState.prizeThird && (
        <div className={s.prizeCard}>
          <h2>Получен приз</h2>
          <img src={store.data?.tool.icon} className={s.mainImg} />
          <div className={s.prizeName}>{store.data?.tool.name}</div>
        </div>
      )}
    </div>
  );
};
