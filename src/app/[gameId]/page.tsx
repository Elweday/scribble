"use server";
import Game  from "~/app/_components/Game";

export default async function Home(props : {params: {gameId: string}}) {
  const { gameId } = props.params;
  return (
    <Game gameId={gameId} />
  )
}