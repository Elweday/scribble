"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import Error404 from "../_components/404";
import { ActorContext } from "~/useGame";
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";

export default function Home(props : {gameId: string}) {
  const state = ActorContext.useSelector(state => state)
  return (
    <>
    {(state.matches({"Game in progress": "Round ended"}) || state.matches("Game over")) && <Leaderboard />}
    {state.matches({"Game in progress": "Word choosing"}) && <WordChoosing />}
      {state.error ? <Error404 /> : 
        state.matches("Waiting for players") ? <GameLobby gameId={props.gameId} /> : <GameStarted />  
      } 
    </> 
  )
}


