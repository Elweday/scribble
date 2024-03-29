diff --git a/src/app/_components/Game.tsx b/src/app/_components/Game.tsx
index f75f846..17f978f 100644
--- a/src/app/_components/Game.tsx
+++ b/src/app/_components/Game.tsx
@@ -11,25 +11,22 @@ import { useRouter } from 'next/navigation'
 
 export default function Home(props : {gameId: string}) {
   const {state, send, is, me} = useGameSyncedStore();
-  const {avatar, name} = local.use()
-  const id = useRef(uuidv4());
+  const {avatar, name, id} = local.use()
   const router = useRouter();
 
-  const addPlayer = useCallback(() => {
-    send({type: "join", name, avatar, roomId: props.gameId, id: id.current})
+  const join = useCallback(() => {
+    send({type: "join", name, avatar, roomId: props.gameId, id})
   }, [state.context.players])
 
   useEffect(function onJoin(){
-    if (is("has_owner")){
-      addPlayer();
-    } else {
-      local.set("error", `Room "${props.gameId}" does not exist`)
+    join();
+    if (local.get("error") !== null) {
       typeof window !== 'undefined' && router.push(`/error`)
-    }
+    }    
   }, [state.context.players])
 
   useEffect(() => {
-    const handler = () => send({type: "leave", id: id.current});
+    const handler = () => send({type: "leave", id });
     window.addEventListener('beforeunload', handler);
   }, [state.context.players]);
 
diff --git a/src/constants/game.ts b/src/constants/game.ts
index 0f4362d..49a4599 100644
--- a/src/constants/game.ts
+++ b/src/constants/game.ts
@@ -5,6 +5,7 @@ import { storedAtom } from "~/hooks/localAtom";
 import syncedStore from "@syncedstore/core";
 import { WebsocketProvider } from "y-websocket";
 import {avatars} from "~/constants/avatars";
+import { v4 as uuidv4 } from "uuid";
 import { Opts, Paths, Points } from "./draw";
 
 
@@ -14,8 +15,6 @@ export const meta = {
     link: "https://wordoodle.vercel.app/",
 } 
 
-
-
 const randomAvatar = () => {
     const idx = Math.random() * avatars.length;
     return avatars[Math.floor(idx)] as AvatarName;
@@ -27,20 +26,23 @@ const getRandomUser = () => {
 }
 
 
-type Me = {
+type Local = {
     id: string;
     name: string;
     avatar: AvatarName;
     error: string | null,
     conn: WebsocketProvider | null, 
 }
-export const local = storedAtom<Me>({
-    id: "",
+export const local = storedAtom<Local>({
+    id: uuidv4(),
     name: getRandomUser(),
     avatar: randomAvatar(),
     error: null,
     conn: null
-}, {prefix: "_wordoodle_"});
+}, {
+    prefix: "_wordoodle_", 
+    storedKeys: ["avatar", "name", "id"]
+});
 
 export const delays = {
     "word_choosing": 15000,
@@ -48,18 +50,11 @@ export const delays = {
 }
 
 export const store = syncedStore({ state: {} as State}) as {state: State};
-const doc = getYjsDoc(store);
-
-const rooms = new Map<string, WebsocketProvider>();
-
 
 export const connect = (roomId: string) => {
-    if (rooms.has(roomId)) {
-        return rooms.get(roomId)!;
-    }
-    const conn = new WebsocketProvider('wss://demos.yjs.dev/ws', roomId, doc, );
-    rooms.set(roomId, conn);
-    local.set("conn", conn);
+    const doc = getYjsDoc(store);
+    const conn = new WebsocketProvider('wss://demos.yjs.dev/ws', roomId, doc);
+    return conn;
 }
 
 type StateValue = "lobby" | "game.word_choosing" | "game.running" | "game.round_ended" | "done" 
@@ -134,6 +129,7 @@ export type Event = (
 | { type: "reset_players" }
 | { type: "create_room"; roomId: string; }
 | { type: "remove_room"; }
+| { type: "connect"; roomId: string;  }
 )
 
 
diff --git a/src/data/gameStore.ts b/src/data/gameStore.ts
index d8dd4a8..363f1a1 100644
--- a/src/data/gameStore.ts
+++ b/src/data/gameStore.ts
@@ -43,16 +43,37 @@ const guards = (state: typeof store.state) => ({
     "room_not_full": () => Object.keys(state.context.players).length >= state.context.config.maxPlayers,
     "has_owner" : () => state.context.owner !== "",
     "word_choosing_ruuning": () => state.context.word_choosing_time > 0,
-    "game_over": () => state.value === "done"
+    "game_over": () => state.value === "done",
+    "connected": () => local.get("conn")!== null,
 }) as const; 
 
 
 const actions: Events =  {
     create_room: ({ payload }) => {
+        send({ type: "connect" , roomId: payload.roomId })
         store.state.context.gameId = payload.roomId;  
         store.state.context.owner = local.get("id");
-        local.set("error", null); 
     },
+    join: ({ payload })=>{
+        local.set("id", payload.id);
+        if (!is("connected")) {
+            send({ type: "connect" , roomId: payload.roomId })
+        }
+        if (!is("has_owner") && !is("has_players")) {
+            local.set("conn", null);
+            local.set("error", `Room "${payload.roomId}" does not exist`)
+        } else {
+            local.set("error", null);
+            store.state.context.players[payload.id] = { name: payload.name, avatar: payload.avatar, score: 0, guessed: false };
+        }
+        console.log(Object.keys(store.state.context.players))
+    },
+    leave: ({ payload }) => {
+        const id = local.get("id");
+        Object.hasOwn(store.state.context.players, id) ? delete store.state.context.players[id] : null;
+        local.get("conn")?.disconnect();
+    },
+
     start_game: ({ payload }) => {
         store.state.context.gameId = payload.gameId
         store.state.context.currentDrawer = store.state.context.owner
@@ -136,20 +157,9 @@ const actions: Events =  {
     pick_random_word:  () => {
         send( { type: "choose_word", word: oneOf(store.state.context.wordOptions) } )
     },
-    join: ({ payload })=>{
-        local.set("id", payload.id);
-        connect(payload.roomId);
-        store.state.context.players[payload.id] = { name: payload.name, avatar: payload.avatar, score: 0, guessed: false };
-    },
-    leave: ({ payload }) => {
-        const id = local.get("id");
-        const isOwner = store.state.context.owner === id;
-        if (isOwner) {
-            const owner = Object.keys(store.state.context.players).find((id)=>id!== store.state.context.owner) as string;
-            store.state.context.owner = owner;
-        }
-        Object.hasOwn(store.state.context.players, id) ? delete store.state.context.players[id] : null;
-        local.get("conn")?.disconnect();
+    connect: ({ payload }) => {
+        const conn = connect(payload.roomId);
+        local.set("conn", conn);
     },
     rate_drawing: ({  payload }) => {
         (store.state.context.players[payload.player_id] as Player).drawingRating = payload.rating;
diff --git a/src/hooks/localAtom.ts b/src/hooks/localAtom.ts
index 57c6956..77315ec 100644
--- a/src/hooks/localAtom.ts
+++ b/src/hooks/localAtom.ts
@@ -1,12 +1,15 @@
 import { atom as createAtom, onMount } from "nanostores";
 import { useStore } from "@nanostores/react";
 
-interface Options {
+export function storedAtom<
+    T extends Record<string,any>,
+    K extends keyof T = keyof T
+>(initial: T, options?: {
     prefix: string;
-}
-
-export function storedAtom<T extends Record<string,any>>(initial: T, options?: Options){
-    const prefix = options?.prefix || ""
+    storedKeys?: K[]
+}){
+    const prefix = options?.prefix || "";
+    const storedKeys = options?.storedKeys || Object.keys(initial) as K[];
     const atom = createAtom<T>(initial);
     
     onMount(atom, ()=>{
@@ -26,12 +29,12 @@ export function storedAtom<T extends Record<string,any>>(initial: T, options?: O
 
     atom.subscribe((obj)=>{
         if (typeof window === "undefined") return;
-        const keys = Object.keys(obj);
-        keys.forEach((key)=>{
-            let value = obj[key]
+        storedKeys.forEach((key)=>{
+            let value = obj[key] as any; 
             try {
                 value = JSON.stringify(obj[key])
             } catch {}
+            // @ts-ignore
             window.localStorage.setItem(prefix+key, value);
         })
     })
