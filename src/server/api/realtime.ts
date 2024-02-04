import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { observable } from '@trpc/server/observable';

type Protected<T> = T & { gameId: string };

type Callback<Data extends z.AnyZodObject> = ((data: Protected<z.infer<Data>>) => void) | undefined;

interface RouterOptions<Data extends z.AnyZodObject> {
    subscriptionCallback: Callback<Data>;
    mutationCallback: Callback<Data>;
}

function createSubscription<T extends z.AnyZodObject>(evtName: string, inputSchema: T, subscriptionCallback?: Callback<T>) {
    return publicProcedure
        .input(z.object({
            gameId: z.string(),
        }))
        .subscription(({ ctx, input }) => {
            return observable<z.infer<T>>((emit) => {
                const listener = (data: Protected<z.infer<T>>) => {
                    subscriptionCallback && subscriptionCallback(data);
                    if (data.gameId === input.gameId){
                        emit.next(data);
                    }           
                };
                ctx.ee.on(evtName, listener);
                return () => {
                    ctx.ee.off(evtName, listener);
                };
            });
        })
}

function createRealtimeMutation<T extends z.AnyZodObject>(evtName: string, inputSchema: T, mutationCallback?: Callback<T>) {
    return publicProcedure
        .input(inputSchema.extend({ gameId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            ctx.ee.emit(evtName, input as Protected<z.infer<T>>);
            return input as z.infer<T>;
        });
}



export function createRealtimeRouter<T extends z.AnyZodObject>(inputSchema: T, options?: RouterOptions<T>) {
    const eventName = Math.random().toString(36);
    return createTRPCRouter({
        subscription: createSubscription(eventName, inputSchema, options?.subscriptionCallback),
        mutation: createRealtimeMutation(eventName, inputSchema, options?.mutationCallback),
    });
}
