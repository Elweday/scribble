import { atom } from 'jotai'
import { GameWithRounds } from '~/types';


const gameStore = atom<GameWithRounds>({
    players: [],
    rounds: [],
    id: '',
    createdAt: new Date(),
    duration: 0,
    nrounds: 0,
    guessingTime: 0,
    public: false,
    started: false,
    hints: 0,
    max_playes: 0,
})
export { gameStore }

