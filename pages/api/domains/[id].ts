import { NextApiRequest, NextApiResponse } from 'next';
import { deleteDomainById } from '../../../models/Domain';
import dbConnect from '../../../lib/dbConnect';

(async function () {
  console.log(process.env.MONGODB_URI);
  await dbConnect();
})();

export default async function handleDomains(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id as string;
      await deleteDomainById(id);
      res.status(204).json({ id });
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
