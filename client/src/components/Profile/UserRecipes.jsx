import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-apollo';

import { GET_USER_RECIPES } from '../../queries/index';

const UserRecipes = ({ username }) => {
  const { data, loading, error } = useQuery(GET_USER_RECIPES, {
    variables: { username },
  });

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  console.log(data);

  return (
    <ul>
      <h3>Your Recipes</h3>
      {data.getUserRecipes.map((recipe) => (
        <li key={recipe.id}>
          <Link to={`/recipes/${recipe.id}`}>
            <p>{recipe.name}</p>
          </Link>
          <p>{recipe.likes}</p>
        </li>
      ))}
    </ul>
  );
};

export default UserRecipes;
