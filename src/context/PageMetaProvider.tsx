"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface PageMeta {
  title: string;
  subtitle: string;
}

interface PageMetaContextValue {
  meta: PageMeta;
  setMeta: (meta: PageMeta) => void;
}

const PageMetaContext = createContext<PageMetaContextValue | null>(null);

const defaultMeta: PageMeta = {
  title: "لوحة التحكم",
  subtitle: "الهوية المالية الموحدة",
};

export function PageMetaProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<PageMeta>(defaultMeta);

  return (
    <PageMetaContext.Provider value={{ meta, setMeta }}>
      {children}
    </PageMetaContext.Provider>
  );
}

export function usePageMeta() {
  const ctx = useContext(PageMetaContext);
  if (!ctx) throw new Error("usePageMeta must be used within PageMetaProvider");
  return ctx;
}

export function useSetPageMeta(meta: PageMeta) {
  const { setMeta } = usePageMeta();
  const { title, subtitle } = meta;

  useEffect(() => {
    setMeta({ title, subtitle });
  }, [title, subtitle, setMeta]);
}
