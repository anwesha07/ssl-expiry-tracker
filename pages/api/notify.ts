import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Hello cron!');
  res.status(200).send('Hello Cron!');
}
