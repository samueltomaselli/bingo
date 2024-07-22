<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { saveState, getState } from "../db";

const board = ref<Array<Array<{ number: number | 'FREE'; marked: boolean }>>>([]);
const bingoPositions = ref<number[][]>([
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
]);
const drawnNumber = ref<number | '?'>('?');
const showBingoWin = ref<boolean>(false);
const dialog = ref<boolean>(false);

const initializeBoard = () => {
  const getColumnNumbers = (start: number, end: number) => {
    const arr = Array.from({ length: end - start + 1 }, (_, i) => i + start);
    let currentIndex = arr.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    return arr.slice(0, 5);
  };

  const columns = [
    getColumnNumbers(1, 15),
    getColumnNumbers(16, 30),
    getColumnNumbers(31, 45),
    getColumnNumbers(46, 60),
    getColumnNumbers(61, 75),
  ];

  board.value = Array.from({ length: 5 }, (_, rowIndex) =>
    columns.map((col, colIndex) => {
      if (rowIndex === 2 && colIndex === 2) {
        return { number: "FREE", marked: true };
      } else {
        return { number: col[rowIndex], marked: false };
      }
    })
  );
  saveGameState();
};

const drawNumber = () => {
  setTimeout(() => {
    drawnNumber.value = Math.floor(Math.random() * 75) + 1;
    setTimeout(() => {
      drawnNumber.value = Math.floor(Math.random() * 75) + 1;
      setTimeout(() => {
        drawnNumber.value = Math.floor(Math.random() * 75) + 1;
        setTimeout(() => {
          drawnNumber.value = Math.floor(Math.random() * 75) + 1;
          setTimeout(() => {
            drawnNumber.value = Math.floor(Math.random() * 75) + 1;
            saveGameState();
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }, 150);
};

const markCell = (rowIndex: number, cellIndex: number) => {
  const cell = board.value[rowIndex][cellIndex];
  if (cell.number === drawnNumber.value) {
    cell.marked = !cell.marked;
    console.log("Marked cell:", rowIndex, cellIndex, cell);
    checkIfBingo();
    saveGameState();
  }
};

const checkIfBingo = () => {
  const flattenedBoard = board.value.flat();
  const markedIndices = flattenedBoard
    .map((cell, index) => (cell.marked ? index : -1))
    .filter(index => index !== -1);

  const isWinning = bingoPositions.value.some(combination =>
    combination.every(index => markedIndices.includes(index))
  );

  if (isWinning) {
    showBingoWin.value = true;
    dialog.value = true;
    resetGame();
  }
};

const resetGame = () => {
  board.value.forEach(row => {
    row.forEach(cell => {
      cell.marked = false;
    });
  });
  drawnNumber.value = '?';
  initializeBoard();
};

const saveGameState = () => {
  saveState({ id: "bingoDB", board: board.value, drawnNumber: drawnNumber.value as number });
};

const loadGameState = async () => {
  const state = await getState();
  if (state) {
    board.value = state.board;
    drawnNumber.value = state.drawnNumber;
  } else {
    initializeBoard();
  }
};

onMounted(loadGameState);
</script>

<template>
  <v-container class="h-screen d-flex">
    <v-row class="d-flex justify-center align-center">
      <v-col cols="12" md="3" class="d-flex flex-column justify-center align-center mb-3">
        <h1 class="text-h1 font-weight-bold">{{ drawnNumber }}</h1>
        <v-btn @click="drawNumber" class="mb-3 mt-3" prepend-icon="mdi-crystal-ball">Sortear número</v-btn>
      </v-col>

      <v-col cols="12" md="5" class="d-flex flex-column justify-center align-center">
        <v-container class="d-flex justify-center align-center mb-2">
          <v-row class="justify-center align-center">
            <v-col cols="2" class="d-flex justify-center align-center">
              <img src="@/assets/bingo.png" alt="Bingo" height="50" width="50" />
            </v-col>
            <v-col v-for="letter in ['I', 'N', 'G', 'O']" :key="letter" cols="2"
              class="d-flex justify-center align-center">
              <h3 class="text-h3 font-weight-bold">{{ letter }}</h3>
            </v-col>
          </v-row>
        </v-container>

        <v-row>
          <v-col v-for="(row, rowIndex) in board" :key="rowIndex" cols="12">
            <v-row class="justify-center">
              <v-col v-for="(cell, cellIndex) in row" :key="cellIndex" class="btn pa-2 d-flex justify-center" cols="2"
                xs="2">
                <v-btn :class="{ 'bg-black text-white': cell.marked }" variant="tonal" class=" " depressed
                  @click="markCell(rowIndex, cellIndex)" block height="70" width="50">
                  {{ cell.number }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-btn @click="resetGame" prepend-icon="mdi-replay" class="mt-10">Reiniciar jogo</v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" width="auto">
      <v-card max-width="400" prepend-icon="mdi-trophy" text="Parabéns, você venceu a partida." title="BINGO!"
        class="py-2 px-2">
        <template v-slot:actions>
          <v-btn class="ms-auto" text="Jogar novamente" @click="dialog = false"></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style>
@media (max-width: 400px) {
  .btn {
    padding: 4px !important;
  }
}
</style>
