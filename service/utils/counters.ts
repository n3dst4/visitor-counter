import promClient from "prom-client";


// constructing a custom registry protects us from weirdness in next's dev 
// server environment
export const registry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: registry });

export const visitCounter = new promClient.Counter({
  name: "visits",
  help: "number of times it's been hit",
  labelNames: [
    "type",
    "name",
    "origin",
    "browser",
    "scheme",
    "country",
    "hash",
    "version",
    "major_version",
    "fvtt_version",
    "fvtt_major_version"
  ],
  registers: [registry],
});

export const metricsCounter = new promClient.Counter({
  name: "metrics",
  help: "number of times metrics have been collected",
  labelNames: [
    "user_agent"
  ],
  registers: [registry],
});
