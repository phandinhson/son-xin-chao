"use client";
import { createContext, useContext } from "react";

export type SiteSettings = Record<string, string>;

const SettingsContext = createContext<SiteSettings>({});

export function SettingsProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: SiteSettings;
}) {
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

/** Use this instead of fetch("/api/settings") in any client component */
export function useSettings(): SiteSettings {
  return useContext(SettingsContext);
}
