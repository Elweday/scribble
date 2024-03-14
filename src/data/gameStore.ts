import { AvatarName, avatars } from "~/constants/avatars";
import { useSyncedStore, } from "@syncedstore/react";

import { getRandomWords } from "./words";
import { store, Events, Player, connect, player, Event, initialState } from "~/constants/game";
import { observeDeep } from "@syncedstore/core";

const actions: Events =  {
    start_game: ({ payload }) => {
        store.state.value = "game.word_choosing"
        store.state.context.gameId = payload.gameId
        store.state.context.currentDrawer = store.state.context.owner
        store.state.context.wordOptions = getRandomWords(3);
        store.state.context.roundsLeft = store.state.context.config.rounds;
    },
    start_round: () => {
        store.state.canvas = initialState.canvas
        store.state.value = "game.running"
        store.state.context.remainingTime = store.state.context.config.roundTime;
        Object.keys(store.state.context.players).forEach((id) => {
            (store.state.context.players[id] as Player).drawingRating = undefined;
            (store.state.context.players[id] as Player).guessed = false;
            (store.state.context.players[id] as Player).timeStamp = undefined;
        })
        // @ts-ignore
        store.state.context.players[store.state.context.currentDrawer].guessed  = true 
    },
    end_round: () => {
        store.state.value = "game.round_ended";
        store.state.context.remainingTime = 0;
        store.state.context.roundsLeft -= 1;
        const BASE_SCORE = 50;
        
        const guessers = Object.entries(store.state.context.players)
            .filter(([id, player])=>player.guessed && id !== store.state.context.currentDrawer)
            // @ts-ignore
            .sort(([__,  a], [_, b])=> (b.timeStamp  - a.timeStamp) );
        const nguessers = guessers.length;
        guessers.forEach(([id, player], idx)=>{
            // @ts-ignore
            const prev = idx > 0 ? guessers[idx - 1][1].timeStamp : 0;
            // @ts-ignore
            const diff = player.timeStamp as number - prev;
            const scale = 1 - (diff / store.state.context.config.roundTime);
            (store.state.context.players[id] as Player).score +=  Math.floor(scale * nguessers * BASE_SCORE) ;
        });

        // @ts-ignore
        store.state.context.players[store.state.context.currentDrawer].score +=  BASE_SCORE * nguessers;

        const keys = Object.keys(store.state.context.players)
        const drawerIndex = keys.findIndex((id)=>id === store.state.context.currentDrawer);
        const index = (drawerIndex + 1) % keys.length;
        store.state.context.currentDrawer = keys[index] as string;
        store.state.context.wordOptions = getRandomWords(3);
    },
    choose_word: ({ payload }) => {
        store.state.value = "game.running"
        store.state.context.currentWord = payload.word;
    },
    pick_random_word:  () => {
        const index = Math.floor(Math.random() * store.state.context.wordOptions.length );
        const currentWord = store.state.context.wordOptions[index] as string;
        store.state.context.currentWord = currentWord;
        store.state.value = "game.running";
    },
    remove_options: () => {
        store.state.context.wordOptions = []
    },

    join: ({ payload })=>{
        connect(payload.roomId);
        player.atom.set({...player.atom.get(), id: payload.id});
        if (store.state.context.owner === "") {
            store.state.context.owner = payload.id;
        }
        store.state.context.players[payload.id] = { name: payload.name, avatar: payload.avatar, score: 0, guessed: false };
    },
    leave: ({ payload }) => {
        const id = player.atom.get().id;
        const isOwner = store.state.context.owner === id;
        if (isOwner) {
            const owner = Object.keys(store.state.context.players).find((id)=>id!== store.state.context.owner) as string;
            store.state.context.owner = owner;
        }
        Object.hasOwn(store.state.context.players, id) ? delete store.state.context.players[id] : null;
    },
    rate_drawing: ({  payload }) => {
        (store.state.context.players[payload.player_id] as Player).drawingRating = payload.rating;
    },
    guess: ({ payload }) => {
        const player = store.state.context.players[payload.id];
        if (!player) return;
        const newGuess = {word: payload.word, id: payload.id};
        store.state.context?.guesses.push(newGuess);
        if (!player.guessed){
            (store.state.context.players[payload.id] as Player).guessed = store.state.context.currentWord === payload.word;
            (store.state.context.players[payload.id] as Player).timeStamp = store.state.context.remainingTime;
        }
    },
    decrement_time: () => {
        store.state.context.remainingTime -= 1;
    },
}

export const useGameSyncedStore = () => {
    const { state } = useSyncedStore(store);
    const me = player.use();
    const send = (event: Event) => {
        const action = actions[event.type];
        if (!action) {
          throw new Error(`Unknown event type: ${event.type}`);
        }
        action({
          // @ts-ignore
          payload: event,
        });
    }
    const checks = {
        "round.running": () => state.value === "game.running" &&state.context.remainingTime > 0,
        "myturn": () =>  state.context.currentDrawer === me.id,
        "leaderboard": () => state.value == "game.round_ended" || state.value == "done",
        "lobby": () => state.value === "lobby",
        "owner": () => state.context.owner === me.id,
        "round.done": () => state.value === "game.running" && (state.context.remainingTime === 0 || Object.entries(store.state.context.players).filter(([id, _])=>id !== store.state.context.currentDrawer).every(([_, p])=>p.guessed)),
        "can_start" : () =>  Object.values(state.context.players).length > 1 && state.context.owner === me.id,
        "word_choosing": ()=> state.value === "game.word_choosing",
        "rounds_not_over": ()=> state.context.roundsLeft > 0,
    } as const; 
    const is = (key: keyof typeof checks) => checks[key]();
    const gameLoop = () => setInterval(()=>{
        if (is("round.running")) {
            send({ type: "decrement_time"});
        }
        if (is("round.done") ) {
            send({ type: "end_round"});
            if(is("rounds_not_over")) {
                if (!is("round.running")) {
                    setTimeout(()=>{
                        store.state.value = "game.word_choosing"
                    }, 5000)
                }
            }
            else {
                store.state.value = "done";
            }
        }
    }, 1000)

    return {state, send, gameLoop, me, is} as const;
};

/* observeDeep(store, ()=>{
    console.log(JSON.parse(JSON.stringify(store.state, null, 2)) as typeof store.state)
    Object.entries(store.state.context.players).forEach(([id, player])=>{
        console.log(`${id}, ${id === store.state.context.owner ? "owner" : "player"}`)
    })    

}) */