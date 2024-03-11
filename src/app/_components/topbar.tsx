
import { useGameSyncedStore } from "~/data/gameStore";


export const TopBar = () => {
    const {state, is} = useGameSyncedStore()
    const rounds = state.context.rounds;
    const played = rounds - state.context.roundsLeft;

    return (
        <div id="topbar" className="flex bg-black/10 content-center items-center lg:h-[100px] w-full justify-between gap-3 py-2 px-4 rounded-xl transition-all *:rounded-3xl "> 
            <span className="flex gap-1 content-center items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="size-6 lg:size-8" viewBox="0 0 24 24"><path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z"/></svg>
                <span className="font-bold text-2xl">{state.context.remainingTime}</span>
            </span>
            <span className="flex flex-wrap lg:gap-2 gap-1 place-content-center place-items-center"> 
                {
                    state.context.currentWord?.split("").map((letter, index) => <span className="text-lg lg:text-3xl  bg-black/10  size-7 lg:size-10 text-center rounded-md  " key={index}>{is("myturn") ? letter : " "}</span>)
                }
            </span>
            <span className="font-bold lg:text-2xl ">{played} / {rounds}</span>
        </div>
    );
}