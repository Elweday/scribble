"use client"
import { useGameSyncedStore } from "~/data/gameStore";
export default function Home() {
  const {state} = useGameSyncedStore();

  return (
    <main className="w-full h-full flex place-content-center place-items-center ">

      <div className="place-self-center flex flex-col gap-3 w-[60%] min-w-6xl min-h-6xl bg-black/10 p-5   ">
        <pre>
          {JSON.stringify(state.context.players, null, 2)}
        </pre>
      </div>
    </main>
  );
}


