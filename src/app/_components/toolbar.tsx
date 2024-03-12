"use client";
import { useState } from "react";
import { COLOR_PALETTE, type State, type Action } from "~/constants/draw";

type Props = {
    state: State;
    dispatch: (action: Action) => void;
    min: number;
    max: number;
};

export default  (props : Props) => {
    const {min, max, state, dispatch} = props;
    const [widthShown, setWidthShown] = useState(false);
    return (    
    <div
    id="toolbar"
    className="flex flex-wrap text-black   w-full bg-black/20 p-1 gap-2 lg:p-3 lg:gap-3 rounded-xl transition-all lg:*:rounded-xl lg:*:min-h-12  *:max-h-4 *:rounded-md *:aspect-square *:min-h-6  absolute top-0 left-0 z-50  *:flex *:place-content-center *:place-items-center *:bg-black/20"
  >
    <button
        className="transition-all hover:scale-110  rounded-full overflow-hidden border-2 border-gray-900"
    >
    <input
      value={state.color}
      type="color"
      className="origin-center scale-[2] w-full h-full"
      onChange={(e) =>
        dispatch({ action: "COLOR", payload: { color: e.target.value } })
    }
    />
    </button>
    {COLOR_PALETTE.map((color, index) => (
      <button
        className="transition-all hover:scale-110 z-50"
        key={index}
        style={{ backgroundColor: color }}
        onClick={() => dispatch({ action: "COLOR", payload: { color } })}
      />
    ))}
    <button
      className="transition-all hover:scale-110 bg-black/10"
      onClick={() => dispatch({ action: "CLEAR" })}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="lg:size-12 size-8"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"
        />
      </svg>
    </button>
    <button 
     className="relative transition-all hover:scale-110 origin-center bg-black/10"
     onClick={() => setWidthShown(!widthShown)}
    >
      <svg className="lg:size-20 size-8" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
	<path fill="currentColor" d="M6 21q-1.125 0-2.225-.55T2 19q.65 0 1.325-.513T4 17q0-1.25.875-2.125T7 14q1.25 0 2.125.875T10 17q0 1.65-1.175 2.825T6 21m5.75-6L9 12.25l8.95-8.95q.275-.275.688-.288t.712.288l1.35 1.35q.3.3.3.7t-.3.7z"></path>
</svg>
      {widthShown && (
        
      <input
        className="min-w-[100px] w-full  absolute left-0 -bottom-8"
        type="range"
        min={min}
        max={max}
        value={state.width}
        onChange={(e) =>
          dispatch({
            action: "WIDTH",
            payload: { width: Number(e.target.value) },
          })
        }
        id="myRange"
      />
      )}
      </button>
      <button className="transition-all hover:scale-110 bg-black/10" onClick={() => dispatch({ action: "UNDO" })}>
      <svg className="lg:size-20 size-8" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
      <path fill="currentColor" d="M1 8.5L8 14v-4h1c4 0 7 2 7 6v1h3v-1c0-6-5-9-10-9H8V3z"></path>
</svg>
      </button>
  </div>
  )
}