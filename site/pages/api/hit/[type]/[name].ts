// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
  counter,
} from '../../../../utils/counters';
import { createHmac } from "crypto";
import { Counter, LabelValues } from 'prom-client';


// TODO generate this at startup
const salt = "lkdfjbnavk;jdfba;kdj";

const ensureString = (value: string|string[]|undefined) => 
  (value === undefined) ? "" : (Array.isArray(value)) ? value.join(",") : value;

type ModuleOrSystem = "module" | "system";

function isModuleOrSystem(value: string): value is ModuleOrSystem {
  return value === "module" || value === "system";
}

// I'm sure this type or something equivalant must exist in prom-client but I
// can't find it.
type CounterLabels<T> = T extends Counter<infer U> ? LabelValues<U> : never;

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
  const country = ensureString(query.country);

  // build up anonymous hash
  const ip = req.socket.remoteAddress || "";
  const ua = req.headers["user-agent"] || "";
  const data = JSON.stringify({ip, ua, salt});
  const hash = createHmac('sha256', data).digest('hex');

  // headers
  const origin = new URL(req.headers.referer || "").origin;

  const payload: CounterLabels<typeof counter> = {
    type,
    name,
    origin,
    // browser,
    hash,
    country,
    version,
    major_version,
    fvtt_version,
    fvtt_major_version,
  }
  console.log(payload);
  
  counter.inc(payload);
  res.redirect("/1x1_transparent.gif");
}
