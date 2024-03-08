"use client"
import { type State, type Action } from "~/constants/game";
import { useReducerAtom } from 'jotai/utils'
import { atom } from "jotai";
import { api } from "~/trpc/react";

const MAX_SCORE = 350;


function calculateScores(game: State) {
  const { remainingTime, drawingTime, drawingPlayerIndex } = game; 
  const guessCount = game.players.filter(p => p.guessed).length
  const playersCount = game.players.length
  return game.players
    .map((player, i) => {
      const isDrawing = drawingPlayerIndex === i ? 0 : 1;
      if (isDrawing) return {...player, score: player.score + MAX_SCORE * (guessCount /  playersCount)}
      const penalty = remainingTime / drawingTime;
      const guessed = player.guessed ? 1 : 0;
      const score = player.score + ( MAX_SCORE * penalty * guessed );
      return {...player, score}
    })
  }

const stateAtom = atom<State>({
  public: false,
  gameId: "",
  gameStarted: true,
  remainingTime: 0,
  currentRound: 0,
  currentWord: "",
  currentScreen: "LOBBY",
  drawingPlayerIndex: 0,
  players: [{
    name: "nasser",
    score: 720,
    avatar: "Cuddles",
    guessed: false
  }, 
  {
    name: "ahmed",
    score: 350,
    avatar: "cuddles",
    guessed: false
  }],
  hints: 3, 
  maxPlayers: 3,
  rounds: 3,
  drawingTime: 0
})

const reducer = ( v: State, a: Action) => {
    const { gameStarted, remainingTime, currentRound, currentWord, currentScreen, drawingPlayerIndex, players } = {...v, ...a.payload};
    switch (a.type) {
      case "CUSTOM":
        return { ...v, ...a.payload } as State;
      case "START_GAME":
        return { ...v, gameStarted: true, currentScreen: "WORD_CHOOSING" } as State;
      
      case "NEXT_PLAYER":
        return ( 
          ( players.length > drawingPlayerIndex + 1 ) ?
            { ...v, currentRound: currentRound + 1, drawingPlayerIndex: 0, currentScreen: "WORD_CHOOSING" }
            : { ...v, drawingPlayerIndex: drawingPlayerIndex + 1, currentScreen: "WORD_CHOOSING" }
          ) as State; 
      
      case "CHOOSE_WORD": 
        return { ...v, currentScreen: "DRAWING", currentWord } as State;

      case "DRAWING_DONE":
        return { ...v, currentScreen: "WORD_CHOOSING" } as State;
        
      case "END_GAME":
        return { ...v, gameStarted: false, currentScreen: "SCORES" } as State;
      case "GAME_CREATE":
        return { ...v, ...a.payload } as State;
      default:
        return v as State;
    }
  };
  
export const useGameState = () => {
  const { mutate : serverDispatch } = api.gameState.mutation.useMutation();

  const [ gameState, clientDispatch ] = useReducerAtom<State, Action>(stateAtom, reducer);

  function dispatch(action: Action) {
    serverDispatch({...action, gameId: gameState.gameId});
    clientDispatch(action)
  }

  const subscription =  () => api.gameState.subscription.useSubscription({ gameId: gameState.gameId }, {
    onData: (data) => {
      clientDispatch(data);
    },
  })
  return { game: gameState, dispatch, subscription };
}





