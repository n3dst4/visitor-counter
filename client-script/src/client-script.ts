import { timeoutPromise } from "./timoutPromise";

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
function assertGame (game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

// CONFIG;

function getModuleVersion (moduleName: string): string {
  assertGame(game);
  const module = game.modules.get(moduleName);
  if (module === undefined) {
    throw new Error(`Module ${moduleName} not found`);
  }
  return module.data.version;
}

async function getCountry (): Promise<string> {
  const ip = await fetch("https://ipapi.co/country/");
  return await ip.text();
}

export const registerClientVisit = async ({ moduleName }: {moduleName?: string} = {}) => {
  assertGame(game);
  // fetch;
  const url = import.meta.env.COUNTER_URL;
  const foundryVersion = game.version;
  const isModule = !!moduleName;
  const moduleOrSystemVersion = isModule
    ? getModuleVersion(moduleName)
    : game.system.data.version;
  const name = isModule ? moduleName : game.system.data.name;
  const country = await timeoutPromise(
    getCountry(),
    3000,
    "Unknown",
  );
  console.log({ url, isModule, foundryVersion, moduleOrSystemVersion, name, country });
};
