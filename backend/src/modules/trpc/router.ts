// tRPC router for trove

import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

export const router = t.router({
  item: t.router({
    byId: t.procedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        return ctx.itemAPI.getItemById(input.id);
      }),
    
    create: t.procedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        price: z.number(),
        category: z.string(),
        tags: z.array(z.string())
      }))
      .mutation(async ({ input, ctx }) => {
        return ctx.itemAPI.createItem(input);
      }),
    
    update: t.procedure
      .input(z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional()
      }))
      .mutation(async ({ input, ctx }) => {
        return ctx.itemAPI.updateItem(input.id, input);
      }),
    
    delete: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return ctx.itemAPI.deleteItem(input.id);
      }),
    
    list: t.procedure
      .input(z.object({
        category: z.string().optional(),
        limit: z.number().optional().default(20),
        offset: z.number().optional().default(0)
      }))
      .query(async ({ input, ctx }) => {
        return ctx.itemAPI.listItems(input.category, input.limit, input.offset);
      })
  }),

  search: t.router({
    items: t.procedure
      .input(z.object({
        query: z.string(),
        limit: z.number().optional().default(20)
      }))
      .query(async ({ input, ctx }) => {
        return ctx.searchAPI.searchItems(input.query, input.limit);
      })
  }),

  category: t.router({
    list: t.procedure
      .query(async ({ ctx }) => {
        return ctx.categoryAPI.listCategories();
      })
  })
});

export type AppRouter = typeof router;
