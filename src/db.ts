import Dexie, { Table } from "dexie";

export const db = new Dexie("BingoDB");
db.version(1).stores({
  gameState: "++id",
});

export const gameState: Table<GameState, number> = db.table("gameState");

export async function saveState(state: GameState): Promise<void> {
  try {
    const stateToSave = JSON.parse(JSON.stringify(state));
    await gameState.put(stateToSave);
  } catch (error) {
    console.error("Erro ao salvar o estado:", error);
  }
}

export async function getState(): Promise<GameState | undefined> {
  try {
    return await gameState.toCollection().last();
  } catch (error) {
    console.error("Erro ao receber o estado:", error);
    return undefined;
  }
}
