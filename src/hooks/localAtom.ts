import { atom as createAtom, onMount } from "nanostores";
import { useStore } from "@nanostores/react";

interface Options {
    prefix: string;
}

export function storedAtom<T extends Record<string,any>>(initial: T, options?: Options){
    const prefix = options?.prefix || ""
    const atom = createAtom<T>(initial);
    
    onMount(atom, ()=>{
        if (typeof window === "undefined") return;
        const keys = Object.keys(atom.get());
        keys.forEach((key)=>{
            const saved = window.localStorage.getItem(prefix+key);
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
        const keys = Object.keys(obj);
        keys.forEach((key)=>{
            let value = obj[key]
            try {
                value = JSON.stringify(obj[key])
            } catch {}
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