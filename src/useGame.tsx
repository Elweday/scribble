"use client";
import { createContext, useContext } from 'react';
import { Actor, createActor, StateFrom } from 'xstate';
import { useActor, useSelector, useActorRef } from '@xstate/react';
import { machine } from './machine';
import { createActorContext } from '@xstate/react';

import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebsocketProvider } from "y-websocket";
import { useSyncedStore } from "@syncedstore/react";
import { useEffect } from "react";

type State = StateFrom<typeof machine>;

export const store = syncedStore({ state: {} as {context: State["context"], value: State["value"], }  });

const doc = getYjsDoc(store);

// Start a y-websocket server, e.g.: HOST=localhost PORT=1234 npx y-websocket-server

// const wsProvider = new WebsocketProvider("ws://localhost:1234", "scribble", doc);
// export const disconnect = () => wsProvider.disconnect();
// export const connect = () => wsProvider.connect();



export const ActorContext = createActorContext(machine);





export function GameProvider({children}:{children: React.ReactNode}) {

  return (
    <ActorContext.Provider>
      {children}
    </ActorContext.Provider>
  );
}

