import React from 'react';
import { Redirect } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import { GET_CURRENT_USER } from '../queries/index';

const withAuth = (conditionFunc) => (Component) => (props) => {
  const { data, loading } = useQuery(GET_CURRENT_USER);

  if (loading) return null;

  return conditionFunc(data) ? <Component {...props} /> : <Redirect to="/" />;
};

export default withAuth;
