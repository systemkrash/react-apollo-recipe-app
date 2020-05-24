import React, { useState } from 'react';
import { useMutation } from 'react-apollo';

import withSession from '../withSession';

import { LIKE_RECIPE, GET_RECIPE, UNLIKE_RECIPE } from '../../queries/index';

const LikeRecipe = (props) => {
  const initialState = { username: '', liked: false, clicked: false };
  const { id } = props;
  const [state, setState] = useState(() => {
    if (props.session.getCurrentUser) {
      const prevLiked =
        props.session.getCurrentUser.favorites.findIndex(
          (favorite) => favorite.id === id
        ) > -1;
      return {
        ...initialState,
        username: props.session.getCurrentUser.username,
        liked: prevLiked,
      };
    } else {
      return { ...initialState };
    }
  });
  const { username, liked } = state;

  const [likeRecipe] = useMutation(LIKE_RECIPE, {
    variables: { id, username },
    // refetchQueries: () => [
    //   {query: GET_RECIPE, variables: {id}}
    // ],
    update: (cache, { data: { likeRecipe } }) => {
      const { getRecipe } = cache.readQuery({
        query: GET_RECIPE,
        variables: { id: id },
      });

      cache.writeQuery({
        query: GET_RECIPE,
        variables: { id },
        data: {
          getRecipe: { ...getRecipe, likes: likeRecipe.likes + 1 },
        },
      });
    },
  });

  const [unlikeRecipe] = useMutation(UNLIKE_RECIPE, {
    variables: { id, username },
    update: (cache, { data: { unlikeRecipe } }) => {
      const { getRecipe } = cache.readQuery({
        query: GET_RECIPE,
        variables: { id: id },
      });

      cache.writeQuery({
        query: GET_RECIPE,
        variables: { id },
        data: {
          getRecipe: { ...getRecipe, likes: unlikeRecipe.likes - 1 },
        },
      });
    },
  });

  const handleLike = (clicked) => {
    if (clicked) {
      likeRecipe().then(async ({ data }) => {
        console.log(data);
      });
    } else {
      // unlike recipe mutation
      unlikeRecipe().then(async ({ data }) => {
        console.log(data);
      });
    }
  };

  const handleClick = () => {
    setState(
      (prevState) => ({
        ...prevState,
        liked: !prevState.liked,
        clicked: true,
      }),
      handleLike(!liked)
    );
  };

  return (
    username && (
      <button onClick={() => handleClick()}>{liked ? 'Unlike' : 'Like'}</button>
    )
  );
};

export default withSession(LikeRecipe);
