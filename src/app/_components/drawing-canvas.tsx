"use client";
import { useEffect, PointerEventHandler, useRef } from "react";
import Toolbar from "./toolbar";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";
import { getStroke } from 'perfect-freehand'
import { Paths, Point } from "~/constants/draw";
import { getSvgPathFromStroke } from "~/utils/svgPath";

const Canvas = () => {
    const {is, send, state, me} = useGameSyncedStore()  
    const min = 20;
    const max = 100;

    const ref = useRef<SVGSVGElement>(null);

  const onPointerDown: PointerEventHandler<SVGSVGElement> = (e) => {
    // @ts-ignore
    e.target.setPointerCapture(e.pointerId);
    const point = [e.pageX , e.pageY, e.pressure] as Point;
    state.canvas.points = [point]
  }

  const onPointerMove: PointerEventHandler<SVGSVGElement> = (e) =>  {
    if (e.buttons !== 1) return;
    state.canvas.points.push([e.pageX, e.pageY, e.pressure])
  }

  const  onPointerUp: PointerEventHandler<SVGSVGElement> = (e) => {
    // @ts-ignore
    const normalize = (value) => JSON.parse(JSON.stringify(value))
    // @ts-ignore
    e.target.releasePointerCapture(e.pointerId)
    state.canvas.paths.push([normalize(state.canvas.points), normalize(state.canvas.opts)])
    state.canvas.points = []
  }

  const stroke = getStroke(state.canvas.points, state.canvas.opts);
  const pathData = getSvgPathFromStroke(stroke)
  const handlers: any = is("myturn") ? {
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } : {};

  useEffect(() => {
  }, [])
  
  return (

      <div className="relative col-span-4 lg:col-span-2  flex place-content-center place-items-center aspect-video">
        { is("myturn") && (<Toolbar className={cn({
          " pointer-events-none" : !is("myturn")
        })} min={min} max={max}/>)}
    <svg
    viewBox="0 0 600 600"
      ref={ref}
      className='w-full h-full rounded-md bg-white aspect-video '
      style={{ touchAction: 'none' }}
      {...handlers}
    >
      {
        state.canvas.paths.map((path, i) => {
          const [pts, options] = path
          const stroke = getStroke(pts, options);
          const d = getSvgPathFromStroke(stroke);
          return (
            <path key={i} fill={options.color} opacity={options.opacity} d={d}/>
          )
      })
      }
      <path fill={state.canvas.opts.color} d={pathData} opacity={state.canvas.opts.opacity} />

    </svg>
      </div>
  );
};
export default Canvas;
