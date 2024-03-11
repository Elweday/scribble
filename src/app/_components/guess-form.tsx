"use client";
import { useState } from "react";
import { useGameSyncedStore } from "~/data/gameStore";
import { api } from "~/trpc/react";
type Props = {
  guesser: {
    name: string, 
    avatar: string
  }
} 

export default function GuessForm() {
  const [body, setBody] = useState("");
  const {send, me} = useGameSyncedStore()
  
  // const { mutate: guess, isLoading} = api.guess.mutation.useMutation({onSuccess: () => setBody("")});

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send({type: "guess", word: body, id: me});
        setBody("");
      }}
      className="flex gap-2"
    >
      <input
        type="text"
        placeholder="type your guess..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border-2 focus:border-2  text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200"
      />
      <button
        type="submit"
        className="rounded-full bg-white/10 p-2 size-11 aspect-square  place-content-center place-items-center flex font-semibold transition hover:bg-white/20"
      >
         {false ?

        (
           <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z"/>
            </svg>
        )
        : (
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 20v-6l8-2l-8-2V4l19 8z"/></svg>
         )}
       </button>
    </form>
  );
}
