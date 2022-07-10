import promClient from "prom-client";

const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;

console.log("Collecting default metrics...");

const register = new Registry();
collectDefaultMetrics({ register });

export const counter = new promClient.Counter({
  name: "hits",
  help: "number of times it's been hit",
});
