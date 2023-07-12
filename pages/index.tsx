import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import AddDomain from '../components/AddDomain';
import ShowDomains from '../components/ShowDomains';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EastIcon from '@mui/icons-material/East';
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
  const [user, setUser] = useState(null);
  const [domains, setdomains] = useState<Domain[]>([]);

  // attaching an event handler to observe the state change of auth when looged in lor logged out
  useEffect(() => {
    onAuthStateChanged(auth, (user) => setUser(user));
  }, []);

  const loginUser = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(auth);
        // The signed-in user info.
        const user = result.user;
        console.log({ user });
        // setUser(user);
      })
      .catch((error) => {
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
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log(auth);
        // setUser(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchDomains = async () => {
    try {
      // api call to fetch data
      const response = await axios.get('/api/domains');
      setdomains(response.data);
      return response;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const addDomain = (domain: Domain): void => {
    setdomains((domains) => [...domains, domain]);
  };
  const handleDelete = async (id: string): Promise<void> => {
    try {
      await axios.delete(`/api/domains/${id}`);
      setdomains((domains) => domains.filter((domain) => domain._id !== id));
    } catch (error: any) {
      console.log(error);
    }
  };
  const { data, error, isLoading } = useSWR('/api', fetchDomains);
  if (error) return;
  if (isLoading) return <div>Loading...</div>;

  return user ? (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <AddDomain addNewDomain={addDomain} />
      {error ? <div>{error.message}</div> : null}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ShowDomains domains={domains} handleDelete={handleDelete} />
      )}
      <div className="w-[100%] mt-[2] h-[50px]">
        <button onClick={signout}>signout</button>
      </div>
    </div>
  ) : (
    <div className="flex justify-center  w-full h-[100vh]">
      <div className="h-[500px] w-full max-w-[700px] flex flex-col justify-center">
        <div className="text-6xl mb-4  ">SSL Expiry Tracker</div>
        <p className="text-xl text-tableHeaderText  leading-relaxed mb-2">
          {`Keep a track and stay alerted about all your domains, so next time
          you will remember whent to update your certificate!`}
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
