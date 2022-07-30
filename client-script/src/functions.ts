
function wait (howLong: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, howLong);
  });
}

export function timeoutPromise<T> (
  promise: Promise<T>,
  timeout: number,
  fallbackValue?: T,
): Promise<T> {
  const fallbackPromise = fallbackValue
    ? Promise.resolve(fallbackValue)
    : Promise.reject(new Error("Timeout"));
  return Promise.race([promise, wait(timeout).then(() => fallbackPromise)]);
}

export const getCountry = async (): Promise<string> =>
  await (await fetch("https://ipapi.co/country/")).text();

export const log = console.log.bind(console, "[visitor counter client]");

export const isNonZeroString = (str: string|undefined|null): str is string =>
  ![null, undefined, ""].includes(str);

/**
 * Check that `game` has been initialised
 */
function isGame (game: any): game is Game {
  return game instanceof Game;
}

/**
 * Throw if `game` has not been initialized. This is hyper unlikely at runtime
 * but technically possible during a calamitous upfuckage to TS keeps us honest
 * and requires a check.
 */
export function assertGame (game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

// CONFIG;

export function getModuleVersion (moduleName: string): string {
  assertGame(game);
  const module = game.modules.get(moduleName);
  if (module === undefined) {
    throw new Error(`Module ${moduleName} not found`);
  }
  return module.data.version;
}
