import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';

import Error from '../Error';

import { ADD_RECIPE, GET_ALL_RECIPES } from '../../queries/index';

const AddRecipe = (props) => {
  const initialState = {
    name: '',
    instructions: '',
    category: 'Breakfast',
    description: '',
    username: '',
  };
  const [state, setState] = useState({ ...initialState });

  useEffect(() => {
    setState((state) => ({
      ...state,
      username: props.session.getCurrentUser.username,
    }));
  }, [props.session.getCurrentUser.username]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setState({
      ...state,
      [name]: value,
    });
  };

  const handleSubmit = (event, addRecipe) => {
    event.preventDefault();
    addRecipe().then(({ data }) => {
      console.log(data);
      clearState();
      props.history.push('/');
    });
  };

  const validateForm = () => {
    const { name, category, description, instructions } = state;
    const isInvalid = !name || !category || !description || !instructions;
    return isInvalid;
  };

  const clearState = () => {
    setState({ ...initialState });
  };

  // const updateCache = (cache, { data: { addRecipe } }) => {
  //   const { getAllRecipes } = cache.readQuery({ query: GET_ALL_RECIPES });

  //   cache.writeQuery({
  //     query: GET_ALL_RECIPES,
  //     data: {
  //       getAllRecipes: [addRecipe, ...getAllRecipes]
  //     }
  //   });
  // };

  const { name, category, description, instructions, username } = state;
  return (
    <Mutation
      mutation={ADD_RECIPE}
      variables={{ name, category, description, instructions, username }}
      refetchQueries={[{query: GET_ALL_RECIPES}]}
      // update={updateCache}
    >
      {(addRecipe, { data, loading, error }) => {
        return (
          <div className="App">
            <h2 className="App">Add Recipe</h2>
            <form
              className="form"
              onSubmit={(event) => handleSubmit(event, addRecipe)}
            >
              <input
                type="text"
                name="name"
                placeholder="Recipe Name"
                onChange={handleChange}
                value={name}
              />

              <select name="category" onChange={handleChange} value={category}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
              </select>

              <input
                type="text"
                name="description"
                placeholder="Add description"
                onChange={handleChange}
                value={description}
              />

              <textarea
                name="instructions"
                placeholder="Add instructions"
                onChange={handleChange}
                value={instructions}
              ></textarea>

              <button
                disabled={loading || validateForm()}
                type="submit"
                className="button-primary"
              >
                Submit
              </button>
              {error && <Error error={error} />}
            </form>
          </div>
        );
      }}
    </Mutation>
  );
};

export default withRouter(AddRecipe);
