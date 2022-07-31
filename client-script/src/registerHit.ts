
import {
  assertGame,
  getModuleVersion,
  getCountry,
  isNonZeroString,
  log,
  timeoutPromise,
  hashIfPossible,
} from "./functions";

const urlVar = import.meta.env.VITE_COUNTER_URL;

if (!isNonZeroString(urlVar)) {
  throw new Error("VITE_COUNTER_URL is not defined");
}

/**
 * Count a visit to the game.
 */
export const registerHit = async ({
  moduleName,
  counterServiceUrl = urlVar,
}: {
  /**
   * Module name to count; if undefined, will count the system.
   * @default the current system
   */
  moduleName?: string,
  /**
   * URL of the counter service
   * @default The main counter service URL
   */
  counterServiceUrl?: string,
} = {}) => {
  const country = await timeoutPromise(getCountry(), 3000, "Unknown");
  assertGame(game);
  const fvttVersion = game.version;
  const isModule = !!moduleName;
  const moduleOrSystemVersion = isModule
    ? getModuleVersion(moduleName)
    : game.system.data.version;
  const name = isModule ? moduleName : game.system.data.name;
  const parsedUrl = new URL(counterServiceUrl);
  const type = isModule ? "module" : "system";
  parsedUrl.pathname = parsedUrl.pathname
    .replace(/\/$/, "")
    .concat(`/${type}/${name}`);

  const username = game.user?.name ?? "unknown";
  const ua = window.navigator.userAgent;
  const identifier = `${username} on ${ua}`;
  const usernameHash = await hashIfPossible(identifier);

  parsedUrl.searchParams.set("fvtt_version", fvttVersion);
  parsedUrl.searchParams.set("version", moduleOrSystemVersion);
  parsedUrl.searchParams.set("country", country);
  parsedUrl.searchParams.set("username_hash", usernameHash.toString());
  const finalUrl = parsedUrl.toString();
  log(finalUrl);
  const img = document.createElement("img");
  img.src = finalUrl;
  img.style.position = "absolute";
  img.setAttribute("aria-hidden", "true");
  img.setAttribute("alt", "");

  const promise = new Promise<void>((resolve, reject) => {
    img.addEventListener("load", () => {
      img.parentNode?.removeChild(img);
      log("Success");
      resolve();
    });
    img.addEventListener("error", () => {
      img.parentNode?.removeChild(img);
      reject(new Error("Failed to initialise counter."));
    });
  });
  document.body.appendChild(img);
  return await promise;
};
