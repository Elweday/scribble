"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import Error404 from "../_components/404";
import WordChoosing from "./choose";
import Leaderboard from "./leaderboard";
import {  useEffect, useRef} from "react";
import {  AvatarName } from "~/constants/avatars";
import { useGameSyncedStore, getRandomUser, randomAvatar } from "~/data/gameStore";
import { v4 as uuidv4 } from "uuid";
import { useOnPageLeave } from "~/hooks/useOnPageLeave";
import { player } from "~/constants/game";


export default function Home(props : {gameId: string}) {
  const {state, send, gameLoop, is, me} = useGameSyncedStore();
  const {avatar, name} = player.use()
  const id = useRef(uuidv4());
  const gameLoopRef = useRef(false);

  useEffect(() => {
    if (!gameLoopRef.current && is("owner")){
      gameLoop();
      console.log("starting game loop")
    };
    gameLoopRef.current = true
  }, [])
  useEffect(() => {
      send({type: "join", name, avatar, roomId: props.gameId, id: id.current})
  }, [state.context.players])
  useOnPageLeave(() => {
    send({type: "leave", id: id.current})
  })
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
