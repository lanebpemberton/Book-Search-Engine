const express = require('express');
//import apollo server
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

//import schema
const { typeDefs, resolvers } = require('./schemas');
// Import `authMiddleware()` function to be configured with the Apollo Server
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  //add auth middleware to server to authenticate calls
  context: authMiddleware,
});

//server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
