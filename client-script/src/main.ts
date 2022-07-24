/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import "./style.css";
// import typescriptLogo from "./typescript.svg";
import { registerClientVisit } from "./client-script";

// const foo = 4;

class MockGame {
  version = "0.0.1";
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
    <button id="go">Register hit</button>
  </div>
`;

document.querySelector<HTMLDivElement>("#go")!.addEventListener("click", () => {
  registerClientVisit(game as Game);
});

console.log("Creating game");
