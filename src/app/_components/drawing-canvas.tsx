"use client";
import { useRef,  useEffect, useLayoutEffect, DOMAttributes } from "react";
import { useCanvas } from "~/hooks/useCanvas";
import { Action } from "~/constants/draw";
import Toolbar from "./toolbar";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";

const Canvas = () => {
    const {is} = useGameSyncedStore()  
    const min = 20;
    const max = 100;
    const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, clientDispatch] = useCanvas(canvasRef, {
    color: "#000000",
    width: Number(min),
    drawing: false,
    x: 0,
    y: 0,
    history: [],
    historyIndex: -1,
  });
  const dispatch = (action: Action) => {
    clientDispatch(action);
  };


type ME = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
type TE = React.TouchEvent<HTMLCanvasElement>;
  
const dispatchers = !(is("myturn"))? {}:  {

    onMouseDown: (e: ME) => {
      e.preventDefault();
      dispatch({
        type: "START",
        payload: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, event: "mouseDown" },
      })
  },
    onMouseUp: (e:ME) => {
      e.preventDefault();
      dispatch({ type: "STOP", payload: {event: "mouseUp", } })
    },
    onMouseMove: (e: ME) => {
      e.preventDefault();
      dispatch({
        type: "DRAW",
        payload: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, event: "mouseMove" }
      })
    },
    onMouseOut: (e:ME) => {
      e.preventDefault();
      dispatch({ type: "STOP",payload: {event: "mouseOut"}})
    },
    onTouchStart: (e: TE) => {
      e.preventDefault();
      dispatch({
        type: "START",
        payload: { x: e.touches[0]?.clientX, y: e.touches[0]?.clientY, event: "touchStart" },
      });
    }, 
    onTouchMove: (e: TE) => {
      dispatch({
        type: "DRAW",
        payload: { x: e.touches[0]?.clientX, y: e.touches[0]?.clientY, event: "touchMove" },
      });
    }, 
    onTouchEnd: (e:TE) => {
      e.preventDefault();
      dispatch({ type: "STOP", payload: {event: "touchEnd"} });
    },
    };

    useLayoutEffect(() => {
      
    const canvas = canvasRef.current as HTMLCanvasElement;
    const { width, height } = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
    canvas.width = width
    canvas.height = height
  }, []);

  return (

      <div className="relative flex h-full w-full aspect-video max-h-[40rem]">
        {is("myturn") ? (
          <Toolbar state={state} dispatch={dispatch} min={min} max={max}/>
        ):null}
        <canvas
          className={cn(" w-full h-full cursor-crosshair aspect-video  rounded-lg", {
            "cursor-not-allowed": !is("myturn")
          })}
          {...dispatchers}
          ref={canvasRef}
          height={"100%"}
          width={"100%"}
          style={{ border: "1px solid black", backgroundColor: "white" }}
        />
      </div>
  );
};
export default Canvas;
