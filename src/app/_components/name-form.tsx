"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { cn } from "~/utils/cn";
import { useGameState } from "~/hooks/useGameState";


interface Props {
    client: string 
}


export default function NameForm({client}: Props) {

    const [name, setName] = useState("");
    const [isPublic, setIsPublic] = useState(true); 
    const { dispatch, game } = useGameState()
    
    const createRoomMutation = api.room.create.useMutation({
        onSuccess: (data) => {
            const {gameId} = data
            const players = [{
                name,
                avatar: "",
                score: 0,
                guessed: false
            }]
            dispatch({type: "GAME_CREATE", payload: {gameId, public: isPublic, gameStarted: false, players}})
        }
    })
    const createRoom = (e: any) => {
        e.preventDefault()
        const gameId = Math.random().toString(36).substring(2, 12)
        createRoomMutation.mutate({gameId, public: isPublic, playerId: client})
        window.location.href = window.location.href + `/${gameId}`  
    }
    const addToRoom = (e: any) => {
        e.preventDefault()
        dispatch({type: "CUSTOM",  payload: { gameId: game.gameId, players: [{name, avatar: "", score: 0, guessed: false}]}})
    }
    
    useEffect(() => {
        const storedName = window.localStorage.getItem("name")
        if (storedName) setName(storedName)
    }, []);

    useEffect(() => {
        window.localStorage.setItem("name", name)
    }, [name]);

    return (
        <div className="flex flex-col gap-5">

        <input value={name} onChange={(e) => setName(e.target.value)} className="text-md block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem] indent-2 placeholder:italic placeholder:text-slate-400/80 focus:border-skin-accent focus:outline-none" type="text" name="name" id="rounds" placeholder="Your name" required />
        <div className="flex place-items-center place-content-center">
        <svg className="size-6 lg:size-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
	<path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0"></path>
</svg>
            <img className="lg:size-36 size-20 place-self-center" src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${"Cuddles"}`} alt="avatar" />
        <svg xmlns="http://www.w3.org/2000/svg" className="rotate-180 size-6 lg:size-10" viewBox="0 0 1024 1024">
	<path fill="currentColor" d="M685.248 104.704a64 64 0 0 1 0 90.496L368.448 512l316.8 316.8a64 64 0 0 1-90.496 90.496L232.704 557.248a64 64 0 0 1 0-90.496l362.048-362.048a64 64 0 0 1 90.496 0"></path>
</svg>
        </div>
        <div className="flex flex-col w-full gap-2 place-content-center place-items-stretch">
            
        <button     className="px-4 py-4 rounded-lg bg-green-700 hover:bg-green-800 hover:scale-[1.02] transition-all">Start Game</button>
        <div className="flex flex-row  gap-2 place-content-center place-items-center">
        <button onClick={createRoom} className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 hover:scale-[1.02] transition-all w-full">Create Room!</button>
        <button onClick={addToRoom} className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 hover:scale-[1.02] transition-all w-full">Add Player To room</button>
        <label className=" w-fit inline-flex items-center cursor-pointer">
        <input onChange={() => setIsPublic(!isPublic)} type="checkbox" value="" className="sr-only peer group" />
                <span className=" flex place-items-center place-content-center inset-0 peer-checked:border-white  peer-checked:bg-green-400/30 bg-red-400/30   rounded-full lg:size-12 size-9 transition-all  *:text-red-400  *:peer-checked:text-green-400" >
                <svg className={cn("size-full p-2 text-inherit ") } xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
                    {
                        isPublic ? (
                            <path fill="currentColor" d="M6 22q-.825 0-1.412-.587T4 20V10q0-.825.588-1.412T6 8h1V6q0-2.075 1.463-3.537T12 1q2.075 0 3.538 1.463T17 6v2h1q.825 0 1.413.588T20 10v10q0 .825-.587 1.413T18 22zm6-5q.825 0 1.413-.587T14 15q0-.825-.587-1.412T12 13q-.825 0-1.412.588T10 15q0 .825.588 1.413T12 17M9 8h6V6q0-1.25-.875-2.125T12 3q-1.25 0-2.125.875T9 6z"></path>
                        )
                        : (
                             <path fill="currentColor" d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m-1-2.05V18q-.825 0-1.412-.587T9 16v-1l-4.8-4.8q-.075.45-.137.9T4 12q0 3.025 1.988 5.3T11 19.95m6.9-2.55q.5-.55.9-1.187t.662-1.325q.263-.688.4-1.413T20 12q0-2.45-1.363-4.475T15 4.6V5q0 .825-.587 1.413T13 7h-2v2q0 .425-.288.713T10 10H8v2h6q.425 0 .713.288T15 13v3h1q.65 0 1.175.388T17.9 17.4"></path>
                        )
                    }
</svg>
</span>
        </label>

        </div>
        </div>

        </div>

    )

}