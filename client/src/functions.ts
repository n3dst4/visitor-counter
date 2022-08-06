/**
 * Returns a promise which will resolve after the given number of milliseconds
 */
export function wait (milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

/**
 * Wrap a promise so that it will time out and either reject, or return a
 * fallback value if one is given, if it hasn't already resolved or rejected
 * after the given number of milliseconds.
 */
export function timeoutPromise<T> (
  promise: Promise<T>,
  milliseconds: number,
  fallbackValue?: T,
): Promise<T> {
  const fallback = fallbackValue
    ? Promise.resolve(fallbackValue)
    : Promise.reject(new Error("Timeout"));
  return Promise.race([promise, wait(milliseconds).then(() => fallback)]);
}

/** Fetch geolocated country */
export const getCountry = async (): Promise<string> =>
  await (await fetch("https://ipapi.co/country/")).text();

/** Bound log function to prefix messages */
export const log = console.log.bind(console, "[Visitors]");

/** Return true if `str` is a string with at least one character */
export const isNonZeroString = (str: string|undefined|null): str is string =>
  ![null, undefined, ""].includes(str);

/** Check that `game` has been initialised */
function isGame (game: any): game is Game {
  return game instanceof Game;
}

/**
 * Throw if `game` has not been initialized. This is hyper unlikely at runtime
 * but technically possible.
 */
export function assertGame (game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

/**
 * Get the version of a module
 */
export function getModuleVersion (moduleName: string): string {
  assertGame(game);
  const module = game.modules.get(moduleName);
  if (module === undefined) {
    throw new Error(`Module ${moduleName} not found`);
  }
  return module.data.version;
}

/**
 * Return a hash of a string if the browser is equipped to do this natively;
 * if anything goes wrong we just return "unknown".
 */
export async function hashIfPossible (str: string) {
  // crypto, crypto.subtle, crypto.subtle.digest may not exist in all browsers
  // and contexts - in that case we'll bail out and put these guys in a single
  // bucket called "unknown".
  if (crypto?.subtle?.digest === undefined) {
    return "unknown";
  }
  // see https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
