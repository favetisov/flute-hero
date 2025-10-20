"use client";
import { useAppStore } from "@/store/app.store";
import s from "./MainPage.module.css";
import { MosquitoIcon } from "@/icons/mosquito.icon";
export const MainPage = () => {
  return (
    <div>
      <div className={s.welcome}>
        <div style={{ fontSize: 50 }}>Привет!</div>
        <img src={"/frog/frog-dancing.png"} />
        <div>Это Фиона. Она - лягушка</div>
        <div> Фиона любит играть, танцевать, и прыгать!</div>

        <div>Еще она очень любит есть комариков</div>
        <img src={"/frog/frog-hunting1.png"} style={{ height: 130 }} />

        <div style={{ marginTop: 40 }}></div>
        <div>А еще Фиона очень любит, когда играет флейта</div>
        <div>Честно говоря, она даже сама учится играть</div>
        <img src={"/frog/frog-flute.png"} />

        <div>Доставай свою блокфлейту и помоги Фионе пройти все задания</div>

        <a className={s.buttonWrapper} href="/career">
          <button className={s.startButton}>
            <MosquitoIcon height={18} style={{ marginTop: -3 }} />
            Начать
            <MosquitoIcon height={18} style={{ marginTop: -3 }} />
          </button>
        </a>
      </div>
    </div>
  );
};
