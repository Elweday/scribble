"use client";
import GameLobby from "~/app/_components/GameLobby"
import GameStarted from "~/app/_components/GameStarted"
import { api } from "~/trpc/react";
import Error404 from "../_components/404";
import { useGameState } from "~/hooks/useGameState";


export default  function Home(props : {gameId: string}) {
  const { data } = api.external.name.useQuery();
  const { game } = useGameState();

  return (
    <>
      {game.gameId !== "" ? <Error404 /> : 
        game.gameStarted? <GameStarted /> : <GameLobby />
      } 
    </> 
  )
}


