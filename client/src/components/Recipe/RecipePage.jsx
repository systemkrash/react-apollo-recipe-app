import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

import LikeRecipe from './LikeRecipe';

import { GET_RECIPE } from '../../queries/index';

const RecipePage = ({ match }) => {
  const { id } = match.params;

  return (
    <Query query={GET_RECIPE} variables={{ id }}>
      {({ data, loading, error }) => {
        if (loading) return <div>Loading</div>;
        if (error) return <div>Error</div>;

        console.log(data);

        return (
          <div className="App">
            <h2>{data.getRecipe.name}</h2>
            <p>Category: {data.getRecipe.category}</p>
            <p>Description: {data.getRecipe.description}</p>
            <p>Instructions: {data.getRecipe.instructions}</p>
            <p>Likes: {data.getRecipe.likes}</p>
            <p>Created By: {data.getRecipe.username}</p>
            <LikeRecipe id={id} />
          </div>
        );
      }}
    </Query>
  );
};

export default withRouter(RecipePage);
