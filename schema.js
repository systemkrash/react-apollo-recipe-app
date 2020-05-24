const { gql } = require('apollo-server-express');

exports.typeDefs = gql`
  scalar Date

  type Recipe {
    id: ID
    name: String!
    category: String!
    description: String!
    instructions: String!
    createdDate: Date
    likes: Int
    username: String
  }

  type User {
    id: ID
    username: String!
    password: String!
    email: String!
    joinDate: Date
    favorites: [Recipe]
  }

  type Token {
    token: String!
  }

  type Query {
    getAllRecipes: [Recipe]
    getRecipe(id: ID!): Recipe
    searchRecipes(searchTerm: String): [Recipe]

    getCurrentUser: User
    getUserRecipes(username: String!): [Recipe]
  }

  type Mutation {
    addRecipe(
      name: String!
      description: String!
      category: String!
      instructions: String!
      username: String
    ): Recipe

    deleteUserRecipe(id: ID!): Recipe

    signinUser(username: String!, password: String!): Token

    signupUser(username: String!, email: String!, password: String!): Token
  }
`;
