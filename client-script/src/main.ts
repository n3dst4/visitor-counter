/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import "./style.css";
// import typescriptLogo from "./typescript.svg";
import { registerClientVisit } from "./client-script";

// const foo = 4;

const modules = new Map();
modules.set("my-module", { data: { version: "2.0.0" } });

class MockGame {
  version = "0.0.1";
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

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="system-hit">Register system hit</button>
    <button id="module-hit">Register module hit</button>
  </div>
`;

document.querySelector<HTMLDivElement>("#system-hit")!.addEventListener("click", () => {
  registerClientVisit();
});

document.querySelector<HTMLDivElement>("#module-hit")!.addEventListener("click", () => {
  registerClientVisit({ moduleName: "my-module" });
});

console.log("Creating game");
