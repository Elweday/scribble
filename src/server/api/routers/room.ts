import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const roomProcedure = publicProcedure
    .input(z.object({gameId: z.string(), playerId: z.string()}))
    .use(async ({ctx, input, next}) => {
        const player = await ctx.db.player.upsert({
            where: {id: input.playerId},
            update: {},
            create: {
                name: "Anonymous",
                avatar: "cuddles",
                id: input.playerId
            }   
        })
        return next({ctx: {...ctx, player}})
    })


export const roomRouter = createTRPCRouter({
    create: roomProcedure
        .input(z.object({public: z.boolean()}))
        .mutation(async ({ ctx, input }) => {
            const gameId = Math.random().toString(36).substring(2, 12)
            const game = await ctx.db.game.create({
                data: {
                    gameId,
                    public: input.public,
                    maxPlayers: 4,
                    rounds: 3,
                    drawingTime: 30,
                    hints: 0,
                    currentRound: 0,
                    currentScreen: "LOBBY",
                    currentWord: "",
                    drawingPlayerIndex: 0,
                    gameStarted: false,
                    remainingTime: 0,
                    players: {
                        connect: {id: ctx.player.id}
                    }
                }, include: {players: true}
            })
            return game
        }),
  join: roomProcedure
    .input(z.object({ name: z.string(), avatar: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const gameId = input.gameId;
        const game = await ctx.db.game.update({
            where: {gameId},
            include: {players: true},
            data: {
                players: {
                    connect: {id: ctx.player.id}
                }
            }
        })
        // ctx.ee.emit("players-changed", {type: "JOIN", player: {name: input.name, id:userId}, host: false} as PlayersChange)
        return game;
    }),
    start: roomProcedure
        .input(z.object({
            gameId: z.string(), 
            gameData: z.object({
                hints: z.number(),
                max_players: z.number(),
                nrounds: z.number(),
                guessingTime:z.number(),
            })
        }))
        .mutation(async ({ ctx, input }) => {
            const game = await ctx.db.game.update({
                where: {gameId: input.gameId},
                data: {
                    hints: input.gameData.hints,
                    maxPlayers: input.gameData.max_players,
                    rounds: input.gameData.nrounds,
                    drawingTime: input.gameData.guessingTime,
                    gameStarted: true
                }
            })
            return game;
        }),
});
