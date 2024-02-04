import { z } from "zod";

export const GAME_ID_LENGTH = 10;

export const COLOR_PALETTE  = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FFA500",
    "#800080",
    "#A52A2A",
    "#FFC0CB",
    "#00FFFF",
  ];

const ACTION_TYPES = ["START", "DRAW", "STOP", "CLEAR", "COLOR", "WIDTH", "POINT", "UNDO"] as const;

export const stateSchema = z.object({
    color: z.string(),
    width: z.number(),
    drawing: z.boolean(),
    x: z.number(),
    y: z.number(),
    history: z.array(z.any()).default([]),
    historyIndex: z.number(),
})

export type State = z.infer<typeof stateSchema>

export const actionSchema = z.object({
    type: z.enum(ACTION_TYPES),
    payload: stateSchema.extend({
        event: z.string(),
    }).partial().optional(),
})

export type Action = z.infer<typeof actionSchema>

