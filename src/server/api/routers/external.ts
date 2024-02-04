

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
const wordSet = ["actually", "again", "almost", "already", "alright", "also", "always", "and", "angry", "animal"] as const;
const nameSet = ["Nala", "Sam", "Loki", "Pepper", "Cuddles", "Sassy","Daisy", "Boots"];
export const externalApiRouter = createTRPCRouter({
  word: publicProcedure
    .query(() => {
      const word = wordSet.at(Math.floor(Math.random()));
      return word;
    }), 
  
  name: publicProcedure
    .query(() => {
      return nameSet.sort(() => Math.random() - 0.5).at(0) as string;
    })

});
