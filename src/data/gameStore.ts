import { AvatarName, avatars } from "~/constants/avatars";
import { getYjsDoc, syncedStore, Box, boxed  } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { useSyncedStore } from "@syncedstore/react";
import { atom } from 'nanostores'
import { useStore } from '@nanostores/react'
import { getRandomWords } from "./words";

const playerAtom = atom<string>("");

export const store = syncedStore({ state: {} as State}) as {state: State};
const doc = getYjsDoc(store);

const rooms = new Map<string, WebrtcProvider>();

const connect = (roomId: string) => {
    if (rooms.has(roomId)) {
        return rooms.get(roomId) as WebrtcProvider;
    }
    const rtc = new WebrtcProvider(roomId, doc, {
         signaling: ["ws://localhost:9999"],
         peerOpts: { initiator: true,  }
    });
    rooms.set(roomId, rtc);
    return rtc;
}

const states = [
  "lobby",
  "game.word_choosing",
  "game.running",
  "game.round_ended",
  "done",
] as const;

type StateValue = typeof states[number];


type Guess = {
    word: string;
    playerName: string;
    avatar: string;
}

type Player = {
  name: string;
  avatar: AvatarName;
  score: number;
  guessed: boolean;  
  drawingRating?: number;
  timeStamp?: number;
}
    
type Context = {
  gameId: string;
  players: Record<string, Player>;
  roundsLeft: number;
  currentWord: string;
  currentDrawer: string;
  remainingTime: number;
  roundTime: number;
  rounds: number;
  guesses: Guess[];
  wordOptions: string[];
  maxPlayers: number;
  hints: number;
  owner: string;
  me: Box<string>;
}

type Event = (
| { type: "guess"; word: string; id: string }
| { type: "start_game"; gameId: string; }
| { type: "word_chosen"; word: string }
| { type: "restart_game" }
| { type: "rate_drawing"; rating: number; player_id: number }
| { type: "leave"; id: string }
| { type: "set_me"; id: string; }
| { type: "start_round"; }
| { type: "end_round" }
| { type: "choose_word"; word: string; }
| { type: "get_words" }
| { type: "pick_random_word" }
| { type: "remove_options" }
| { type: "join"; roomId: string; name: string; avatar: AvatarName; }
| { type: "remove_player"; id: string; }
| { type: "end_game" }
| { type: "end_round" }
| { type: "decrement_time" }
)


type EventName = Event["type"]
type ExtractPaload<T extends EventName> = Omit<Extract<Event, { type: T }>, "type">;
type Events = Partial<{
    [K in EventName]: (
        cb: {
            payload: ExtractPaload<K>,
        }) => void
}>

type State = {
    value: StateValue;
    context: Context;
}


const initialState: State = {
    value: "lobby",
    context: {
        maxPlayers: 8,
        hints: 2,
        gameId: "",
        players: {},
        guesses: [],
        wordOptions: [],
        roundsLeft: 0,
        rounds: 5,
        roundTime: 100,
        remainingTime: 0,
        currentWord: "",
        currentDrawer: "",
        owner: "",
        me: boxed("")
    }
};

store.state.context = initialState.context;
store.state.value = initialState.value;




const actions: Events =  {
    start_game: ({ payload }) => {
        store.state.value = "game.word_choosing"
        store.state.context.gameId = payload.gameId
        store.state.context.currentDrawer = store.state.context.owner
        store.state.context.wordOptions = getRandomWords(3);
        store.state.context.roundsLeft = store.state.context.rounds;
    },
    start_round: () => {
        store.state.value = "game.running"
        store.state.context.remainingTime = store.state.context.roundTime;
        Object.keys(store.state.context.players).forEach((id) => {
            (store.state.context.players[id] as Player).drawingRating = undefined;
            (store.state.context.players[id] as Player).guessed = false;
            (store.state.context.players[id] as Player).timeStamp = undefined;
        })
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
        const rtc = connect(payload.roomId);
        rtc.on("peers", function({ removed }) {
            const peer = rtc.room?.peerId as string;
            playerAtom.set(peer);
            store.state.context.owner = Object.keys(store.state.context.players).length === 0 ? peer : store.state.context.owner;
            store.state.context.players[peer] = { name: payload.name, avatar: payload.avatar, score: 0, guessed: false };
            removed.forEach((id)=>{
                const isOwner = store.state.context.owner === id;
                if (isOwner) store.state.context.owner = Object.keys(store.state.context.players).find((id)=>id !== store.state.context.owner) as string;
                Object.hasOwn(store.state.context.players, id) ? delete store.state.context.players[id] : null;
            })
        }) 
    },
    rate_drawing: ({  payload }) => {
        (store.state.context.players[payload.player_id] as Player).drawingRating = payload.rating;
    },
    guess: ({ payload }) => {
        const player = store.state.context.players[payload.id];
        if (!player) return;
        const newGuess = {word: payload.word, playerName: player.name, avatar: player.avatar};
        store.state.context?.guesses.push(newGuess);
        if (!player.guessed){
            (store.state.context.players[payload.id] as Player).guessed = store.state.context.currentWord === payload.word;
            (store.state.context.players[payload.id] as Player).timeStamp = store.state.context.remainingTime;
        }
    },
    decrement_time: () => {
        store.state.context.remainingTime -= 1;
    },
    end_round: () => {
        store.state.value = "game.round_ended";
        store.state.context.remainingTime = 0;
        store.state.context.roundsLeft -= 1;
        const keys = Object.keys(store.state.context.players)
        const drawerIndex = keys.findIndex((id)=>id === store.state.context.currentDrawer);
        const index = (drawerIndex + 1) % keys.length;
        store.state.context.currentDrawer = keys[index] as string;
        Object.entries(store.state.context.players).forEach(([id, player])=>{
            if (store.state.context.players[id] && player.guessed) {
                (store.state.context.players[id] as Player).score +=  player.timeStamp as number;
            }
        });
        store.state.context.wordOptions = getRandomWords(3);
    }
}



export const useGameSyncedStore = () => {
    const { state } = useSyncedStore(store);
    const me = useStore(playerAtom);
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
        "myturn": () =>  state.context.currentDrawer === me,
        "leaderboard": () => state.value == "game.round_ended" || state.value == "done",
        "lobby": () => state.value === "lobby",
        "owner": () => state.context.owner === me,
        "round.done": () => state.value === "game.running" && (state.context.remainingTime === 0 || Object.values(store.state.context.players).every((p)=>p.guessed)),
        "can_start" : () =>  Object.values(state.context.players).length > 1 && state.context.owner === me,
        "word_choosing": ()=> state.value === "game.word_choosing",
    } as const; 
    const is = (key: keyof typeof checks) => checks[key]();
    const gameLoop = () => setInterval(()=>{
        if (is("round.running")) {
            send({ type: "decrement_time"});
        }
        if (is("round.done") ) {
            send({ type: "end_round"});
            setTimeout(()=>{
                store.state.value = "game.word_choosing"
            }, 5000)
        }
    }, 1000)

    return {state, send, gameLoop, me, is} as const;
};

export const randomAvatar = () => {
    const idx = Math.random() * avatars.length;
    return avatars[Math.floor(idx)] as AvatarName;
}
  
export const getRandomUser = () => {
    const idx = Math.floor(Math.random() * 200).toString().padStart(3, "0");
    return `user-${idx}`;
}