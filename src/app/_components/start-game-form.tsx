"use client";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";
import { locales, difficulties } from "~/constants/game";


import React from 'react';

function DifficultyIcon() {
	return (<svg className="text- absolute left-2 top-[2px] size-6 text-slate-400/80"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" ><path fill="currentColor" d="M30 30h-8V4h8zm-10 0h-8V12h8zm-10 0H2V18h8z"></path></svg>);
}

function LanguageIcon() {
	return (<svg className="text- absolute left-2 top-[2px] size-7 text-slate-400/80"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><path fill="currentColor" d="M12 21q-1.858 0-3.5-.71t-2.86-1.93q-1.22-1.217-1.93-2.86Q3 13.858 3 12q0-1.863.71-3.503q.711-1.64 1.93-2.858Q6.857 4.421 8.5 3.711Q10.142 3 12 3q1.863 0 3.503.71q1.64.711 2.858 1.93q1.218 1.218 1.928 2.857Q21 10.137 21 12q0 1.858-.71 3.5t-1.93 2.86q-1.218 1.219-2.857 1.93Q13.863 21 12 21m0-.992q.88-1.131 1.452-2.221q.571-1.09.929-2.44H9.619q.396 1.426.948 2.516q.552 1.09 1.433 2.145m-1.273-.15q-.7-.825-1.278-2.04q-.578-1.214-.86-2.472H4.753q.86 1.866 2.437 3.06q1.578 1.194 3.536 1.452m2.546 0q1.958-.258 3.536-1.452t2.437-3.06h-3.834q-.38 1.277-.957 2.492q-.578 1.214-1.182 2.02m-8.927-5.512H8.38q-.114-.615-.16-1.199q-.048-.584-.048-1.147q0-.563.047-1.147q.047-.584.16-1.2H4.347q-.163.52-.255 1.133T4 12q0 .602.091 1.214q.092.613.255 1.132m5.035 0h5.238q.114-.615.16-1.18q.048-.564.048-1.166t-.047-1.166q-.047-.565-.16-1.18H9.38q-.113.615-.16 1.18q-.047.564-.047 1.166t.047 1.166q.047.565.16 1.18m6.24 0h4.034q.163-.52.255-1.132T20 12q0-.602-.091-1.214q-.092-.613-.255-1.132h-4.035q.114.615.16 1.199q.048.584.048 1.147q0 .563-.047 1.147q-.047.584-.16 1.2m-.208-5.693h3.834q-.879-1.904-2.408-3.06q-1.53-1.156-3.565-1.47q.7.92 1.259 2.106q.558 1.185.88 2.424m-5.793 0h4.762q-.396-1.408-.977-2.546q-.58-1.139-1.404-2.116q-.823.977-1.404 2.116q-.58 1.138-.977 2.546m-4.865 0h3.834q.322-1.239.88-2.424q.559-1.186 1.259-2.107q-2.054.315-3.574 1.48q-1.52 1.166-2.4 3.05"></path></svg>);
}

function HintsIcon() {
	return (<svg className="text- absolute left-1 top-1 size-7 text-slate-400/80" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1200 1200" ><path fill="currentColor" d="M567.663 0v190.423h64.679V0h-64.685zm-264.11 57.225l-52.992 37.103l109.203 155.946l52.963-37.104zm592.886 0L787.268 213.171l52.971 37.104L949.44 94.328l-52.992-37.103zm-296.45 185.299c-158.227 0-286.493 96.083-286.493 214.625l162.772 492.948h247.47l162.758-492.948c0-118.54-128.258-214.625-286.492-214.625zM85.465 299.673l-22.099 60.814l178.849 65.114l22.181-60.785l-178.935-65.143zm1029.062 0l-178.936 65.148l22.106 60.792l178.936-65.125zM255.756 577.681l-183.9 49.326l16.686 62.431l183.9-49.255l-16.683-62.502zm688.48 0l-16.674 62.501l183.9 49.247l16.674-62.432l-183.9-49.318zM472.66 986.032v85.686h254.687v-85.673H472.661zm0 128.282V1200h254.687v-85.672H472.661z"></path></svg>);
}

function TimeIcon() {
	return (<svg className="text- absolute left-2 top-2 size-6 text-slate-400/80" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26" ><path fill="currentColor" d="M13 .188c-1.104 0-2 .844-2 1.812h4c0-.908-.896-1.813-2-1.813zM4.969.5C3.916.582 2.867 1.07 2 1.938C.268 3.67-.077 6.173 1.656 7.905l6.282-6.281C7.072.758 6.021.418 4.967.5zM20.25.5c-.781.105-1.538.475-2.188 1.125l6.282 6.281c1.733-1.732 1.388-4.235-.344-5.968C22.917.853 21.552.325 20.25.5M13 3.188C7.028 3.188 2.187 8.027 2.187 14c0 3.581 1.756 6.751 4.438 8.719l-.781 2.312a.684.684 0 0 0 .406.844a.695.695 0 0 0 .906-.281l1.032-1.907A10.79 10.79 0 0 0 13 24.813c1.727 0 3.364-.405 4.813-1.125l1.03 1.907c.1.199.451.48.907.281a.684.684 0 0 0 .406-.844l-.781-2.312c2.682-1.968 4.438-5.138 4.438-8.719c0-5.972-4.841-10.813-10.813-10.813m-1 2.624V6.5a1 1 0 0 0 .469.844a.754.754 0 0 0-.125.343l-.25 5.032A1.572 1.572 0 0 0 11.438 14c0 .867.695 1.563 1.562 1.563c.055 0 .103-.026.156-.032l3.063 2.719c.172.154.604.27.968-.094c.365-.365.244-.794.094-.968l-2.718-3.125V14c0-.553-.287-1.033-.72-1.313l-.187-5a.75.75 0 0 0-.125-.343A1 1 0 0 0 14 6.5v-.688c3.706.452 6.682 3.374 7.188 7.063H20.5a1.123 1.123 0 0 0-.125 0a1.127 1.127 0 1 0 .125 2.25h.688c-.5 3.648-3.415 6.562-7.063 7.063V21.5a1.123 1.123 0 0 0-1.375-1.125a1.123 1.123 0 0 0-.875 1.125v.688c-3.648-.5-6.562-3.415-7.063-7.063H5.5a1.125 1.125 0 0 0 0-2.25h-.688C5.319 9.185 8.294 6.264 12 5.812"></path></svg>);
}

function RoundsIcon() {
	return (<svg  className="text- absolute left-2 top-[8px] size-5 text-slate-400/80"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" ><path fill="currentColor" fillRule="evenodd" d="M5.905.28A8 8 0 0 1 14.5 3.335V1.75a.75.75 0 0 1 1.5 0V6h-4.25a.75.75 0 0 1 0-1.5h1.727a6.5 6.5 0 1 0 .526 5.994a.75.75 0 1 1 1.385.575A8 8 0 1 1 5.905.279Z" clipRule="evenodd"></path></svg>);
}

function PlayersIcon() {
	return (<svg className="text- absolute left-1 top-1 size-7 text-slate-400/80"  xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" ><path fill="currentColor" d="M8 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8m9 0a3 3 0 1 0 0-6a3 3 0 0 0 0 6M4.25 14A2.25 2.25 0 0 0 2 16.25v.25S2 21 8 21s6-4.5 6-4.5v-.25A2.25 2.25 0 0 0 11.75 14zM17 19.5c-1.171 0-2.068-.181-2.755-.458a5.503 5.503 0 0 0 .736-2.207A3.987 3.987 0 0 0 15 16.55v-.3a3.24 3.24 0 0 0-.902-2.248A2.32 2.32 0 0 1 14.2 14h5.6a2.2 2.2 0 0 1 2.2 2.2s0 3.3-5 3.3"></path></svg>);
}


export default (props: {gameId: string}) => {
  const {state, send, is} = useGameSyncedStore();
  const canStart = is("can_start");
  const isOwner = is("owner")

  return (
    <div className="grid grid-cols-2 gap-3 w-full ">
      <h1 className="col-span-2 lg:text-xl">Settings</h1>

      <label className="relative">
        <RoundsIcon />
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="rounds"
          id="rounds"
          placeholder="rounds"
          min={1}
          max={10}
          required
          value={state.context.config.rounds}
          onChange={(e)=> state.context.config.rounds = Number(e.target.value)}
          disabled={!isOwner}
        />
      </label>

      <label className="relative">
        <HintsIcon />
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
          value={state.context.config.hints}
          onChange={(e)=> state.context.config.hints = Number(e.target.value)}
          disabled={!isOwner}

        />
      </label>

      <label className="relative">
        <TimeIcon />
     
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
          value={state.context.config.roundTime}
          onChange={(e)=> state.context.config.roundTime = Number(e.target.value)}
          disabled={!isOwner}

        />
      </label>

      <label className="relative">
      <PlayersIcon />
        <input
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          type="number"
          name="max_players"
          id="max_players"
          placeholder="max players"
          required
          min={2}
          value={state.context.config.maxPlayers}
          onChange={(e)=> state.context.config.maxPlayers = Number(e.target.value)}
          disabled={!isOwner}
          max={16}
          step={1}
        />
      </label>
      <label className="relative">
        <LanguageIcon />
        <select
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          id="locale"
          required
          value={state.context.config.locale}
          onChange={(e)=> state.context.config.locale = e.target.value as typeof locales[number]}
          disabled={!isOwner}
        >
          {locales.map((locale) => (
            <option key={locale} value={locale}>
              {locale}
            </option>
          ))}
        </ select>
      </label>

      <label className="relative">
        <DifficultyIcon />
        <select
          className=" text-md focus:border-skin-accent block w-full justify-self-center rounded-lg border border-gray-300 border-opacity-40  bg-black/10 px-[0.75rem] py-[0.32rem]  indent-6 placeholder:italic placeholder:text-slate-400/80 focus:outline-none"
          id="difficulty"
          required
          value={state.context.config.difficulty}
          onChange={(e)=> state.context.config.difficulty = e.target.value as typeof difficulties[number]}
          disabled={!isOwner}
        >
          {difficulties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </ select>
      </label>

      <button
        disabled={!canStart}
        onClick={(e) => {
          e.preventDefault();
          send({ type: "start_game", gameId: props.gameId });
        }}
        className={cn("col-span-2 rounded-lg bg-green-700 px-4 py-4 transition-all hover:scale-[1.02] hover:bg-green-800", {
          "cursor-not-allowed opacity-50 ": !canStart,
        })}
      >
        Start Game
      </button>
    </div>
  );
};
