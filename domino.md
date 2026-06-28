# Neon Domino Programming Notes

## File

- Main game file: `domino.html`
- Type: static, self-contained HTML/CSS/JavaScript
- External dependencies: none
- Intended use: open directly in a browser or serve through a simple static server

## Game Variants

### Puerto Rican Dominoes, Doble Seis

- Tile set: 28 tiles, `0|0` through `6|6`
- Players: 4 players, 2 vs 2
- Teams:
  - Team A: You and Partner
  - Team B: Opponent R and Opponent L
- Deal: 7 tiles per player
- Boneyard: none
- First round opener: holder of `6|6`
- Later opener: selected setup rule, either previous winner or rotation
- Target score: 200
- Passing: no draw; a pass reveals the player cannot play either current board end
- Scoring:
  - Puerto Rican scoring counts remaining pips from every player except the player who finished.
  - On blocked rounds, the team with the lower combined pip count wins.

### Cuban Dominoes, Doble Nueve

- Tile set: 55 tiles, `0|0` through `9|9`
- Players: 4 players, 2 vs 2
- Deal: 9 tiles per player
- Boneyard: 19 tiles locked away and never drawn
- First round opener: holder of `9|9`
- Fallback: if `9|9` is locked in the boneyard, the highest double in play opens
- Later opener: selected setup rule, either previous winner or rotation
- Target score: selectable, 100 or 150
- Passing: no draw; the missing tile might be in another hand or locked in the boneyard
- Scoring:
  - Cuban scoring counts only the two opponents' remaining pips.
  - Partner pips do not count toward the winning team's score.

## UI Layout

- The game screen is always active.
- The Neon Domino setup panel is a fixed popup overlay above the game.
- `Menu` acts like a pause/setup overlay after a match starts.
- The menu overlay can close by:
  - pressing `Esc`
  - clicking outside the setup panel
- On small screens, the log panel is hidden to preserve the game board and controls.
- The full game is designed to fit inside `100vh`.

## Player Colors

- You: cyan
- Partner: green
- Opponent R: magenta
- Opponent L: yellow

Each played board tile gets a small colored dot showing which player placed it.

Dot placement:

- Always above the ficha's top edge.
- Centered on the tile.
- Horizontal tile: dot is centered over the wide side.
- Vertical tile: dot is centered over the narrow side.

## Player Action Status

Each player zone has a compact action status marker:

- Green check `✓`: player made a play
- Red `X`: player passed

The status marker is positioned under the player label area so it does not cover the human action buttons.

## Human Controls

Human player buttons:

- `Play Left`
- `Play Right`
- `Pass`
- `Hint`
- `Cheat`

The first play of a round is always centered on the board. If the human clicks `Play Left` or `Play Right` for the opening play, the game still treats it as a center opening move.

`Pass` is enabled only when the human has no legal move.

`Hint` selects/logs the AI-recommended move for the human.

`Cheat` reveals Partner's tiles for 3 seconds, then hides them again.

## Board Layout

The board uses JavaScript layout instead of normal CSS wrapping.

Important function:

- `layoutBoardTiles()`

Behavior:

- Measures the board area.
- Scales board tiles based on available width and height.
- Places tiles in a serpentine track.
- Wraps rows inside the board bounds.
- Turns row-edge tiles vertical when useful so the chain continues inside the visible area.
- Recalculates on:
  - board render
  - window resize
  - `ResizeObserver` changes

Special case:

- If the board has exactly one tile, it is placed at the exact center of the board.

## State Model

Core state is stored in the `state` object.

Important fields:

- `variant`: `pr` or `cu`
- `difficulty`: `easy`, `moderate`, or `advanced`
- `openingRule`: `winner` or `rotation`
- `target`: match target score
- `round`: current round number
- `scores`: `{ A, B }`
- `current`: current player index
- `firstRound`: whether the match is in its first round
- `nextOpener`: opener for the next round
- `board`: played tiles in board order
- `leftEnd`: current left board value
- `rightEnd`: current right board value
- `selectedTileId`: selected human tile id
- `lock`: prevents actions during AI delays
- `history`: log messages
- `boneyard`: Cuban locked-away tiles, or empty in PR
- `openingTileId`: required opening tile for first round
- `matchStarted`: whether the game can be resumed from menu
- `partnerReveal`: whether partner tiles are temporarily visible
- `partnerRevealTimer`: timeout for hiding partner tiles

## Player Model

Players are stored in the `players` array.

Indexes:

- `0`: You
- `1`: Opponent R
- `2`: Partner
- `3`: Opponent L

Player fields:

- `name`
- `team`
- `color`
- `glow`
- `human`
- `hand`
- `passes`
- `lastAction`

## Tile Model

Tile fields:

- `a`: first pip value
- `b`: second pip value
- `id`: normalized id like `2-6`
- `playedBy`: player index that placed the tile, used for color marker rendering

Tile helpers:

- `tileId(a, b)`
- `makeTile(a, b)`
- `buildSet(max)`
- `pips(tile)`
- `isDouble(tile)`

## Gameplay Flow

Main functions:

- `startMatch()`
- `setupRound()`
- `runTurn()`
- `humanPlay(side)`
- `humanPass()`
- `playMove(playerIndex, move)`
- `passPlayer(playerIndex)`
- `afterTurn(playerIndex)`
- `finishRound(result)`
- `continueAfterModal()`

Turn order is clockwise by player index:

`0 -> 1 -> 2 -> 3 -> 0`

Team mapping:

- Team A: players `0` and `2`
- Team B: players `1` and `3`

## Legal Moves

Functions:

- `possibleMoves(playerIndex)`
- `legalHumanMoves()`

Rules:

- If the board is empty, any tile can normally open.
- During the first round, the required opening tile is enforced.
- For normal play, a tile must match `leftEnd` or `rightEnd`.
- If there are no legal moves, the player passes.

## AI

AI move selection function:

- `chooseMove(playerIndex, forcedOpening = false)`

AI scoring function:

- `scoreMove(playerIndex, move, mode = "advanced")`

Opponent difficulty modes:

- `easy`: heuristic rule engine
- `moderate`: deeper defensive/mobility evaluation
- `advanced`: information-set style scoring using seen/unseen tile pressure

Partner AI:

- Always uses `advanced` scoring.

AI considerations:

- Prefer strong/high-pip plays when useful.
- Prefer doubles in some situations.
- Protect partner mobility.
- Use pass information to pressure opponents.
- Estimate unseen tile scarcity.
- Reduce opponent mobility.

## Rendering

Main render functions:

- `render()`
- `renderHand(playerIndex)`
- `renderBoard()`
- `layoutBoardTiles()`
- `renderControls()`
- `renderLog()`
- `renderTurnStatus(playerIndex)`

Rendering rules:

- Human tiles are visible.
- Opponent tiles are hidden.
- Partner tiles are hidden unless `partnerReveal` is true.
- Board tiles are visible and tagged with player color dots.

## Known Implementation Notes

- The game is intentionally self-contained in one HTML file.
- Some rule variations are house-rule choices, especially Cuban opener fallback and post-round opener behavior.
- The board layout is visual only; game logic still uses `state.board`, `leftEnd`, and `rightEnd`.
- The log remains available but is not required for ordinary play because visual markers show plays and passes.
- The current AI is a practical browser heuristic/search model, not a full provably optimal solver.

