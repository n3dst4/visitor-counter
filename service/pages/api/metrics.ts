// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { metric } from 'prom-client';
import { metricsCounter, registry } from '../../utils/counters';
// import { counter } from '../../utils/counters';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const ua = req.headers["user-agent"] || "unknown";
  metricsCounter.inc({
    user_agent: ua,
  });
  const metrics = await registry.metrics();
  res.setHeader("Content-Type", registry.contentType);  
  res.status(200).send(metrics);
}
