const express = require("express");
const path = require("path");

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

// import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { authMiddleware } = require("./utils/auth");
const { response } = require("express");

const PORT = process.env.PORT || 3001;
//const routes = require('./routes');

// Create an apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

//app.use(routes);

// Create a new instance of an Apollo server
const startApolloServer = async (typedefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);

      // log where we can test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the function to start the server
startApolloServer(typeDefs, resolvers);
