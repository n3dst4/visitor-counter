import promClient from "prom-client";


// constructing a custom registry protects us from weirdness in next's dev 
// server environment
export const registry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: registry });

export const counter = new promClient.Counter({
  name: "hits",
  help: "number of times it's been hit",
  labelNames: [
    "type",
    "name",
    "origin",
    "browser",
    "country",
    "version",
    "major_version",
    "fvtt_version",
    "fvtt_major_version"
  ],
  registers: [registry], //
});
