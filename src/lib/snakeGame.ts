export interface SnakePoint {
  x: number;
  y: number;
}

export type SnakeDirection = 'up' | 'down' | 'left' | 'right';
export type SnakeStatus = 'ready' | 'playing' | 'over' | 'won';

export interface SnakeState {
  cols: number;
  rows: number;
  /** Head first. */
  snake: SnakePoint[];
  direction: SnakeDirection;
  /** Turns waiting for a tick, so two quick presses both count. */
  turns: SnakeDirection[];
  food: SnakePoint;
  score: number;
  status: SnakeStatus;
}

const MAX_QUEUED_TURNS = 2;
const START_LENGTH = 3;

const VECTORS: Record<SnakeDirection, SnakePoint> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITES: Record<SnakeDirection, SnakeDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function samePoint(a: SnakePoint, b: SnakePoint) {
  return a.x === b.x && a.y === b.y;
}

/** Returns null when the board has no free cell left. */
function placeFood(
  cols: number,
  rows: number,
  snake: SnakePoint[],
  random: () => number
): SnakePoint | null {
  const free: SnakePoint[] = [];
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y });
    }
  }
  return free.length > 0 ? free[Math.floor(random() * free.length)] : null;
}

export function createSnakeGame(
  cols: number,
  rows: number,
  random: () => number = Math.random
): SnakeState {
  const headX = Math.floor(cols / 2);
  const y = Math.floor(rows / 2);
  const snake = Array.from({ length: START_LENGTH }, (_, index) => ({ x: headX - index, y }));

  return {
    cols,
    rows,
    snake,
    direction: 'right',
    turns: [],
    food: placeFood(cols, rows, snake, random) ?? { x: 0, y: 0 },
    score: 0,
    status: 'ready',
  };
}

export function queueTurn(state: SnakeState, direction: SnakeDirection): SnakeState {
  if (state.status === 'over' || state.status === 'won') return state;

  const last = state.turns[state.turns.length - 1] ?? state.direction;
  const ignored =
    direction === last ||
    direction === OPPOSITES[last] ||
    state.turns.length >= MAX_QUEUED_TURNS;

  return {
    ...state,
    status: 'playing',
    turns: ignored ? state.turns : [...state.turns, direction],
  };
}

export function stepSnake(state: SnakeState, random: () => number = Math.random): SnakeState {
  if (state.status !== 'playing') return state;

  const [nextTurn, ...turns] = state.turns;
  const direction = nextTurn ?? state.direction;
  const vector = VECTORS[direction];
  const head = { x: state.snake[0].x + vector.x, y: state.snake[0].y + vector.y };
  const ate = samePoint(head, state.food);

  // The tail moves away this tick unless the snake just ate.
  const body = ate ? state.snake : state.snake.slice(0, -1);
  const hitWall = head.x < 0 || head.y < 0 || head.x >= state.cols || head.y >= state.rows;
  const hitSelf = body.some((part) => samePoint(part, head));

  if (hitWall || hitSelf) return { ...state, direction, turns, status: 'over' };

  const snake = [head, ...body];
  if (!ate) return { ...state, snake, direction, turns };

  const food = placeFood(state.cols, state.rows, snake, random);
  return {
    ...state,
    snake,
    direction,
    turns,
    score: state.score + 1,
    food: food ?? state.food,
    status: food ? 'playing' : 'won',
  };
}
