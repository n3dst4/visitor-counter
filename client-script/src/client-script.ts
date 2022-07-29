import { assertGame, getModuleVersion } from "./foundry-functions";
import { getCountry, log, timeoutPromise } from "./functions";

// this is the script that will be injected into a module to enable tracking
export const registerClientVisit = async ({
  moduleName,
  url,
}: { moduleName?: string, url: string }) => {
  const country = await timeoutPromise(getCountry(), 3000, "Unknown");
  assertGame(game);
  const foundryVersion = game.version;
  const isModule = !!moduleName;
  const moduleOrSystemVersion = isModule
    ? getModuleVersion(moduleName)
    : game.system.data.version;
  const name = isModule ? moduleName : game.system.data.name;
  const parsedUrl = new URL(url);
  const type = isModule ? "module" : "system";
  parsedUrl.pathname = parsedUrl.pathname
    .replace(/\/$/, "")
    .concat(`/${type}/${name}`);
  parsedUrl.searchParams.set("foundry_version", foundryVersion);
  parsedUrl.searchParams.set("version", moduleOrSystemVersion);
  parsedUrl.searchParams.set("country", country);
  const finalUrl = parsedUrl.toString();
  log(finalUrl);
  img = document.createElement("img");
  img.src = finalUrl;
  img.style.position = "absolute";
  img.setAttribute("aria-hidden", "true");
  img.setAttribute("alt", "");

  const promise = new Promise<void>((resolve, reject) => {
    img.addEventListener("load", () => {
      img.parentNode?.removeChild(img);
      resolve();
    });
    img.addEventListener("error", () => {
      img.parentNode?.removeChild(img);
      reject(new Error("Failed to load initialise counter"));
    });
  });
  document.body.appendChild(img);
  return await promise;
};
