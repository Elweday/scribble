import { z } from "zod";
import { Box } from "@syncedstore/core";

export const GAME_ID_LENGTH = 10;
// convert this type to zod 

export const COLOR_PALETTE  = [
    "#000000",
    "#FFFFFF",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#A52A2A",
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
    action: z.enum(ACTION_TYPES),
    payload: stateSchema.extend({
        event: z.string(),
    }).partial().optional(),
})

export type Action = z.infer<typeof actionSchema>

export type Point = [number, number, number]

export type Points = Point[]

export type Paths = [Points, Opts][]

export type Opts = {
  size: number,
  thinning: number,
  color: string,
  opacity: number,
}