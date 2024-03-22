
import { AvatarName } from "./avatars";
import { getYjsDoc, boxed, Box } from "@syncedstore/core";
import { storedAtom } from "~/hooks/localAtom";
import syncedStore from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import {avatars} from "~/constants/avatars";
import { Opts, Paths, Points } from "./draw";
import { v4 as uuidv4 } from "uuid";



export const meta = {
    name: "Wordoodle",
    description: "Play Wordoodle with your friends",
    link: "https://wordoodle.vercel.app/",
} 



const randomAvatar = () => {
    const idx = Math.random() * avatars.length;
    return avatars[Math.floor(idx)] as AvatarName;
}
  
const getRandomUser = () => {
    const idx = Math.floor(Math.random() * 200).toString().padStart(3, "0");
    return `user-${idx}`;
}


type Local = {
    id: string;
    name: string;
    avatar: AvatarName;
    error: string | null,
    conn: WebsocketProvider | null, 
}
export const local = storedAtom<Local>({
    id: uuidv4(),
    name: getRandomUser(),
    avatar: randomAvatar(),
    error: null,
    conn: null
}, {prefix: "_wordoodle_", storedKeys: ["avatar", "name", "id"]});

export const delays = {
    "word_choosing": 15000,
    "leaderboard" : 5000,
}

export const store = syncedStore({ state: {} as State}) as {state: State};
const doc = getYjsDoc(store);


export const connect = (roomId: string) => {
    const conn = new WebsocketProvider('wss://demos.yjs.dev/ws', roomId, doc, );
    local.set("conn", conn);
}

type StateValue = "lobby" | "game.word_choosing" | "game.running" | "game.round_ended" | "done" 

export const difficulties = ["easy", "medium", "hard"] as const;
type difficulty = typeof difficulties[number];

export const locales = ["en", "ar"] as const;

type locale = typeof locales[number];

type Guess = {
    word: string;
    id: string;
    round: number;
    timestamp: number;
}

export type Player = {
  name: string;
  avatar: AvatarName;
  score: number;
  increase: number;
  guessed: boolean;  
  drawingRating?: number;
  timeStamp?: number;
}
    
export type Context = {
  gameId: string;
  players: Record<string, Player>;
  config: {
    maxPlayers: number;
    hints: number;
    roundTime: number;
    rounds: number;
    difficulty: difficulty;
    locale: locale;
  }
  roundsLeft: number;
  currentWord: string;
  currentDrawer: string;
  remainingTime: number;
  guesses: Guess[];
  wordOptions: string[];
  owner: string;
  word_choosing_time: number;
}

export type Event = (
| { type: "guess"; word: string; id: string }
| { type: "start_game"; gameId: string; }
| { type: "word_chosen"; word: string }
| { type: "rate_drawing"; rating: number; player_id: number }
| { type: "leave"; id: string }
| { type: "set_me"; id: string; }
| { type: "start_round"; }
| { type: "choose_word"; word: string; }
| { type: "get_words" }
| { type: "pick_random_word" }
| { type: "remove_options" }
| { type: "join"; roomId: string; name: string; avatar: AvatarName; id: string }
| { type: "remove_player"; id: string; }
| { type: "end_game" }
| { type: "end_round" }
| { type: "decrement_time" }
| { type: "done" }
| { type: "add_path" }
| { type: "clear_canvas" }
| { type: "undo" }
| { type: "draw"; paths: Paths[0] } 
| { type: "start_word_choosing" }
| { type: "update_scores" }
| { type: "update_drawer" }
| { type: "reset_players" }
| { type: "create_room"; roomId: string; }
| { type: "remove_room"; }
| { type: "calculate_increase" }
)


type EventName = Event["type"]
export type ExtractPaload<T extends EventName> = Omit<Extract<Event, { type: T }>, "type">;
export type Events = Partial<{
    [K in EventName]: (
        cb: {
            payload: ExtractPaload<K>,
        }) => void
}>

export type State = {
    value: StateValue;
    context: Context;
    canvas: {
        paths: Paths,
        points: Points,
        opts: Opts
      };
    
}

const defaultOpts = {
    color: "#fffff",
    size: 15,
    thinning: 0,
    opacity: 1,
}

export const initialState: State = {
    value: "lobby",
    canvas: {
        paths: [[ [] , defaultOpts]],
        points: [],
        opts: defaultOpts,
    },
    context: {
        config: {
            maxPlayers: 8,
            hints: 2,
            roundTime: 100,
            rounds: 5,
            difficulty: "medium",
            locale: "en",
        },
        gameId: "",
        players: {},
        guesses: [],
        wordOptions: [],
        roundsLeft: 0,
        remainingTime: 0,
        currentWord: "",
        currentDrawer: "",
        owner: "",
        word_choosing_time: delays.word_choosing / 1000
    }
};

store.state.context = initialState.context;
store.state.value = initialState.value;
store.state.canvas = initialState.canvas;

local.atom.subscribe(({id, avatar, name})=>{
    if (store.state.context.players[id]) {
        // @ts-ignore
        store.state.context.players[id].avatar = avatar
        // @ts-ignore
        store.state.context.players[id].name = name
    }
})
