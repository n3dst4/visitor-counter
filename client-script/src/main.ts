// import "./style.css";
// import typescriptLogo from "./typescript.svg";
import { registerClientVisit } from "./client-script";

// const foo = 4;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <button id="go">Register hit</button>
  </div>
`;

document.querySelector<HTMLDivElement>("#go")!.addEventListener("click", () => {
  registerClientVisit();
});


