import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import _db from "./_db.js";

const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!]
  }
  type Review {
    id: ID!
    rating: Int!
    content: String!
    author: Author!
    game: Game!
  }
type Author {
  id: ID!
  name: String!
  verified: Boolean!
  reviews: [Review!]
}
type Query {
    games: [Game]
    game(id: ID!): Game
    reviews: [Review]
    review(id: ID!): Review
    authors: [Author]
    author(id: ID!): Author
  }

`;

const resolvers = {
  Query: {
    games() {
      return _db.games;
    },
    game(_, args) {
      console.log(args, _);
      return _db.games.find((item) => item.id == args.id);
    },
  },
  Game: {
    reviews(parent) {
      return _db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return _db.reviews.filter((item) => item.author_id == parent.id);
    },
  },
  Review: {
    author(parent) {
      return _db.authors.find((item) => item.id == parent.author_id);
    },
    game(parent) {
      return _db.games.find((item) => item.id == parent.game_id);
    },
  },
};

// server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(url);
