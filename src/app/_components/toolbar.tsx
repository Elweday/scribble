"use client";
import { useState } from "react";
import { COLOR_PALETTE, type State, type Action } from "~/constants/draw";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";
import { Slider } from "./ui/slider";

type Props = {
    min: number;
    max: number;
    className?: string;
};

export default  (props : Props) => {
    const {min, max } = props;
    const [widthShown, setWidthShown] = useState(false);
    const {state} = useGameSyncedStore();
    
    return (    
    <div
    id="toolbar"
    className={cn("flex flex-wrap text-purple-700   w-full bg-black/20 p-1 gap-2 lg:p-3 lg:gap-3 rounded-xl transition-all lg:*:rounded-xl lg:*:min-h-12  *:max-h-4 *:rounded-md *:aspect-square *:min-h-6  absolute top-0 left-0 z-1  *:flex *:place-content-center *:place-items-center *:ring-1 *:ring-white *:bg-black/20", props.className)}
  >
    <button
        className="transition-all hover:scale-110  rounded-full overflow-hidden border-2 border-gray-900"
    >
    <input
      value={state.canvas.opts.color}
      type="color"
      className="origin-center scale-[2] w-full h-full"
      onChange={(e) =>
        state.canvas.opts.color = e.target.value
    }
    />
    </button>
    {COLOR_PALETTE.map((color, index) => (
      <button
        className="transition-all hover:scale-110 z-50 "
        key={index}
        style={{ backgroundColor: color }}
        onClick={() => state.canvas.opts.color = color}
      />
    ))}
    <button
      className="transition-all hover:scale-110 bg-black/10"
      onClick={() => state.canvas.paths = []}
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

      <div className="absolute -right-20 top-7 bg-black/50 p-2 rounded-lg h-40 w-40 flex flex-col gap-3 *:w-full">
        <div className="flex flex-col text-xs text-start place-self-start text-white">
          <label htmlFor="width-slider">Width</label>
          <Slider
            id="width-slider"
            defaultValue={[state.canvas.opts.size]}
            min={min}
            max={max}
            onValueChange={([value]) => state.canvas.opts.size = Number(value)}
          />
        </div>
        <div className="flex flex-col text-xs text-start place-self-start text-white">
          <label htmlFor="smoothing-slider">thinning</label>
          <Slider
            id="thinning-slider"
            defaultValue={[state.canvas.opts.thinning]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => state.canvas.opts.thinning = Number(value)}
          />
        </div>

        <div className="flex flex-col text-xs text-start place-self-start text-white">
          <label htmlFor="opacity-slider">opacity</label>
          <Slider
            id="thinning-slider"
            defaultValue={[state.canvas.opts.opacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => state.canvas.opts.opacity = Number(value)}
          />
        </div>

        </div>
      )}
      </button>
      <button onClick={ ()=> {
        try { state.canvas.paths.pop() } catch (error) {}
        
      }} className="transition-all hover:scale-110 bg-black/10" >
      <svg className="lg:size-20 size-8" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24">
      <path fill="currentColor" d="M1 8.5L8 14v-4h1c4 0 7 2 7 6v1h3v-1c0-6-5-9-10-9H8V3z"></path>
</svg>
      </button>
  </div>
  )
}