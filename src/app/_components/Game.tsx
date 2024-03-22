"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";
import {  useEffect, useCallback} from "react";
import { useGameSyncedStore  } from "~/data/gameStore";
import { local } from "~/constants/game";
import { useRouter } from 'next/navigation'

export default function Home(props : {gameId: string}) {
  const {state, send, is, me} = useGameSyncedStore();
  const {avatar, name, id} = local.use()

  const addPlayer = useCallback(() => {
    send({type: "join", name, avatar, roomId: props.gameId, id})
  }, [state.context.players])

  useEffect(function onJoin(){
      addPlayer();
  }, [state.context.players])

  useEffect(() => {
    const handler = () => send({type: "leave", id});
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