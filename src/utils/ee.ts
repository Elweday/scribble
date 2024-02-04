import { EventEmitter } from "events";

type CreateTypedEventEmitter<Schema extends Record<string, any>> = {
    emit<K extends string & keyof Schema>(evtName: K, payload: Schema[K]): void;
    on<K extends string & keyof Schema>(evtName: K, listener: (payload: Schema[K]) => void): void;
    off<K extends string & keyof Schema>(evtName: K, listener: (payload: Schema[K]) => void): void;
};

export function TypedEventEmitter<Schema>(): CreateTypedEventEmitter<Schema> {
    const ee = new EventEmitter();
    return {
        emit: (evtName, payload) => {
            ee.emit(evtName, payload);
        },
        on: (evtName, listener) => {    
            ee.on(evtName, listener);
        },
        off: (evtName, listener) => {           
            ee.off(evtName, listener);
        }
        
    };
}


type Schema = {
    message: {
        sender: string;
        text: string;
        timestamp: Date;
    }
    game: {
        gameId: string;
        players: string[];
    }
}


