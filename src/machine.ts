import { setup, assign, or, forwardTo, fromCallback, sendTo, log } from "xstate";
import { avatars, AvatarName } from "./constants/avatars";
import {Event, Context, Player} from "./types"

const LOCAL_EVENTS: Event["type"][] = ["set_me"] 


export type Avatar = typeof avatars[number]

const randomAvatar = () => {
  const idx = Math.floor(Math.random() * avatars.length)
  return avatars[idx]
}

const machineSetup = setup({
  types: {
    context: {} as Context,
    events: {} as Event,
  },
  delays: {
    choose_word_duration: 5000,
    leaderboard_duration: 5000,
  },  

  actions: {

    set_me: assign(({ context, event }) => {
        if (event.type === "set_me") {
            return {
                ...context,
                me: event.id,
            }
        }
      return context
    }),
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

    add_player: assign(({ context, event })=>{
      if (event.type === "join") {
        const player = { id: event.id, name: event.name, avatar: event.avatar, score: 0, guessed: false };
        return {
          ...context,
          players: [...context.players, player],
          owner: context.owner ? context.owner : event.id
        }
      }
      return context

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
    room_not_full: ({ context }) => context.players.length < 0,
    is_owner: ({ context }) => context.owner === context.me,
  },
})

export const machine = machineSetup.createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5SwMYCcCWAjLAbMAsgIYoAWGAdmAMSxgAuA+gLZgDaADALqKgAOAe1gZ6GARV4gAHogBMHABwAWAHQB2AIxqAzGrVLZa2QDZZSgDQgAnogUBOAKwrjS7duM6TDhceMBfP0tUTBx8YjJKGgArAUpOHiQQQWFRcUkZBHlNFQcObQ47NQcHIx9LGwQNDgNnbQ06jSrfAwCg9Gw8QhJyKmp8IgA3dm5JZJExCUSM2SqOFSVjDjUODi8favLERY0VWT3jRzVjZVWNVpBgjrDuyOoAKnjRoXG0qblquYc3RSPtWW17GpNggjHZ5nZXBCVnZZAoHGdAhd2qEuhEqCoAOpEcYUKAAAgAZgI0Hi+LgiFYwGhYLR6EQ0EwoERWI9EmNUpNQBltEowQZ6u4ebI7BoSkDrIgitocnYVnk7NpvLlZOdLijwj0wCoAOLMsB4yiktACKBoOCwFQAJQEAFcKBA8Wg7RRKFBqFAbebWfxnhz0ogNP9pXYYbMFIrGhpgYVjLslEdVmpZe5TKrkZ0NZEdXqDRQjSazbALda7Q6nRQXbjqGgiPQwIwIDWAO6u71JX0Tf2VUVOBwK3z2ByyBweCwShAKBRzENmAEearuNMhDM3dG61i5-Om81W232x3O13UNvsztvSrwtQqDiBiEQnSLVzAxordQGWHHPvaCEqxFqldolq676oafDGtuRa7qWB4VkeUiwHSdYqEQBJ1mgAAUswcAAlLQ6bXIB2YbqB4GFsWe5loeuInh2rxcgGMxgsceyBkODhKJOsjAmok5vrkyzKHUPi-m0y4EZqREgXmYEFjuJb7mA9qQNQ8GIVqKFoehuQrLh-7iVmwGbjJEHkdBikQJANEpGe9EXlo163ry8buAuwK+GCyiGPkALDnsShLlcqISYZJGyZB8kOuZymqbW6moVSWlyrp+FBQZOahSZUEKUpEBsBoCQ+tZdHSFsCg7EUChHEYSi5GVz6Bqojh2C4k65ACWgBeqq5Ael0mkTuGLEg6ZACM8VZNkNjAjXQFBWS8nIlROxhOG4fxlVOmjsQoz4cKY8weMYdRKBwXzsQ4nUAcFvVbmRmJDXiI1jW6MVIRpCWPXQjATWgEANjaNb0OIyViala7XcZt2DT9D2kKNwjUSMbK0QtGQ+CtbiwhoG2ihx0auM4J3eH8+g1UoCKiYFmZgxuAhDGg1ZwHSDKMEyLKI4V81dvIqhfMOZUnToigaGOFT2KoNWnEmwrfrtASIhQAgWfAiR6aDYBPEVKMBtU14zCsyyKIdyrAsdqhLJoZjyAo-yKBd+noliOL4kSJJkhSVLKxzfrnnsTiyvrugQryELGMC3iqIGfwmJoUK8nbauSUZ-VFhrnPni40rFMUvLwtzqxhwCuwFKGNXNfoCjx1TPXEX1YWmfu5aVlAqfe7ZVSyioiowgqqyuDyofjlURw5Im7lVMKy2V91icZbdEV4lFEAtzZi3C186jhoJ3hY0+45FE4RRk9+JiBkY5NIiDVcz7XmVQ8NsNPcvxUZAcOxZ+xjiBh8XF74s6j5PoFYI5hzaCnoRQytMqRPy1heWQutZgGx8IqfOg8lhOGOsoV+k5haBjln4IAA */
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
    owner: "",
    me: ""
},

  id: "WordoodleMachine",

  initial: "Waiting for players",
  states: {
    "Waiting for players": {
      on: {
        start_game: {
          target: "Game in progress",
          actions: "start_game",
          guard:  "room_not_empty",
        },
        join: {
          actions: ["add_player"],
        },
        leave: {
          actions: ["remove_player"],
        },
    
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
            "leaderboard_duration": [
                { target: "Word choosing", guard: "rounds_not_over" },
                { target: "#WordoodleMachine.Game over" }
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
            choose_word_duration: {
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

