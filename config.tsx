// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAc9sbAq4Pv2Ydc4KLXZWlrxL1HntUDbwE',
  authDomain: 'expiry-tracker-64abb.firebaseapp.com',
  projectId: 'expiry-tracker-64abb',
  storageBucket: 'expiry-tracker-64abb.appspot.com',
  messagingSenderId: '379220698434',
  appId: '1:379220698434:web:22800a307017732aaad4db',
  measurementId: 'G-HHH1LNM9Y0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  hd: 'hyperverge.co',
});
export { auth, provider };
