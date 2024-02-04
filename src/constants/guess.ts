import { z } from "zod";

export const guessActionSchema = z.object({
    guess: z.string(),
    userId: z.string(),
    correct: z.boolean(),
})


export const guessSchema = z.object({
    guesses: z.array(guessActionSchema),
})

export type GuessState = z.infer<typeof guessSchema>

export type GuessAction = z.infer<typeof guessActionSchema>

