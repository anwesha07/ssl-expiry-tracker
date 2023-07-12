import { NextApiRequest, NextApiResponse } from 'next';
import sslChecker from 'ssl-checker';

(async function () {
  console.log(process.env.MONGODB_URI);
  await dbConnect();
})();

import {
  fetchDomains,
  findDomainByName,
  saveDomain,
  IDomain,
} from '../../models/Domain';
import dbConnect from '../../lib/dbConnect';

export default async function handleDomains(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      // fetch data from db
      const domains = await fetchDomains();
      res.status(200).json(domains);
    } catch (error) {
      console.error('Error occurred while fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const { formData }: { formData: IDomain } = req.body;

      // check the domain name in db
      const formDataByName = await findDomainByName(formData.name);
      if (formDataByName) {
        res.status(409).json({ message: 'domain already exists' });
        return;
      }

      // check the expiry of the domain here
      const info = await sslChecker(formData.name, {
        method: 'GET',
        port: 443,
      });

      formData.expiry = new Date(info.validTo);
      formData.issueDate = new Date(info.validFrom);

      // Store the form data in the database
      const result = await saveDomain(formData);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error occurred while submitting form:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
