// GraphQL resolvers for trove

import { PubSub } from 'apollo-server-express';

const pubsub = new PubSub();

export const resolvers = {
  Query: {
    item: async (_: any, { id }: any, { dataSources }: any) => {
      return dataSources.itemAPI.getItemById(id);
    },
    items: async (_: any, { category, search, limit = 20, offset = 0 }: any, { dataSources }: any) => {
      if (search) {
        return dataSources.searchAPI.searchItems(search, limit);
      }
      return dataSources.itemAPI.listItems(category, limit, offset);
    },
    categories: async (_: any, __: any, { dataSources }: any) => {
      return dataSources.categoryAPI.listCategories();
    }
  },
  Mutation: {
    createItem: async (_: any, itemData: any, { dataSources }: any) => {
      const item = await dataSources.itemAPI.createItem(itemData);
      pubsub.publish('ITEM_CREATED', { itemCreated: item });
      return item;
    },
    updateItem: async (_: any, { id, ...updates }: any, { dataSources }: any) => {
      const item = await dataSources.itemAPI.updateItem(id, updates);
      pubsub.publish('ITEM_UPDATED', { itemUpdated: item });
      return item;
    },
    deleteItem: async (_: any, { id }: any, { dataSources }: any) => {
      await dataSources.itemAPI.deleteItem(id);
      pubsub.publish('ITEM_DELETED', { itemDeleted: id });
      return true;
    }
  },
  Subscription: {
    itemCreated: {
      subscribe: () => pubsub.asyncIterator(['ITEM_CREATED'])
    },
    itemUpdated: {
      subscribe: () => pubsub.asyncIterator(['ITEM_UPDATED'])
    },
    itemDeleted: {
      subscribe: () => pubsub.asyncIterator(['ITEM_DELETED'])
    }
  }
};
