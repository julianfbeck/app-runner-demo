import { createRouter } from "./context";
import { z } from "zod";

export const messageRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany();
    },
  })
  .mutation("create", {
    input: z.object({
      text: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.message.create({
        data: {
          text: input.text,
        },
      });
    },
  });
