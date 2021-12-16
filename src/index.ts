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
  type Mutation {
    addBook(title: String, author: String): Book
  }
`;

const resolvers = {
  Query: {
    books: async () => {
      return await Book.find();
    },
  },
  Mutation: {
    addBook: async (_: undefined, args: { title: String; author: String }) => {
      return await Book.create(args);
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
