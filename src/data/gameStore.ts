import { useSyncedStore, } from "@syncedstore/react";
import { getRandomWords } from "./words";
import { store, Events, Player, connect, local, Event, initialState, delays, ExtractPaload } from "~/constants/game";
import { observeDeep } from "@syncedstore/core";

function oneOf<T>(items: T[]){
    return items[Math.floor(Math.random() * items.length)] as T; 
}


type Guard = keyof ReturnType<typeof guards>;

const is = (guard: Guard) => {
    const conds = guards(store.state); 
    const cond = conds[guard]
    return cond ? cond() : false
};

function repeat(params: {run: () => void, every: number, untill: Guard, delay?: number}) {
    setTimeout(() => {
        if (!is(params.untill)) {
            params.run();
            repeat({...params, delay: undefined})
        }
    }, params.delay || params.every)
}

const guards = (state: typeof store.state) => ({
    "round_running": () => state.value === "game.running" && state.context.remainingTime > 0,
    "game_running": () => state.value === "game.running",
    "myturn": () =>  state.context.currentDrawer === local.atom.get().id,
    "leaderboard": () => state.value == "game.round_ended" || state.value == "done",
    "lobby": () => state.value === "lobby",
    "owner": () => state.context.owner === local.atom.get().id,
    "all_guessed": () => Object.entries(state.context.players).filter(([id, _])=>id !== state.context.currentDrawer).every(([_, p])=>p.guessed),
    "time_up": () => state.context.remainingTime <= 0,
    "round_over": () =>  state.value === "game.round_ended",
    "word_choosing": ()=> state.value === "game.word_choosing",
    "rounds_not_over": ()=> state.context.roundsLeft > 0,
    "has_players": () => Object.keys(state.context.players).length > 0,
    "enough_players": () => Object.keys(state.context.players).length > 1,
    "room_not_full": () => Object.keys(state.context.players).length >= state.context.config.maxPlayers,
    "has_owner" : () => state.context.owner !== "",
    "word_choosing_ruuning": () => state.context.word_choosing_time > 0,
    "game_over": () => state.value === "done",
    "owner_in_room": () =>  Object.keys(state.context.players).includes(state.context.owner),
}) as const; 


const actions: Events =  {
    create_room: ({ payload }) => {
        store.state.context.gameId = payload.roomId;  
        store.state.context.owner = local.get("id");
        local.set("error", null); 
    },

    start_game: ({ payload }) => {
        store.state.context.gameId = payload.gameId
        store.state.context.currentDrawer = store.state.context.owner
        store.state.context.roundsLeft = store.state.context.config.rounds;
        store.state.context.remainingTime = store.state.context.config.roundTime;
        Object.values(store.state.context.players).map(p => p.score = 0);
        store.state.context.guesses = []
        repeat({
            run: ()=> send({ type: "decrement_time" }),
            every: 1000,
            untill: "game_over"
        });
        send({ type: "start_word_choosing" })
    },
    end_game: () => {
        store.state.value = "done";
    },
    start_round: () => {
        store.state.canvas = initialState.canvas
        store.state.value = "game.running"
    },
    calculate_increase: () => {
        const players = Object.entries(store.state.context.players);
        const guessers = players
            .filter(([id, player])=> player.guessed && (id !== store.state.context.currentDrawer))
            .sort(([__,  a], [_, b])=> ((a.timeStamp as number ) -( b.timeStamp as number)));
        const nguessers = guessers.length;
        const nplayers = players.length;
        const ROUND_TIME = store.state.context.config.roundTime;
        const BASE_SCORE = 100;
        const THRESHOLD = 0.15;
        const MAX_SCORE = 300;
        const EXPONENT = Math.log(BASE_SCORE/MAX_SCORE) / -ROUND_TIME;

        
        if (nguessers === 0) {
            // @ts-ignore
            store.state.context.players[store.state.context.currentDrawer].increase = -BASE_SCORE;
            return;
        }
        guessers.forEach(([id, player], idx)=>{
            const weighted_time = (1-THRESHOLD) * store.state.context.config.roundTime;
            if (nguessers === 1 && nplayers > 1) {
                player.increase = MAX_SCORE
            } else if (store.state.context.remainingTime >= weighted_time){
                player.increase = MAX_SCORE
            } else {
                const elapsed = ROUND_TIME - store.state.context.remainingTime;
                const score = Math.floor(BASE_SCORE * Math.exp(-EXPONENT * elapsed));
                player.increase = score;
            }
        });
        // @ts-ignore
        store.state.context.players[store.state.context.currentDrawer].increase = Math.floor(nguessers/nplayers * MAX_SCORE) ;
    },
    update_scores: () => {
        Object.values(store.state.context.players).forEach((p) => {
            const unit = p.increase > 0 ? 1 : (p.increase < 0) ? -1 : 0;
            p.increase -= unit
            p.score += unit
        })
},
    update_drawer: () => {
        const keys = Object.keys(store.state.context.players)
        const drawerIndex = keys.findIndex((id)=>id === store.state.context.currentDrawer);
        const index = (drawerIndex + 1) % keys.length;
        store.state.context.currentDrawer = keys[index] as string;  
    },
    reset_players: () => {
        Object.keys(store.state.context.players).forEach((id) => {
            const player = store.state.context.players[id] as Player;
            player.guessed = false;
            player.drawingRating = undefined;
            player.timeStamp = undefined;
        })
        // @ts-ignore

        const drawer = store.state.context.players[store.state.context.currentDrawer] as Player;
        drawer.guessed = true;
    },
    end_round: () => {
        send({ type: "calculate_increase" })
        send({ type: "update_drawer" })
        send({ type: "reset_players" })
        repeat({
            run: () => send({ type: "update_scores" }),
            every: 20,
            untill: "word_choosing_ruuning",
            delay: 1000
        })
        waitFor("leaderboard")(()=>{
            send ({ type: is("rounds_not_over") ? "start_word_choosing" : "end_game" })
        })
        store.state.value = "game.round_ended";
        store.state.context.roundsLeft -= 1;
        store.state.context.remainingTime = store.state.context.config.roundTime;

    },
    choose_word: ({ payload }) => {
        store.state.value = "game.running"
        store.state.context.currentWord = payload.word;
        send({type: "start_round"})
    },
    pick_random_word:  () => {
        send( { type: "choose_word", word: oneOf(store.state.context.wordOptions) } )
    },
    join: ({ payload })=>{
        local.set("id", payload.id);
        connect(payload.roomId);
        store.state.context.players[payload.id] = { name: payload.name, avatar: payload.avatar, score: 0, guessed: false, increase: 0 };
    },
    leave: ({ payload }) => {
        const id = local.get("id");
        const isOwner = store.state.context.owner === id;
        if (isOwner) {
            const owner = Object.keys(store.state.context.players).find((id)=>id!== store.state.context.owner) as string;
            store.state.context.owner = owner;
        }
        Object.hasOwn(store.state.context.players, id) ? delete store.state.context.players[id] : null;
        local.get("conn")?.disconnect();
    },
    rate_drawing: ({  payload }) => {
        (store.state.context.players[payload.player_id] as Player).drawingRating = payload.rating;
    },
    guess: ({ payload }) => {
        const player = store.state.context.players[payload.id];
        if (!player) return;
        const newGuess = {word: payload.word, id: payload.id, round:  store.state.context.config.rounds - store.state.context.roundsLeft, timestamp: store.state.context.remainingTime};
        store.state.context?.guesses.push(newGuess);
        const correct = store.state.context.currentWord === payload.word;
        if (!player.guessed && correct && store.state.context.players[payload.id]) {
            player.guessed = true;
            player.timeStamp = store.state.context.remainingTime;
        }
    },
    decrement_time: () => {
        if(is("round_running")) {
            store.state.context.remainingTime -= 1;
        } 
        if (is("word_choosing") && is("word_choosing_ruuning")) {
            store.state.context.word_choosing_time -= 1;
        }
    },
    start_word_choosing: ()=>{
        const context = store.state.context;
        context.wordOptions = getRandomWords(3);
        context.word_choosing_time = delays.word_choosing / 1000;
        store.state.value = "game.word_choosing";
    },
    remove_room: () => {
        const conn = local.get("conn");
        conn?.doc.destroy();
        conn?.destroy();
    }
}

const send = (event: Event) => {
    const action = actions[event.type];
    const { type, ...payload } = event; 
    if (!action) {
      throw new Error(`Unknown event type: ${event.type}`);
    }
    // @ts-ignore
    action({ payload });
}

const waitFor = (delay: ((keyof typeof delays) | number) ) => {
    const time = (typeof delay === "string") ? delays[delay] : delay;
    return (cb: () => void) =>  setTimeout(cb, time)
}

const rules: Record<string, () => boolean> = {
    "ENSURE_PLAYERS_COUNT": () => {
        if (!is("lobby") && !is("enough_players")) {
            store.state.value = "lobby";
            return true
        }
        return false
    },
    "ENSURE_OWNER": () => {
        if (is("has_players") && (!is("has_owner") || !is("owner_in_room") )) {
            store.state.context.owner = Object.keys(store.state.context.players)[0] as string;
            return true
        }
        return false 
    },
    "ENSURE_ROUND_END": () => {
        if ( is("game_running")  && (is("all_guessed") || is("time_up"))) {
            console.log(store.state.value, store.state.context.remainingTime )
            send({ type: "end_round" });
            return true
        }
        return false
    },
    "ENSURE_WORD_CHOSEN": () => {
        if (is("word_choosing") && !is("word_choosing_ruuning")){
            send({ type: "pick_random_word" });
            return true
        }
        return false
    },
    "ENSURE_DESTROYED": () => {
        if (!is("has_players")) {
            waitFor(5000)(()=>{
                if (!is("has_players")) {
                    send({ type: "remove_room" });
                }
            })
            return true
        }
        return false
    }
}

observeDeep(store, ()=>{
    Object.entries(rules).forEach(([ruleName, rule]) => {
        const success = rule()
        if (success) {
            console.log(" Game rule succeeded ", ruleName)
        }
    });
})

export const useGameSyncedStore = () => {
    const { state } = useSyncedStore(store);
    
    const is = (key: Guard) => {
        const conds = guards(state); 
        const cond = conds[key]
        return cond ? cond() : false
    };
    const me = local.use();

    return {state, send, me, is} as const;
};
