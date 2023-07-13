import { NextApiRequest, NextApiResponse } from 'next';
import { deleteDomainById, getDomainById } from '../../../models/Domain';
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
      const userId = req.headers.userid;
      const domain = await getDomainById(id);
      if (!domain) {
        res.status(404).json({ message: 'Invalid domain name' });
        return;
      }
      if (domain.userId !== userId) {
        res.status(403).json({ message: 'Permission denied!' });
        return;
      }
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
