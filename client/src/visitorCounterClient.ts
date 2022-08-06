import { countVisit } from "./countVisit";

export const countModuleVisit = (moduleName: string) => {
  countVisit({ moduleName });
};

export const countSystemVisit = () => {
  countVisit();
};
