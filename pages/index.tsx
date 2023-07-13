import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import AddDomain from '../components/AddDomain';
import ShowDomains from '../components/ShowDomains';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EastIcon from '@mui/icons-material/East';
import LogoutIcon from '@mui/icons-material/Logout';
import { User } from 'firebase/auth';
import { toast } from 'react-toastify';

import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, provider } from '../config';

type Domain = {
  _id: string;
  name: string;
  expiry: string;
  issueDate: string;
  daysToAlert: number;
};

const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);

  // attaching an event handler to observe the state change of auth when looged in lor logged out
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log(user);
      setUser(user);
    });
  }, []);

  const loginUser = () => {
    signInWithPopup(auth, provider).catch((error) => {
      setUser(null);
      const errorDetails = {
        errorCode: error.code,
        errorMessage: error.message,
        // The AuthCredential type that was used.
        credential: GoogleAuthProvider.credentialFromError(error),
      };
      console.log(errorDetails);
    });
  };
  const signout = () => {
    signOut(auth).catch((error) => {
      console.log(error);
    });
  };
  const fetchDomains = async (url: string) => {
    try {
      // api call to fetch data
      console.log(user);
      const config = {
        headers: { userId: user!.uid },
      };
      const response = await axios.get(url, config);
      setDomains(response.data);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const addDomain = (domain: Domain): void => {
    setDomains((domains) => [...domains, domain]);
  };
  const handleDelete = async (id: string): Promise<void> => {
    try {
      if (!user) return;
      const config = {
        headers: { userId: user.uid },
      };
      await axios.delete(`/api/domains/${id}`, config);
      setDomains((domains) => domains.filter((domain) => domain._id !== id));
    } catch (error: any) {
      console.log(error);
      toast.error('Failed to delete domain!');
    }
  };
  const { error, isLoading } = useSWR(
    () => (user ? '/api/domains' : null),
    fetchDomains,
  );
  if (error) {
    toast.error('Something went wrong!');
    return;
  }
  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <div className="flex flex-col min-h-full">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        theme="light"
      />
      <AddDomain addNewDomain={addDomain} user={user} />
      {error ? <div>{error.message}</div> : null}
      {isLoading ? (
        <div>Loading...</div>
      ) : domains.length === 0 ? (
        <div className="flex justify-center items-center grow text-2xl text-tableHeaderText">
          Enter domains to view here!
        </div>
      ) : (
        <ShowDomains domains={domains} handleDelete={handleDelete} />
      )}
      <div className="w-[100%] mt-[2] h-[50px] flex justify-end items-center px-4 py-1.5">
        <button
          type="button"
          className="bg-buttonColor text-white px-4 py-2 rounded-md md:w-[150px] rounded font-medium text-xs flex justify-center items-center h-full gap-2"
          onClick={signout}
        >
          <LogoutIcon fontSize="small" />
          Sign out
        </button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center  w-full h-[100vh]">
      <div className="h-[500px] w-full max-w-[700px] flex flex-col justify-center">
        <div className="text-6xl mb-4  ">SSL Expiry Tracker</div>
        <p className="text-xl text-tableHeaderText  leading-relaxed mb-2">
          {`Keep a track and stay alerted about all your domains, so next time
          you will remember when to update your certificate!`}
        </p>
        <button
          onClick={loginUser}
          className="mt-4 bg-buttonColor text-white px-4 py-4 rounded-md w-[200px] rounded-md font-medium text-md flex justify-start gap-2 items-center h-[50px]"
        >
          Login with Google
          <EastIcon />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
