// import { registerClientVisit } from "./client-script";
import { App } from "./componentry/App";
import { isNonZeroString } from "./functions";
import { createRoot } from "react-dom/client";

const modules = new Map();
modules.set("my-module", { data: { version: "2.0.0" } });

class MockGame {
  version = "9.261";
  system = {
    data: {
      version: "1.0.0",
      name: "my-system",
    },
  };

  modules = modules;
}

declare global {
  interface Window {
    game: MockGame;
    Game: typeof MockGame;
  }
}

window.game = new MockGame();
window.Game = MockGame;

const urlVar = import.meta.env.VITE_COUNTER_URL;

if (!isNonZeroString(urlVar)) {
  throw new Error("VITE_COUNTER_URL is not defined");
}

const urls = [urlVar, ...import.meta.env.VITE_EXTRA_COUNTER_URLS?.split(",")];

const appDiv = document.querySelector<HTMLDivElement>("#app");
if (appDiv) {
  const root = createRoot(appDiv);
  root.render(<App urls={urls} />);
} else {
  console.error("No app div found");
}
