import { externalApiRouter } from "~/server/api/routers/external";
import { roomRouter } from "./routers/room";
import { createTRPCRouter } from "~/server/api/trpc";
import { actionSchema as drawActionSchema } from "~/constants/draw";
import { actionSchema as gameActionSchema } from "~/constants/game";
import { guessActionSchema } from "~/constants/guess";
import { createRealtimeRouter } from "./realtime";

export const appRouter = createTRPCRouter({
  room: roomRouter,
  external: externalApiRouter, 
  draw: createRealtimeRouter(drawActionSchema),
  gameState: createRealtimeRouter(gameActionSchema),
  guess: createRealtimeRouter(guessActionSchema),
});

// export type definition of API
export type AppRouter = typeof appRouter;


