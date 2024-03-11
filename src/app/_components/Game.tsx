"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import Error404 from "../_components/404";
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";
import {  useEffect, useRef} from "react";
import { useLocalStorage } from "~/hooks/useLocalStorage";
import {  AvatarName } from "~/constants/avatars";
import { useGameSyncedStore } from "~/data/gameStore";

export default function Home(props : {gameId: string}) {
  const {state, send, gameLoop, is} = useGameSyncedStore();
  const [avatar] = useLocalStorage<AvatarName>("AVATAR", "batman");
  const [name] = useLocalStorage<string>("NAME", "Guest");
  useEffect(() => {
    send({type: "join", name, avatar, roomId: props.gameId})
    if (is("owner")) {
      gameLoop()
    }
  }, [state.context.players])
  return (

    <>
    {is("leaderboard") && <Leaderboard />}
    {is("word_choosing") && <WordChoosing />}
      {!state.value ? <Error404 /> : 
        is("lobby") ? <GameLobby gameId={props.gameId} /> : <GameStarted />  
      } 
    </> 
  )
}
