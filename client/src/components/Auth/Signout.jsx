import React from 'react';
import { withRouter } from 'react-router-dom';

import { ApolloConsumer } from 'react-apollo';

const Signout = ({history}) => {
  const handleSignout = (client) => {
    localStorage.setItem('token', '');
    client.resetStore();

    history.push('/');
  };

  return (
    <ApolloConsumer>
      {(client) => {
        return <button onClick={() => handleSignout(client)}>Signout</button>;
      }}
    </ApolloConsumer>
  );
};

export default withRouter(Signout);
