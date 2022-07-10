// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { metric, register } from 'prom-client';
import { counter } from '../../utils/counters';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const metrics = await register.metrics();
  res.setHeader("Content-Type", register.contentType);  
  res.status(200).send(metrics);
}
