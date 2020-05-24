const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: 'variables.env' });

const Recipe = require('./models/Recipe');
const User = require('./models/User');

// Bring in GraphQL Express middleware
const { ApolloServer, gql } = require('apollo-server-express');

const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');

// Connects to database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.error(err));

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req: {currentUser}}) => ({
    Recipe,
    User,
    currentUser
  })
});

// Initializes application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://172.18.0.3:3000',
  credentials: true
}));

// Set up JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers['authorization'];
  if(token !== "null") {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch(err) {
      // console.error(err);
    }
  }
  next();
});

// Create GraphiQL application
server.applyMiddleware({ app });

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
