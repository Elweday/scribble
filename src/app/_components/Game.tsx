"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import Error404 from "../_components/404";
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";
import {  useEffect, useRef, useCallback} from "react";
import { useGameSyncedStore  } from "~/data/gameStore";
import { v4 as uuidv4 } from "uuid";
import { player } from "~/constants/game";

export default function Home(props : {gameId: string}) {
  const {state, send, is} = useGameSyncedStore();
  const {avatar, name} = player.use()
  const id = useRef(uuidv4());
  
  const addPlayer = useCallback(() => {
    send({type: "join", name, avatar, roomId: props.gameId, id: id.current})
  }, [state.context.players])

  useEffect(function onJoin(){
      addPlayer();
  }, [state.context.players])

  useEffect(() => {
    const handler = () => {
      send({type: "leave", id: id.current});
    }
    window.addEventListener('beforeunload', handler);
  }, [state.context.players]);

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