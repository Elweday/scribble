import { atom as createAtom, onMount } from "nanostores";
import { useStore } from "@nanostores/react";

interface Options {
    prefix: string;
}

export function storedAtom<
    T extends Record<string,any>,
    K extends keyof T = keyof T
>(initial: T, options?: {
    prefix: string;
    storedKeys?: K[]}){
    const storedKeys = options?.storedKeys || Object.keys(initial) as K[];
    const prefix = options?.prefix || ""
    const atom = createAtom<T>(initial);
    
    onMount(atom, ()=>{
        if (typeof window === "undefined") return;
        const keys = Object.keys(atom.get());
        storedKeys.forEach((key)=>{
            
            const saved = window.localStorage.getItem(prefix+(key as string));
            let value = saved;
            if (saved) {
            try {
                value = JSON.parse(saved)
            } catch {}
                atom.set({...atom.get(), [key]: value});
            }  
        })    
    })

    atom.subscribe((obj)=>{
        if (typeof window === "undefined") return;
        storedKeys.forEach((key)=>{
            let value = obj[key] as any; 
            try {
                value = JSON.stringify(obj[key])
            } catch {}
            // @ts-ignore
            window.localStorage.setItem(prefix+key, value);
        })
    })

    const use = () => useStore(atom)
    function set<K extends keyof T>(key: K, value: T[K]){
        atom.set({...atom.get(), [key]: value})
    }

    function get<K extends keyof T>(key: K){
        return atom.get()[key]
    }
    
    return {atom, set, use, get} as const;
}