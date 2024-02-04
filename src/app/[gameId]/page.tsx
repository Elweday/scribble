"use server";
import Game from "~/app/_components/Game";


export default async function Home(props : {params: {gameId: string}}) {
  const { gameId } = props.params;
  console.log(gameId)

  return (
    <Game gameId={gameId} />
  )
}


