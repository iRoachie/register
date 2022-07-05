import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../containers/Auth';
import { Loading } from '../components';

interface Props {
  children: React.ReactElement;
}

export const RequireAuth = ({ children }: Props) => {
  const { status } = useContext(AuthContext);

  if (status === 'loading') {
    return <Loading />;
  }

  return status === 'loggedIn' ? children : <Navigate to="/login" />;
};
