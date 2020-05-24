const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { GraphQLDateTime } = require('graphql-iso-date');

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;

  return jwt.sign({ username, email }, secret, { expiresIn });
};

exports.resolvers = {
  Date: GraphQLDateTime,
  Query: {
    getAllRecipes: async (root, args, { Recipe }) => {
      return await Recipe.find().sort({
        createdDate: 'desc',
      });
    },
    getRecipe: async (root, { id }, { Recipe }) => {
      return await Recipe.findById(id);
    },
    searchRecipes: async (root, { searchTerm }, { Recipe }) => {
      if (searchTerm) {
        // search
        const searchResults = await Recipe.find(
          {
            $text: { $search: searchTerm },
          },
          {
            score: { $meta: 'textScore' },
          }
        ).sort({
          score: { $meta: 'textScore' },
        });

        return searchResults;
      } else {
        const recipes = await Recipe.find().sort({
          likes: 'DESC',
          createdDate: 'DESC',
        });

        return recipes;
      }
    },

    getUserRecipes: async (root, { username }, { Recipe }) => {
      const userRecipes = await Recipe.find({ username }).sort({
        createdDate: 'DESC',
      });

      return userRecipes;
    },
    getCurrentUser: async (root, args, { currentUser, User }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: 'favorites',
        model: 'Recipe',
      });

      return user;
    },
  },
  Mutation: {
    addRecipe: async (
      root,
      { name, description, category, instructions, username },
      { Recipe }
    ) => {
      const newRecipe = await new Recipe({
        name,
        description,
        category,
        instructions,
        username,
      }).save();

      return newRecipe;
    },
    deleteUserRecipe: async (root, { id }, { Recipe }) => {
      const recipe = await Recipe.findByIdAndRemove(id);
      return recipe;
    },
    likeRecipe: async (root, { id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findByIdAndUpdate(id, { $inc: { likes: 1 } });
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: id } }
      );

      return recipe;
    },
    unlikeRecipe: async (root, { id, username }, { Recipe, User }) => {
      const recipe = await Recipe.findByIdAndUpdate(id, { $inc: { likes: -1 } });
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: id } }
      );

      return recipe;
    },

    signinUser: async (root, { username, password }, { User }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      return { token: createToken(user, process.env.SECRET, '1hr') };
    },

    signupUser: async (root, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });

      if (user) {
        throw new Error('User already exists');
      }

      const newUser = await User({
        username,
        email,
        password,
      }).save();

      return { token: createToken(newUser, process.env.SECRET, '1hr') };
    },
  },
};
