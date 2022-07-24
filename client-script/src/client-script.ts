
/**
 * Check that `game` has been initialised
 */
function isGame (game: any): game is Game {
  return game instanceof Game;
}

/**
 * Throw if `game` has not been initialized. This is hyper unlikely at runtime
 * but technically possible during a calamitous upfuckage to TS keeps us honest
 * and requires a check.
 */
function assertGame (game: any): asserts game is Game {
  if (!isGame(game)) {
    throw new Error("game used before init hook");
  }
}

// CONFIG;

export const registerClientVisit = (game: Game) => {
  assertGame(game);
  // fetch;
  const url = import.meta.env.COUNTER_URL;
  const version = game.version;
  console.log({ url, version });
};
