import React, { useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';
import { BunqContext } from '../providers/bunq_provider';

interface ProtectedRouteProps {
  path: string,
  component: React.FC
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component, ...props }) => {
  const { BunqClient } = useContext(BunqContext)!;

  const Component = component;

  return (
    <Route
      {...props}
      render={({ location }) => {
        if(!BunqClient.Session.sessionId) {
          return <Redirect to='/login'/>
        }

        return <Component {...props} />
      }}
    />
  );
};

export default ProtectedRoute;
