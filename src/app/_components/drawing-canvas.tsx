"use client";
import { useRef,  useEffect, useLayoutEffect, DOMAttributes, useState } from "react";
import { useCanvas } from "~/hooks/useCanvas";
import { Action } from "~/constants/draw";
import Toolbar from "./toolbar";
import { cn } from "~/utils/cn";
import { useGameSyncedStore } from "~/data/gameStore";
import { putImage, getImage } from "~/utils/imageData";

const Canvas = () => {
    const {is, send, state: store, me} = useGameSyncedStore()  
    const min = 20;
    const max = 100;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [state, dispatch] = useCanvas(canvasRef, {
    color: "#000000",
    width: Number(min),
    drawing: false,
    x: 0,
    y: 0,
    history: [],
    historyIndex: -1,
  });

type ME = React.MouseEvent<HTMLCanvasElement, MouseEvent>;
type TE = React.TouchEvent<HTMLCanvasElement>;


const dispatchers =   {

    onMouseDown: (e: ME) => {
      e.preventDefault();
      dispatch({
        action: "START",
        payload: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, event: "mouseDown" },
      })
  },
    onMouseUp: (e:ME) => {
      e.preventDefault();
      dispatch({ action: "STOP", payload: {event: "mouseUp", } })
    },
    onMouseMove: (e: ME) => {
      e.preventDefault();
      dispatch({
        action: "DRAW",
        payload: { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY, event: "mouseMove" }
      })
    },
    onTouchStart: (e: TE) => {
      e.preventDefault();
      dispatch({
        action: "START",
        payload: { x: e.touches[0]?.clientX, y: e.touches[0]?.clientY, event: "touchStart" },
      });
    }, 
    onTouchMove: (e: TE) => {
      dispatch({
        action: "DRAW",
        payload: { x: e.touches[0]?.clientX, y: e.touches[0]?.clientY, event: "touchMove" },
      });
    }, 
    onTouchEnd: (e:TE) => {
      e.preventDefault();
      dispatch({ action: "STOP", payload: {event: "touchEnd"} });
    },
    };


    useLayoutEffect(() => {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const { width, height } = canvas.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
    }, []);

    useEffect(() => {
      if (!is("myturn") && store.context.canvas){
        const canvas = canvasRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D;
        // putImage(store.context.canvas, ctx);  
        console.log("image recived by ", me)
      }
    }, [store.context.canvas])
  
  return (

      <div className="relative col-span-4 lg:col-span-2  flex place-content-center place-items-center aspect-video">
        { is("myturn") && (<Toolbar className={cn({
          " pointer-events-none" : state.drawing
        })} state={state} dispatch={dispatch} min={min} max={max}/>)}
        <canvas
          className={cn("w-full h-full cursor-crosshair aspect-video rounded-lg " , {
            "cursor-not-allowed": !is("myturn")
          })}
          {...(is("myturn"))? dispatchers : {}}
          ref={canvasRef}
          
          style={{ border: "1px solid black", backgroundColor: "white", aspectRatio: "16/9" }}
          width={"100%"}
          height={"100%"}
        />
      </div>
  );
};
export default Canvas;
