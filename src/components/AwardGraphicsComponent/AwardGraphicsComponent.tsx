import { CheckIcon } from "@/icons/check.icon";
import s from "./AwardGraphicsComponent.module.css";
import { useAwardGraphicsStore } from "@/store/award-graphics.store";
import { useEffect } from "react";

export const AwardGraphicsComponent = ({ graphicsData }) => {
  const store = useAwardGraphicsStore();

  useEffect(() => {
    store.initialize(graphicsData);
  }, [graphicsData]);

  const hasShowingState = Object.values(store.showState).some((v) => v);
  if (!hasShowingState) {
    return null;
  }

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
      {store.showState.speedCheckmark && (
        <>
          <CheckIcon
            height={50}
            color="limegreen"
            className={s.checkmarkIcon}
          />
          <img src={"/frog/frog-speed-checkmark.png"} className={s.mainImg} />
        </>
      )}
      {store.showState.prizeFirst && (
        <img src={`/frog-celebrate.png`} className={s.mainImg} />
      )}
      {store.showState.prizeSecond && (
        <img src={`prize.png}`} className={s.mainImg} />
      )}
      {store.showState.prizeThird && (
        <img src={store.data.tool.icon} className={s.mainImg} />
      )}
    </div>
  );
};
