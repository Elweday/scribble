"use client"
import NameForm from "./_components/name-form";
import { meta } from "~/constants/game";

export default function Home() {
  return (
    <main className="w-full h-full flex place-content-center place-items-center flex-col gap-4">
      <div className=" pb-2 w-80">
        <h1 className="text-5xl md:text-6xl lg:text-7xl  text-center">{meta.name}</h1>
        </div>
      <div className="place-self-center flex flex-col gap-3 w-[90%] lg:w-[40%] min-w-3xl min-h-6xl bg-black/10 p-5   rounded-lg">
      <NameForm />
      </div>
    </main>
  );
}


