import { ApolloServer, gql } from "apollo-server";
import applyMongooseCache from "./mongoose.cache";
import Book from "./bookModel";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

applyMongooseCache();

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const resolvers = {
  Query: {
    books: async () => {
      return await Book.find();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginLandingPageGraphQLPlayground({
      // options
    }),
  ],
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
