import { Prisma } from "@prisma/client"
export type GameWithRounds = Prisma.GameGetPayload< { include: { players: true, rounds: {
    include: {
        guesses: true
    }
} } }>

export type Game = Omit<GameWithRounds, 'rounds'> 

export type Players = Game['players']

export type GameWithoutPlayers = Omit<Game, 'players'> 


export type PlayersChange = {
    type: "JOIN" | "LEAVE";
    player: {
      name: string;
      client: string;
    }
    host: boolean
  }
  
  