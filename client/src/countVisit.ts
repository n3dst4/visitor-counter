import {
  assertGame,
  getModuleVersion,
  getCountry,
  isNonZeroString,
  log,
  timeoutPromise,
  hashIfPossible,
} from "./functions";

const envUrl = import.meta.env.VITE_COUNTER_URL;

if (!isNonZeroString(envUrl)) {
  throw new Error("VITE_COUNTER_URL is not defined");
}

/**
 * Count a visit to the game.
 */
export const countVisit = async ({
  moduleName,
  counterServiceUrl = envUrl,
  country: countryArg,
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
  /**
   * Country to count; if undefined, will use ipapi.co (this is mainly for
   * testing) (yes I know about mocks, thanks).
   */
  country?: string,
} = {}) => {
  // gather all the info we need
  const country = countryArg || await timeoutPromise(getCountry(), 3000, "Unknown");
  assertGame(game);
  const fvttVersion = game.version;
  const isModule = !!moduleName;
  const moduleOrSystemVersion = isModule
    ? getModuleVersion(moduleName)
    : game.system.data.version;
  const name = isModule ? moduleName : game.system.data.name;
  const type = isModule ? "module" : "system";
  const username = game.user?.name ?? "unknown";
  const usernameHash = await hashIfPossible(username);

  // construct the URL for the counter service
  const parsedUrl = new URL(counterServiceUrl);
  parsedUrl.pathname = parsedUrl.pathname
    .replace(/\/$/, "")
    .concat(`/${type}/${name}`);
  parsedUrl.searchParams.set("fvtt_version", fvttVersion);
  parsedUrl.searchParams.set("version", moduleOrSystemVersion);
  parsedUrl.searchParams.set("country", country);
  parsedUrl.searchParams.set("username_hash", usernameHash);
  parsedUrl.searchParams.set("cache_buster", Date.now().toString());
  const finalUrl = parsedUrl.toString();

  log("Counting visit", {
    country,
    fvttVersion,
    moduleOrSystemVersion,
    name,
    type,
    usernameHash,
    finalUrl,
  });

  // create the image element that will be used to send the request
  const img = document.createElement("img");
  img.src = finalUrl;
  img.style.position = "absolute";
  img.setAttribute("aria-hidden", "true");
  img.setAttribute("alt", "");

  // resolve or reject the promise when the "image" loads or fails
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

  // append the image to the document
  document.body.appendChild(img);
  return await promise;
};
