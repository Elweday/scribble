"use client";
import { useState, useEffect } from "react";
import { cn } from "~/utils/cn";
import { useRouter } from 'next/navigation'
import { useGameSyncedStore } from "~/data/gameStore";
import EditForm from "./edit-form";

export default function NameForm() {
    const [isPublic, setIsPublic] = useState(true); 
    const { send }= useGameSyncedStore();
    const router = useRouter();

    const createRoom = (e: any) => {
        e.preventDefault()
        const roomId = Math.random().toString(36).substring(2, 12);
        send({ type: "create_room", roomId })
        typeof window !== 'undefined' && router.push(`/${roomId}`)
    }
    return (
        
        <div className="flex flex-col gap-5">
        <div className="flex flex-col w-full gap-2 place-content-center place-items-center mx-auto ">
        <EditForm />
        <button className="px-4 w-full py-4 rounded-lg bg-green-700 hover:bg-green-800 hover:scale-[1.02] transition-all">Start Game!</button>
        <div className="flex flex-row  gap-2 place-content-center place-items-center w-full">
        <button onClick={createRoom} className="px-4 py-2 w-full rounded-lg bg-blue-700 hover:bg-blue-800 hover:scale-[1.02] transition-all ">Create Room!</button>
        <label className=" w-fit inline-flex items-center cursor-pointer">
        <input onChange={() => setIsPublic(!isPublic)} type="checkbox" value=""  className="sr-only peer group" />
                <span className=" flex place-items-center place-content-center inset-0 peer-checked:border-white  peer-checked:bg-green-400/30 bg-red-400/30   rounded-md lg:size-12 size-10 transition-all  *:text-red-400  *:peer-checked:text-green-400" >
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