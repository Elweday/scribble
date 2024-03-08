import { setup, assign, or, forwardTo, fromCallback, SendToAction } from "xstate";
import { io } from "socket.io-client";
export const socket = io('http://localhost:5665');

export const avatars = ["afro-boy",
"afro-female",
"afro-male",
"alien",
"arab",
"avocado",
"baby",
"batman",
"bear",
"boy-2",
"boy",
"breaking-bad",
"bug",
"builder",
"cactus",
"chaplin",
"coffe",
"crying",
"dead",
"draw-love",
"einstein",
"emo",
"fighter",
"gangsta",
"ghost",
"girl-2",
"girl-3",
"girl-4",
"girl",
"grandma",
"halloween",
"hindi",
"hipster",
"japanese",
"joker",
"kid-girl",
"kid-indian",
"male-2",
"male-3",
"male-indian",
"male-old",
"marilyn",
"muslim",
"nun",
"pilot",
"sheep",
"sick",
"sloth",
"xmas"] as const;

type Guess = {
    word: string;
    playerName: string;
    avatar: string;
}

type Player = {
    id: string;
    name: string;
    avatar: Avatar;
    score: number;
    guessed: boolean;  
    drawingRating?: number;
    timeStamp?: number;
}
    
type Context = {
    gameId: string;
    players: Player[];
    roundsLeft: number;
    currentWord: string;
    currentDrawerIndex: number;
    remainingTime: number;
    roundTime: number;
    rounds: number;
    guesses: Guess[];
    wordOptions: string[];
    maxPlayers: number;
    hints: number;
} 

export type Avatar = typeof avatars[number]


let playerId = 0;

type Event = 
| { type: "guess"; word: string; id: string }
| { type: "start_game"; gameId: string; roundTime: number; rounds: number; maxPlayers: number; hints: number}
| { type: "word_chosen"; word: string }
| { type: "restart_game" }
| { type: "join"; id: string; name: string; avatar: Avatar }
| { type: "rate_drawing"; rating: number; player_id: number }
| { type: "leave"; id: string }

const machineSetup = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  delays: {
    choose_word_duraton: 5000
  },  
  actors: {
    ws: fromCallback(({sendBack, self, receive}) => {
      socket.on('connect', () => {
        socket.emit('join', { id:socket.id, name: socket.id, avatar: "afro-male" });
      })
      socket.on('disconnect', () => {
        socket.emit('leave', { id:socket.id });
      })
      socket.on('user-joined', (data) => {
        sendBack({ type: "join", name: data.name, avatar: data.avatar })
      })

      socket.on('user-left', (data) => {
        sendBack({ type: "leave", id: data.id })
      })
      
      socket.on('load_players', (players) => {
        players.forEach((player: { id: string, name: string, avatar: string }) => {
          sendBack({ type: "join", name: player.name, avatar: player.avatar }, );
        })
      });

    })
  },
  actions: {
    start_game: assign(({ context, event }) => {
        if (event.type === "start_game") {
            return {
                ...context,
                hints: event.hints,
                maxPlayers: event.maxPlayers,
                rounds: event.rounds,
                roundsLeft: event.rounds,
                currentWord: "",
                currentDrawerIndex: -1,
                remainingTime: event.roundTime,
                roundTime: event.roundTime,
            }
        }
    return context
    }),
    start_round: assign(({ context }) => ({
        roundsLeft: context.roundsLeft - 1,
        currentDrawerIndex: (context.currentDrawerIndex + 1) % context.players.length,
        remainingTime: context.roundTime
    })),
    choose_word: assign({ 
      currentWord: ({ context, event }) => {
        return event.type === "word_chosen" ? event.word : context.currentWord;
      }
    }),
    get_words: assign({ wordOptions: () => {
      return ["apple", "banana", "carrot"]
    }}),
    pick_random_word: assign({
      currentWord: ({ context }) => {
        const index = Math.floor(Math.random() * context.wordOptions.length);
        return context.wordOptions[index] as string;
      }
    }),
    remove_options: assign({ wordOptions: () => []}),
    add_player: assign({
      players: ({ context, event }) => {
        if (event.type === "join") {
          return [...context.players, { id: event.id, name: event.name, avatar: event.avatar, score: 0, guessed: false }];
        }
        return context.players;
      },
    }),
    remove_player: assign({
        players: ({ context, event }) => {
          if (event.type === "leave") {
            const players = [...context.players]
            return players.filter((player)=>player.id!=event.id);
          }
          return context.players;
        },
      }),  
    rate_drawing: assign({
      players: ({ context, event }) => {
        if (event.type === "rate_drawing" ) {
            const newPlayers = [...context.players];
            const player = newPlayers[event.player_id] as Player;
            if (player) {
                player.drawingRating = event.rating;
                newPlayers[event.player_id] = player;
            }
            return newPlayers
        }
        return context.players;
      }
    }),
    new_guess: assign({
        players: ({ context, event }) => {
            if (event.type === "guess" ) {
                const newPlayers = [...context.players];
                const idx = newPlayers.findIndex((player)=>player.id===event.id);
                const player = newPlayers[idx] as Player;
                if (!player.guessed){
                    player.guessed = context.currentWord === event.word;
                    player.timeStamp = context.remainingTime;
                    newPlayers[idx] = player;
                }
                return newPlayers
            }
            return context.players;
          },
        guesses: ({ context, event }) => {
            if (event.type === "guess") {
                const guesser = context.players.find((player)=>player.id===event.id) as Player;
                return [...context.guesses, {word: event.word, playerName: guesser.name, avatar: guesser.avatar}];
            }
            return context.guesses;
        }
        }),
    decrement_time: assign({
        remainingTime: ({ context }) => context.remainingTime - 1
    }), 

    calculate_scores: assign({
        players: ({ context }) => {
            return context.players.map((player)=>{
                const increase = player.guessed ? player.timeStamp as number : 0; 
                return {...player, score: player.score + increase};
            });
        }
    }), 
  },
  guards: {
    room_not_empty: ({ context }) => context.players.length > 1,
    all_guessed: ({ context }) => context.players.every(p => p.guessed),
    rounds_not_over: ({context }) => context.roundsLeft > 0,
    time_up: ({context }) => context.remainingTime <= 0,
    drawing_not_rated: ({context }) => context.remainingTime <= 0,
    room_not_full: ({ context }) => context.players.length < context.maxPlayers
  },
})

export const machine = machineSetup.createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCWAjLAbMAsgIYoAWGAdmAHQDqRGALpVAAQBmA9mqwA65EAnmDSwAxACtOlANoAGALqJQvTrCYZOFZSAAeiAMwAWAKzUjcgJwBGOUcsB2UwDYAHCZMAaEIMSXnRtTOztb+AExhjsFyYQC+sd6omDj4xGSUNPQaFGxcPPxCIuKwjERojAD6UEQAtmDySkggqurMWjr6CMaW5mHWBgbOxpHWJg4O3r4IDiYG1CaWcksGlgYm7jHxiejYeIQk5FTUAOK1YKyUfGicUGhwsNQASpwArhQQrGhvFCxiUC-3Bo6FoadpNTrWMIDaiWSx9JauNbWZGTPwOZzUMJGdExByLQbOOIJEBJXapA4ZE5nC4UK43O6wB7PN4fL4UH45MRoIiMMAVCDcgDuLCBTRBbW04MQyI881WwVclhMYRMzicqIQrlcchhcKMBlcarsgy2JJ2KX26SOpzqNLpt3uT1e70+31+opUalBktAEJM1gc1DkkMs9mxg2NGuRS2oTgihvcq1DRO2yT2aUONBt50uvGuDsZTpZrvZv10JR5NCI7F5aAAFLYlgBKMSki0ZynZu15+mO5kutkcqAe5peiUdaV9HpuCKQ5UmIxasIahxa2OmOQOOSufXWQ0ps1p8lWrPU3P5hlM50fMDvSBiculXnUau1usmJZyFtt9MU61n2kewLK9i1vCBIBHcVNB9PRpX9QNg0iMMHAjfUNWCHodzCFC5ANFUIiMU0f2PTMqVtc9e0LfsbzvCAHwrZ9XxEd9P2-c1fxPMic0Ai8+2vVgwIg6xGk9VpoInBA3GsWN1nRBwsQ-VxrCjSFAiVfxFw2A0AyI9iSM7AD7UvOhuA+MhOC9TlBVMipzNgW9ILHcSpU1ZwzAGAwwiU7UHFGRcozkQlzDVIZrAsWYFxMXSj0tUiuwo4CTLQMzSAs9ROUfSsXxrZjzLUPlrOS-kXm5RgtDYmKO3-cieMoh5aFM1g8vS4dFGBJywV9RBDXcgYvL3Tc-NcDVQzmZw5A8RFsKMUwjGsaKyVigzbU4AA3EQuTgUpyiqM5HLEzrYIQMI7HmTz1lsMYDG3MKNUVQINz6PFIhWQL4mJChOHA+AmmIpaqHag6YIhU6YkbLdtyGD9lx8RAN2oLVnCVCxPJQ7FnAW9s-0yBhmByDhuD4ARhFEQHvQkiIzEWJYULxGbYSMZwNXWQJIU8sI1VCCx7Exji4sMoDLzJ8cXICOYPA8ex-ROiwYamWZXExKxFj6ZV0UXXn9Oq7ijL44tBxYYXnK6hBbEWag1jhVYYn1Ywmdh03NwxaH0SR2xIjczX-tPGrdao-jBIgI3DohUxAzhEIrA-FDrDcO7Y6DOwlT6hZHFcL2qp9nXBcdBrkqa1LLKgYPgcQN35glqXITsGIV3G2NrqcJZVRVAwM+xrjWDWkQS4k0YwiDeFNwRKHa4d2wZnMbdGZsLUwshd7YiAA */
  context: {
    maxPlayers: 8,
    hints: 2,
    gameId: "",
    players: [],
    guesses: [],
    wordOptions: [],
    roundsLeft: 0,
    rounds: 0,
    roundTime: 0,
    remainingTime: 0,
    currentWord: "",
    currentDrawerIndex: 0,
},

  id: "scribbleMachine",
  initial: "Waiting for players",
  invoke: {
    id: "ws",
    src: "ws",
  },
  states: {
    "Waiting for players": {
      on: {
        join: {
          actions: {
            type: "add_player",
          },
          guard: "room_not_full",
        },
        leave: {
          actions: {
            type: "remove_player",
          },
        },
        start_game: {
          target: "Game in progress",
          actions: "start_game",
          guard: {
            type: "room_not_empty",
          },
        }
      },

      description:
        "Waiting for enough players to join before starting the game."
    },

    "Game in progress": {
      initial: "Word choosing",
      description:
        "The game is in progress, players take turns to draw and others guess.",
      states: {
        "Round running": {
          after: {
            "1000": {
                target: "Round running",
                actions: "decrement_time",
                reenter: true,
            }
          },
          on: {
            guess: {
              actions: "new_guess",
              target: "Round running"
            },
            rate_drawing: {
              target:"Round running",
              actions: "rate_drawing",
              guard: "drawing_not_rated"
            }
          },
          always: {
            target: "Round ended",
            guard: or(["all_guessed", "time_up"]),
          },
          description:
            "Other players are guessing what the current player has drawn.",
        },

        "Round ended": {
          entry: "calculate_scores",
          exit: "remove_options",
          description: "The round has ended and the scores are shown, either because time is up or all players have guessed correctly.",
          after: {
            5000: [
                { target: "Word choosing", guard: "rounds_not_over" },
                { target: "#scribbleMachine.Game over" }
              ]
          }
        },
        "Word choosing": {
          entry: "get_words",
          on: {
            "word_chosen": {
              target: "Round running",
              actions: ["choose_word", "start_round"],
            }
          },
          after: {
            choose_word_duraton: {
              target: "Round running",
              actions: ["pick_random_word", "start_round"],
            },
            
          },
          description: `The player is given three options, if the time is up the system choses automatically`
        }
      },
    },

    "Game over": {
      on: {
        restart_game: {
          target: "Waiting for players",
        }
      },
      description:
        "The game has ended, scores are displayed and the game can be restarted.",
    }
  },

});

