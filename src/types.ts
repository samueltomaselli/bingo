type Cell = {
  number: number | "FREE";
  marked: boolean;
};

type GameState = {
  id: string;
  board: Cell[][];
  drawnNumber: number | "?";
};
