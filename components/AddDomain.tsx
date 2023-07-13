import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { User } from 'firebase/auth';
import AddIcon from '@mui/icons-material/Add';
import { toast } from 'react-toastify';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

type FunctionPropType = (domain: Domain) => void;

interface AddDomainProps {
  addNewDomain: FunctionPropType;
  user: User;
}

const AddDomain: React.FC<AddDomainProps> = ({ addNewDomain, user }) => {
  const [name, setDomainName] = useState<string>('');
  const [daysToAlert, setDaysToAlert] = useState<string>('');

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate and process form data here
    const formData = {
      name,
      daysToAlert: parseInt(daysToAlert),
    };

    if (formData.daysToAlert <= 0) {
      toast.error('Please enter a valid count of days!');
      return;
    }

    if (name && daysToAlert) {
      const config = {
        headers: { userId: user.uid },
      };
      // Make the API request
      axios
        .post(`/api/domains`, { formData }, config)
        .then((response) => {
          // Form submitted successfully
          addNewDomain(response.data as Domain);
          setDomainName('');
          setDaysToAlert('');
        })
        .catch((error: any) => {
          console.error(
            'Error occurred while submitting the form:',
            error.response.data.message,
          );
          if (error.response.status === 409)
            toast.error(error.response.data.message);
          else if (error.response.status === 400)
            toast.error('Please provide a valid input!');
          else toast.error('Check the domain!');
        });
    } else {
      toast.error('Fields are mandatory!');
    }
  };

  return (
    <div className="py-4 px-0 flex flex-col item-center w-full max-w-[900px] m-auto text-darktext text-sm">
      <form
        onSubmit={handleFormSubmit}
        className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between p-2"
      >
        <div className="flex flex-row items-center justify-center pt-2 md:pt-0 md:px-0 md:w-[400px]">
          <div className="font-bold flex items-center pr-2">Domain:</div>
          <input
            type="text"
            value={name}
            placeholder='Something like "google.com"'
            onChange={(e) => setDomainName(e.target.value)}
            className="border border-metal-300 p-2 w-full rounded-md"
          />
        </div>
        <div className="flex flex-row h-full pt-2 md:pt-0 md:px-0 md:w-[300px]">
          <div className="font-bold flex items-center w-[140px]">
            Alert Before:
          </div>
          <input
            type="number"
            value={daysToAlert}
            placeholder="How about 30 days?"
            onChange={(e) => setDaysToAlert(e.target.value)}
            className="border border-metal-300 p-2 w-full rounded-md"
          />
        </div>
        <button
          type="submit"
          className="bg-buttonColor text-white px-4 py-2 rounded-md md:w-[150px] rounded font-medium text-xs flex justify-center items-center"
        >
          <AddIcon fontSize="small" />
          Add Domain
        </button>
      </form>
    </div>
  );
};

export default AddDomain;
