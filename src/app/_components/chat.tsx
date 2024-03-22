"use client";
import { cn } from "~/utils/cn";
import GuessForm from "./guess-form";
import { useGameSyncedStore } from "~/data/gameStore";
import { distance } from 'fastest-levenshtein';

const Guess = (props: { id: string; word: string; timeStamp: number; name: string | undefined; round: number; currentWord: string; currentRound: number; guessers: [string, number | undefined][]; me: string; currentDrawer: string }) => {
    const  { id, word, name, round, currentWord, currentRound, currentDrawer, guessers, me, timeStamp } = props;
    // const isOld = round < currentRound;
    const isCorrect = word === currentWord;
    const isGuessed = guessers.find((guesser) => guesser[0] === id);
    const guesserGuessTimestamp = isGuessed ? isGuessed[1] : undefined;
    const isGuessAfter = guesserGuessTimestamp && (timeStamp < guesserGuessTimestamp);
    const meGuessed = guessers.find((guesser) => guesser[0] === me);
    const isClose = distance(word, currentWord) < currentWord.length / 2;
    const isMe = id === me;

    const show = (
        (meGuessed) || (isMe)  || me === currentDrawer || ((!isGuessed || !isGuessAfter) && !meGuessed)
    )
    const highlight = (isCorrect || ( isClose && isMe )) ;


    return  (show) && (
    <li className="flex flex-col">
      <span className={cn("origin-bottom-left scale-75 text-xs font-bold text-slate-300", {
        "text-slate-500": !name,
      })}>
        {name ? name : "Player Left"}
      </span>
      <span
        className={cn("lg:text-md text-xs ", {
          "text-green-500": highlight,
        })}
      >
        {isCorrect ? "Guessed it!" : ( isClose && isMe ) ? `"${word}" was close!` : word}
      </span>
    </li>
  );
};

export const Chat = () => {
  const { state, me } = useGameSyncedStore();
  const currentRound = state.context.config.roundTime - state.context.roundsLeft;
  const currentDrawer = state.context.currentDrawer.toLocaleLowerCase();
  const guessers = Object.entries(state.context.players).filter(([_, player]) => player.guessed === true).map(([key, {timeStamp}]) => [key, timeStamp]) as [string, number | undefined][];
  const currentWord = state.context?.currentWord;
  const guesses = [...state.context.guesses].reverse();
  const isMyTurn = currentDrawer === me.id;

  const getProps = (id: string) =>  {
    const player = state.context.players[id];
    return { name: player?.name, currentWord, currentRound, guessers, me:me.id, currentDrawer }
  };

  return (
    <div className="block h-full w-full justify-between space-y-3 rounded-xl  bg-black/10 p-3">
      <ul className="flex w-full  flex-col-reverse max-h-96 gap-2 overflow-y-auto  lg:gap-2  ">
        {guesses.map(({ id, word, round, timestamp }, index) => (
            <Guess word={word.toLocaleLowerCase()} timeStamp={timestamp} round={round} id={id} key={index} {...getProps(id)} />
        ))}
      </ul>
    {
      !isMyTurn && <GuessForm />
    }
    </div>
  );
};
