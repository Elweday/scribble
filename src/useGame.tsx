"use client";
import { createContext, useContext } from 'react';
import { Actor, createActor } from 'xstate';
import { useActor, useSelector, useActorRef } from '@xstate/react';
import { machine } from './machine';
import { createActorContext } from '@xstate/react';

export const ActorContext = createActorContext(machine);

export function GameProvider({children}:{children: React.ReactNode}) {
  return (
    <ActorContext.Provider>
      {children}
    </ActorContext.Provider>
  );
}

