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

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

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

  const scrollToTopicTop = useCallback(() => {
    const target = document.getElementById("build-log-topic-top");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] max-[380px]:bottom-3 max-[380px]:right-3 md:bottom-8 md:right-8">
      <div className="build-log-reading-switch pointer-events-auto flex items-center gap-1.5 rounded-full border p-1 shadow-[0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-md md:gap-2 md:p-1.5">
        <button
          type="button"
          onClick={scrollToTopicTop}
          aria-label="Back to top of update"
          title="Back to top of update"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-offwhite transition-colors hover:border-white/30 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:h-8 md:w-8"
        >
          <svg
            className="h-3.5 w-3.5 md:h-4 md:w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="square"
            aria-hidden="true"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={lightMode}
          aria-label={lightMode ? "Switch to dark reading mode" : "Switch to light reading mode"}
          onClick={toggleLightMode}
          className={`relative h-7 w-14 shrink-0 rounded-full border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:h-8 md:w-16 ${
            lightMode
              ? "border-accent/50 bg-accent/25"
              : "border-white/20 bg-white/10"
          }`}
        >
          <MoonIcon
            className={`pointer-events-none absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-opacity duration-200 md:left-2 md:h-4 md:w-4 ${
              lightMode ? "opacity-40" : "opacity-90"
            }`}
          />
          <SunIcon
            className={`pointer-events-none absolute right-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 transition-opacity duration-200 md:right-2 md:h-4 md:w-4 ${
              lightMode ? "opacity-90" : "opacity-40"
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute top-0.5 left-0.5 z-10 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out motion-reduce:transition-none md:top-0.5 md:h-7 md:w-7 ${
              lightMode ? "translate-x-7 md:translate-x-8" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
