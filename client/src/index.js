import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import './index.css';

import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';

import withSession from './components/withSession';

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  uri: 'http://172.18.0.3:4444/graphql',
  fetchOptions: {
    credentials: 'include',
  },
  request: (operation) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        authorization: token,
      },
    });
  },
  onError: ({ networkError }) => {
    if (networkError) {
      console.error('Network error', networkError);
    }

    // if(networkError.statusCode === 401) {
    //   localStorage.setItem('token', '');
    // }
  },
});

const Root = ({ refetch }) => (
  <Router>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/signin" render={() => <Signin refetch={refetch} />} />
      <Route path="/signup" render={() => <Signup refetch={refetch} />} />
      <Redirect to="/" />
    </Switch>
  </Router>
);

const RootWithSession = withSession(Root);

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RootWithSession />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
