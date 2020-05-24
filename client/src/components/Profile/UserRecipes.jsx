import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';

import {
  GET_USER_RECIPES,
  DELETE_USER_RECIPE,
  GET_ALL_RECIPES,
  GET_CURRENT_USER,
} from '../../queries/index';

const UserRecipes = ({ username }) => {
  const { data, loading, error } = useQuery(GET_USER_RECIPES, {
    variables: { username },
  });
  const [deleteUserRecipe, { loading: mutationLoading }] = useMutation(
    DELETE_USER_RECIPE,
    {
      update: (cache, { data: { deleteUserRecipe } }) => {
        const { getUserRecipes } = cache.readQuery({
          query: GET_USER_RECIPES,
          variables: { username },
        });

        cache.writeQuery({
          query: GET_USER_RECIPES,
          variables: { username },
          data: {
            getUserRecipes: getUserRecipes.filter(
              (recipe) => recipe.id !== deleteUserRecipe.id
            ),
          },
        });
      },
      refetchQueries: () => [
        { query: GET_ALL_RECIPES },
        { query: GET_CURRENT_USER },
      ],
    }
  );

  if (loading) return <div>Loading</div>;
  if (error) return <div>Error</div>;

  console.log(data);

  const handleDelete = ({ id }) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this recipe?'
    );

    if (confirmDelete) {
      deleteUserRecipe({ variables: { id: id } }).then(({ data }) => {
        console.log(data);
      });
    }
  };

  return (
    <ul>
      <h3>Your Recipes</h3>
      {!data.getUserRecipes.length && (
        <p>
          <strong>You have not added any recipes yet</strong>
        </p>
      )}
      {data.getUserRecipes.map((recipe) => (
        <li key={recipe.id}>
          <Link to={`/recipes/${recipe.id}`}>
            <p>{recipe.name}</p>
          </Link>
          <p style={{ marginBottom: '0' }}>{recipe.likes}</p>
          <p
            className="delete-button"
            onClick={() => {
              handleDelete(recipe);
            }}
          >
            {mutationLoading ? 'deleting...' : 'X'}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default UserRecipes;
