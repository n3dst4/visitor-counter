import { assertGame, getModuleVersion } from "./foundry-functions";
import { getCountry, log, timeoutPromise } from "./functions";

export const registerClientVisit = async ({ moduleName }: {moduleName?: string} = {}) => {
  assertGame(game);
  // fetch;
  log(import.meta.env);
  const url = import.meta.env.VITE_COUNTER_URL;
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
  const parsedUrl = new URL(url);
  const type = isModule ? "module" : "system";
  parsedUrl.pathname = parsedUrl.pathname.replace(/\/$/, "").concat(`/${type}/${name}`);
  parsedUrl.searchParams.set("foundry_version", foundryVersion);
  parsedUrl.searchParams.set("version", moduleOrSystemVersion);
  parsedUrl.searchParams.set("country", country);
  log(parsedUrl.toString());
};
