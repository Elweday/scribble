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


const dispatchers = !(is("myturn"))? {}:  {

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
    onMouseOut: (e:ME) => {
      e.preventDefault();
      dispatch({ action: "STOP",payload: {event: "mouseOut"}})
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

      <div className="relative flex aspect-video ">
        {is("myturn") ? (
          <Toolbar state={state} dispatch={dispatch} min={min} max={max}/>
        ):null}
        <canvas
          className={cn(" max-h-[30rem] w-full h-full cursor-crosshair  rounded-lg aspect-video " , {
            "cursor-not-allowed": !is("myturn")
          })}
          {...dispatchers}
          ref={canvasRef}
          style={{ border: "1px solid black", backgroundColor: "white" }}
          width={"100%"}
          height={"100%"}
        />
      </div>
  );
};
export default Canvas;
