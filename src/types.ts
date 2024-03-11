
import { AvatarName } from "./constants/avatars";


export type Guess = {
    word: string;
    playerName: string;
    avatar: string;
}

export type Player = {
  id: string;
  name: string;
  avatar: AvatarName;
  score: number;
  guessed: boolean;  
  drawingRating?: number;
  timeStamp?: number;
}
    
export type Context = {
  gameId: string;
  players: Player[];
  roundsLeft: number;
  currentWord: string;
  currentDrawerIndex: number;
  remainingTime: number;
  roundTime: number;
  rounds: number;
  guesses: Guess[];
  wordOptions: string[];
  maxPlayers: number;
  hints: number;
  owner: string;
  me: string;
}

export type Event = (
| { type: "guess"; word: string; id: string }
| { type: "start_game"; gameId: string; roundTime: number; rounds: number; maxPlayers: number; hints: number}
| { type: "word_chosen"; word: string }
| { type: "restart_game" }
| { type: "join"; id: string; name: string; avatar: AvatarName }
| { type: "rate_drawing"; rating: number; player_id: number }
| { type: "leave"; id: string }
| { type: "set_me"; id: string; }
)