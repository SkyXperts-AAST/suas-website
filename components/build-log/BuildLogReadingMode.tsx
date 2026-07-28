"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "build-log-reading-mode";

type BuildLogReadingContextValue = {
  lightMode: boolean;
  toggleLightMode: () => void;
};

const BuildLogReadingContext = createContext<BuildLogReadingContextValue | null>(
  null,
);

export function useBuildLogReadingMode() {
  const context = useContext(BuildLogReadingContext);
  if (!context) {
    throw new Error("useBuildLogReadingMode must be used within BuildLogReadingProvider");
  }
  return context;
}

export function BuildLogReadingProvider({ children }: { children: ReactNode }) {
  const [lightMode, setLightMode] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setLightMode(window.localStorage.getItem(STORAGE_KEY) === "light");
    } catch {
      setLightMode(false);
    }
    setReady(true);
  }, []);

  const toggleLightMode = useCallback(() => {
    setLightMode((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "light" : "default");
      } catch {
        // Ignore storage failures — mode still toggles for this session.
      }
      return next;
    });
  }, []);

  return (
    <BuildLogReadingContext.Provider value={{ lightMode, toggleLightMode }}>
      <div
        className="build-log-reading min-h-full"
        data-reading-mode={ready && lightMode ? "light" : "default"}
      >
        {children}
      </div>
    </BuildLogReadingContext.Provider>
  );
}

export function BuildLogReadingSwitch() {
  const { lightMode, toggleLightMode } = useBuildLogReadingMode();

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] max-[380px]:bottom-3 max-[380px]:right-3 md:bottom-8 md:right-8">
      <div className="build-log-reading-switch pointer-events-auto flex items-center gap-2 rounded-full border px-2.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-md md:gap-3 md:px-4 md:py-2.5">
        <span className="select-none font-sans text-[0.5625rem] font-bold uppercase tracking-[0.12em] md:text-xs md:tracking-[0.14em]">
          Light
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={lightMode}
          aria-label="Toggle light reading mode"
          onClick={toggleLightMode}
          className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:h-7 md:w-12 ${
            lightMode
              ? "border-accent/50 bg-accent/25"
              : "border-white/20 bg-white/10"
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none md:h-5 md:w-5 ${
              lightMode ? "translate-x-4 md:translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
