"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";
import {  useEffect, useRef, useCallback} from "react";
import { useGameSyncedStore  } from "~/data/gameStore";
import { v4 as uuidv4 } from "uuid";
import { local } from "~/constants/game";
import { useRouter } from 'next/navigation'

export default function Home(props : {gameId: string}) {
  const {state, send, is, me} = useGameSyncedStore();
  const {avatar, name} = local.use()
  const id = useRef(uuidv4());
  const router = useRouter();

  const addPlayer = useCallback(() => {
    send({type: "join", name, avatar, roomId: props.gameId, id: id.current})
  }, [state.context.players])

  useEffect(function onJoin(){
    if (is("has_owner")){
      addPlayer();
    } else {
      local.set("error", `Room "${props.gameId}" does not exist`)
      typeof window !== 'undefined' && router.push(`/error`)
    }
  }, [state.context.players])

  useEffect(() => {
    const handler = () => send({type: "leave", id: id.current});
    window.addEventListener('beforeunload', handler);
  }, [state.context.players]);

  return (
    <>
      {is("leaderboard") && <Leaderboard />}
      {is("word_choosing") && <WordChoosing />}
      {is("lobby") ? <GameLobby gameId={props.gameId} /> : <GameStarted />}  
    </> 
  )
}