import gql from "graphql-tag";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String
    published: Boolean!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createUser(email: String!, name: String): User!
    createPost(
      title: String!
      content: String
      published: Boolean
      authorId: ID!
    ): Post!
    updatePost(
      id: ID!
      title: String
      content: String
      published: Boolean
    ): Post!
    deletePost(id: ID!): Post!
  }
`;
