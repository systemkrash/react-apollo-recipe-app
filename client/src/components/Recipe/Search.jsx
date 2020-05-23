import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';

import SearchItem from './SearchItem';

import { SEARCH_RECIPES } from '../../queries/index';

const Search = () => {
  const client = useApolloClient();
  const [state, setState] = useState({ searchResults: [] });
  const {searchResults} = state;

  const handleChange = ({searchRecipes}) => {
    setState({
      searchResults: searchRecipes
    });
  };

  return (
    <div className="App">
      <input
        type="search"
        placeholder="Search for Recipes"
        onChange={async (event) => {
          event.persist();
          const { data } = await client.query({
            query: SEARCH_RECIPES,
            variables: { searchTerm: event.target.value },
          });
          handleChange(data);
        }}
      />
      <ul>
        {searchResults.map((recipe) => {
          return (
            <SearchItem key={recipe.id} {...recipe} />
          );
        })}
      </ul>
    </div>
  );
};

export default Search;
