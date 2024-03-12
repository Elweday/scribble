
import { AvatarName } from "./avatars";
import { getYjsDoc } from "@syncedstore/core";
import { storedAtom } from "~/hooks/localAtom";
import syncedStore from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { imageData } from "~/utils/imageData";

export const meta = {
    name: "Wordoodle",
    description: "Play Wordoodle with your friends",
    link: "https://wordoodle.vercel.app/",

} 


type Me = {
    id: string;
    name: string;
    avatar: AvatarName;
}
export const player = storedAtom<Me>({
    id: "",
    name: "",
    avatar: "arab"
}, {prefix: "_Wordoodle_"});



export const store = syncedStore({ state: {} as State}) as {state: State};
const doc = getYjsDoc(store);



const rooms = new Map<string, WebrtcProvider>();


export const connect = (roomId: string) => {
    if (rooms.has(roomId)) {
        return rooms.get(roomId)!;
    }
    const rtc = new WebrtcProvider(roomId, doc, {
        signaling: ['wss://demos.yjs.dev/ws']
    });
    rooms.set(roomId, rtc);
    return rtc;
}

type StateValue = "lobby" | "game.word_choosing" | "game.running" | "game.round_ended" | "done" 

export const difficulties = ["easy", "medium", "hard"] as const;
type difficulty = typeof difficulties[number];

export const locales = ["en", "ar"] as const;

type locale = typeof locales[number];

type Guess = {
    word: string;
    id: string;
}

export type Player = {
  name: string;
  avatar: AvatarName;
  score: number;
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
  canvas: imageData | null;
}

export type Event = (
| { type: "guess"; word: string; id: string }
| { type: "start_game"; gameId: string; }
| { type: "word_chosen"; word: string }
| { type: "rate_drawing"; rating: number; player_id: number }
| { type: "leave"; id: string }
| { type: "set_me"; id: string; }
| { type: "start_round"; }
| { type: "end_round" }
| { type: "choose_word"; word: string; }
| { type: "get_words" }
| { type: "pick_random_word" }
| { type: "remove_options" }
| { type: "join"; roomId: string; name: string; avatar: AvatarName; id: string }
| { type: "remove_player"; id: string; }
| { type: "end_game" }
| { type: "end_round" }
| { type: "decrement_time" }
| { type: "draw"; img: imageData }
)


type EventName = Event["type"]
type ExtractPaload<T extends EventName> = Omit<Extract<Event, { type: T }>, "type">;
export type Events = Partial<{
    [K in EventName]: (
        cb: {
            payload: ExtractPaload<K>,
        }) => void
}>

export type State = {
    value: StateValue;
    context: Context;
}

export const initialState: State = {
    value: "lobby",
    context: {
        config: {
            maxPlayers: 8,
            hints: 2,
            roundTime: 100,
            rounds: 5,
            difficulty: "medium",
            locale: "en",
        },
        canvas: null,
        gameId: "",
        players: {},
        guesses: [],
        wordOptions: [],
        roundsLeft: 0,
        remainingTime: 0,
        currentWord: "",
        currentDrawer: "",
        owner: "",
    }
};

store.state.context = initialState.context;
store.state.value = initialState.value;

player.atom.subscribe(({id, avatar, name})=>{
    if (store.state.context.players[id]) {
        // @ts-ignore
        store.state.context.players[id].avatar = avatar
        // @ts-ignore
        store.state.context.players[id].name = name
    }
})
