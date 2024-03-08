
import { z } from "zod";

const ACTION_TYPES = ["CUSTOM", "START_GAME", "NEXT_PLAYER", "END_GAME", "CHOOSE_WORD", "DRAWING_DONE", "GUESS", "GAME_CREATE"] as const;
const SCREENS = ["LOBBY", "DRAWING", "WORD_CHOOSING", "SCORES", "END"] as const;

export const stateSchema = z.object({
    public: z.boolean().default(false),
    gameId: z.string().length(10),
    gameStarted : z.boolean(),
    remainingTime: z.number(), 
    currentRound: z.number(),
    currentWord: z.string().optional(),
    currentScreen: z.enum(SCREENS),
    drawingPlayerIndex: z.number(),
    hints: z.number().optional(),
    maxPlayers: z.number(),
    rounds: z.number(), 
    drawingTime: z.number(),
    players: z.array(
        z.object({
            name: z.string(),
            score: z.number(),
            avatar: z.string(),
            guessed: z.boolean(),
        })
    ),

})

export type State = z.infer<typeof stateSchema>

export const actionSchema = z.object({
    type: z.enum(ACTION_TYPES),
    payload: stateSchema.partial().optional(),
})


export type Action = z.infer<typeof actionSchema>

