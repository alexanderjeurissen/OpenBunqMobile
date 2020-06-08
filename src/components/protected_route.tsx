import React, { useContext } from 'react';

import { Redirect, Route } from 'react-router-dom';
import BunqContext from '../helpers/bunq_context';

interface ProtectedRouteProps {
  path: string,
  component: React.FC
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component, ...props }) => {
  const bunqClient = useContext(BunqContext);

  const Component = component;

  return (
    <Route
      {...props}
      render={({ location }) => {
        if(!bunqClient.Session.sessionId) {
          return <Redirect to='/login'/>
        }

        return <Component {...props} />
      }}
    />
  );
};

export default ProtectedRoute;
