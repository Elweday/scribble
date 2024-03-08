import { EventEmitter as UntypedEventEmitter } from "events";

class EventEmitter<S extends Record<string, any>> {
    private ee = new UntypedEventEmitter();
    emit<K extends string & keyof S>(evtName: K, payload: S[K]) {
        this.ee.emit(evtName, payload);
    };
    on<K extends string & keyof S>(evtName: K, listener: (payload: S[K]) => void) {
        this.ee.on(evtName, listener);
    };
    off<K extends string & keyof S>(evtName: K, listener: (payload: S[K]) => void){
        this.ee.off(evtName, listener);
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
