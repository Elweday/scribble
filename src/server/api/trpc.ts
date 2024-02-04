/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";
import EventEmitter from "events";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";



const ee = new EventEmitter()

export const createTRPCContext = async (_opts: CreateNextContextOptions ) => {
  // const gameId = opts.headers.get("gameId");
  const { req, res } = _opts
  return {
    db,
    ee,
    req,
    res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;



const isAuthed = t.middleware(async ({ ctx, next }) => {
  const token = ctx.req.headers["x-token"] as string;
  if (!token) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  const session = await ctx.db.session.findFirst({where: {token}, include: {player: true}}) 
  if (!session) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  
  return next({
    ctx: {...ctx, session},
  });
}) 


export const protectedProcedure = t.procedure.use(isAuthed);

