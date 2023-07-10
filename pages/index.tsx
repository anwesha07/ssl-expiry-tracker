import React, { useState } from 'react';
import axios from 'axios';
import AddDomain from '../components/AddDomain';
import ShowDomains from '../components/ShowDomains';
import useSWR from 'swr';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

const HomePage: React.FC = () => {
  const [domains, setdomains] = useState<Domain[]>([]);
  const fetchDomains = async () => {
    try {
      // api call to fetch data
      const response = await axios.get('/api/domains');
      // console.log(response);
      setdomains(response.data);
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const addDomain = (domain: Domain): void => {
    setdomains((domains) => [...domains, domain]);
  };
  const { data, error, isLoading } = useSWR('/api', fetchDomains);
  if (error) return;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <AddDomain addNewDomain={addDomain} />
      {error ? <div>{error.message}</div> : null}
      {isLoading ? <div>Loading...</div> : <ShowDomains domains={domains} />}
    </div>
  );
};

export default HomePage;
