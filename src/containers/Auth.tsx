import React, { useEffect, useState } from 'react';
import { auth } from '../config';

interface State {
  status: 'loading' | 'loggedIn' | 'loggedOut';
}

export const AuthContext = React.createContext<State>({
  status: 'loading',
});

interface Props {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [status, setStatus] = useState<State['status']>('loading');

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setStatus(user ? 'loggedIn' : 'loggedOut');
    });
  }, []);

  return (
    <AuthContext.Provider value={{ status }}>{children}</AuthContext.Provider>
  );
};
