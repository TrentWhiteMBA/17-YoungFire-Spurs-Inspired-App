import { auth } from './firebase/config';
import { GoogleAuthProvider } from 'firebase/auth';

export const authInstance = auth;
export const googleProviderInstance = new GoogleAuthProvider();

export default {
  authInstance,
  googleProviderInstance
};
