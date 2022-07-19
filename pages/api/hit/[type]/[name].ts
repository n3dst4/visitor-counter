// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  counter,
} from '../../../../utils/counters';

const ensureString = (value: string|string[]|undefined) => 
  (value === undefined) ? "" : (Array.isArray(value)) ? value.join(",") : value;

type ModuleOrSystem = "module" | "system";

function isModuleOrSystem(value: string): value is ModuleOrSystem {
  return value === "module" || value === "system";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 
  const { query } = req;
  const type = ensureString(query.type);

  if (!isModuleOrSystem(type)) {
    throw new Error(`Invalid type: ${type}`);
  }

  const name = ensureString(query.name);
  const version = ensureString(query.version);
  const major_version = ensureString(query.major_version);
  const fvtt_version = ensureString(query.fvtt_version);
  const fvtt_major_version = ensureString(query.fvtt_major_version);
  const ip = req.socket.remoteAddress || "";
  const queryCountry = ensureString(query.country);
  const country = queryCountry.toLowerCase() === "unknown" 
    ? await (await fetch(`https://ipapi.co/${ip}/country/`)).text()
    : queryCountry;
  
  const origin = new URL(req.headers.referer || "").origin;

  console.log(query);
  counter.inc({
    type,
    name,
    origin,
    // browser,
    country,
    version,
    major_version,
    fvtt_version,
    fvtt_major_version,
  });
  res.status(204).end();
}
