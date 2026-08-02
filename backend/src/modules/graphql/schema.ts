// GraphQL schema for trove

import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Item {
    id: ID!
    title: String!
    description: String
    price: Float!
    category: String!
    tags: [String!]!
    inStock: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    itemCount: Int!
  }

  type Query {
    item(id: ID!): Item
    items(category: String, search: String, limit: Int, offset: Int): [Item!]!
    categories: [Category!]!
  }

  type Mutation {
    createItem(title: String!, description: String, price: Float!, category: String!, tags: [String!]!): Item!
    updateItem(id: ID!, title: String, description: String, price: Float, category: String, tags: [String!]): Item!
    deleteItem(id: ID!): Boolean!
  }

  type Subscription {
    itemCreated: Item!
    itemUpdated: Item!
    itemDeleted: ID!
  }
`;
