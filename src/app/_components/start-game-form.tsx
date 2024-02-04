"use client";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useGameState } from "~/hooks/useGameState";
import { type State as Game } from "~/constants/game";

type FormData = Pick<Game, "hints" | "maxPlayers" | "rounds" | "drawingTime">



export default () => {
  const {dispatch, game} = useGameState()
  const [formData, setFormData] = useState<FormData>({
    hints: 1,
    maxPlayers: 8,
    rounds: 3,
    drawingTime:30,
  })

  const onChangeMaker = (property: keyof FormData )=>{
    return (e: any)=>{
        setFormData((prev)=>({...prev, [property]: Number(e.target?.value)}))
    }
  }

  return (
    <form className="grid grid-cols-2 gap-3 w-full ">
      <h1 className="col-span-2 lg:text-xl">Settings</h1>

      <label className="relative">
        <svg
          className="text- absolute left-1 top-1 size-7 text-slate-400/80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M13 15V9h-1l-2 1v1h1.5v4m5.5 2H7v-3l-4 4l4 4v-3h12v-6h-2M7 7h10v3l4-4l-4-4v3H5v6h2z"
          />
        </svg>
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="rounds"
          id="rounds"
          placeholder="rounds"
          min={1}
          max={10}
          required
          value={formData.rounds}
          onChange={onChangeMaker("rounds")}
        />
      </label>

      <label className="relative">
        <svg
          className="text- absolute left-1 top-1 size-7 text-slate-400/80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12.75 25.498h5.5v-5.164h-5.5zm2.75 2.668c1.894 0 2.483-1.027 2.667-1.666h-5.334c.184.64.773 1.666 2.667 1.666m0-25.333a7 7 0 0 0-7 7c0 3.86 3.945 4.937 4.223 9.5h1.27c-.008-.026-.023-.05-.028-.08l-2-10.997a.502.502 0 0 1 .94-.313l.553 1.106l.553-1.107a.5.5 0 0 1 .893 0l.553 1.106l.553-1.107a.498.498 0 0 1 .893 0l.554 1.106l.553-1.107a.5.5 0 0 1 .937.313l-2 10.998c-.004.03-.02.053-.028.078h1.355c.278-4.562 4.224-5.64 4.224-9.5c0-3.864-3.134-7-7-7zm1.958 7.833a.496.496 0 0 1-.446-.275l-.554-1.105l-.553 1.106a.503.503 0 0 1-.896.001l-.553-1.105l-.553 1.106a.496.496 0 0 1-.446.276h-.037l1.455 8h1.167l1.454-8h-.038z"
          />
        </svg>
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="hints"
          id="hints"
          placeholder="number of hints"
          min={0}
          max={3}
          step={1}
          required
          value={formData.hints}
          onChange={onChangeMaker("hints")}
        />
      </label>

      <label className="relative">
        <svg
          className="text- absolute left-1 top-1 size-7 text-slate-400/80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16m1-8h4v2h-6V7h2z"
          />
        </svg>
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="time"
          id="time"
          placeholder="time"
          min={30}
          max={180}
          step={30}
          required
          onChange={onChangeMaker("drawingTime")}
          value={formData.drawingTime}
        />
      </label>

      <label className="relative">
        <svg
          className="text- absolute left-1 top-1 size-7 text-slate-400/80"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5m8 0c-.29 0-.62.02-.97.05c1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5"
          />
        </svg>
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="max_players"
          id="max_players"
          placeholder="max players"
          required
          min={2}
          onChange={onChangeMaker("maxPlayers")}
          value={formData.maxPlayers}
          max={16}
          step={1}
        />
      </label>
      <button
        onClick={(e) => {
          e.preventDefault();
          const players = [{
            name: "Ahmed",
            avatar: "cuddles",
            score: 0,
            guessed: false
          }];
          dispatch({ type: "START_GAME", payload: {...formData, players: players} });
        }}
        className="col-span-2 rounded-lg bg-green-700 px-4 py-4 transition-all hover:scale-[1.02] hover:bg-green-800"
      >
        Start
      </button>
    </form>
  );
};
