// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { counter } from '../../utils/counters';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  counter.inc()
  res.status(204).end();
}
