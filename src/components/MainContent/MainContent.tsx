"use client";

import { useAppStore } from "@/store/app.store";
import { useEffect } from "react";

export const MainContent = ({ children }: { children: React.ReactNode }) => {
  const appStore = useAppStore();

  useEffect(() => {
    appStore.loadFromLocalStorage();
  }, []);

  return <main>{children}</main>;
};
