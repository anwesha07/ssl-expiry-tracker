import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import { fetchDomains } from '../../models/Domain';

// (async function () {
//   await dbConnect();
// })();

dbConnect();

export default async function submitForm(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // await dbConnect();
  if (req.method === 'GET') {
    try {
      // fetch data from db
      const domains = await fetchDomains();
      console.log(domains);
      res.status(200).json(domains);
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
