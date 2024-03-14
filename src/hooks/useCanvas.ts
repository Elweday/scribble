import { useReducer, type RefObject} from 'react'
import { type State, type Action } from "~/constants/draw";
import { useGameSyncedStore } from "~/data/gameStore";





const makeReducerFunc = (canvasRef:RefObject<HTMLCanvasElement>) => (state: State, {action, payload}: Action) => {
    let {x, y, width, color, drawing, history, historyIndex} = {...state, ...payload};
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D; 
    ctx.strokeStyle = state.color
    ctx.lineWidth = state.width
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    switch (action) {
      case "START":
        ctx.beginPath();
        return { ...state, drawing: true, x,y };
      case "POINT":
        ctx.beginPath();
        ctx.lineTo(x,y);
        ctx.lineWidth = state.width * 2.3;
        ctx.stroke();
        ctx.lineWidth = state.width;
        ctx.closePath();
        return { ...state, x,y, drawing: false };
      case "DRAW":
        if (!state.drawing) return state;
        ctx.lineTo(x,y);
        ctx.stroke();
        return { ...state,  drawing: true, x,y };
      case "STOP":
        if (state.drawing ) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          history.push(imageData);
          historyIndex = historyIndex +1;
          ctx.closePath();
        };
        return { ...state, drawing: false, history, historyIndex };
      case "CLEAR":
        ctx.clearRect(0, 0, canvas.width * 5, canvas.height * 5);
        history = [];
        historyIndex = -1;
        return { ...state, x: 0, y: 0, history, historyIndex };
      case "COLOR":
          return { ...state, color };
      case "WIDTH":
          return { ...state, width };
      case "UNDO":
        if (historyIndex <= 0) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          history = [];
          historyIndex = -1;
          return { ...state, history, historyIndex };
        } else {
          historyIndex = historyIndex - 1;
          history.pop();
          ctx.putImageData(history[historyIndex], 0, 0);
          return { ...state, history, historyIndex };
        }
      default:
        return state; 
    }
  };

export const useCanvas = (canvasRef: RefObject<HTMLCanvasElement>, initial: State) => {
    const reducer = makeReducerFunc(canvasRef);
    return useReducer(reducer, initial)
}

