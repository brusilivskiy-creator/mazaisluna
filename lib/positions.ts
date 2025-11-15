import fs from "fs";
import path from "path";

export interface Position {
  id: number;
  name: string;
  category?: string | null;
  order: number;
}

const dataFilePath = path.join(process.cwd(), "data", "positions.json");

export function getAllPositions(): Position[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    const positions = JSON.parse(fileContents);
    // Сортуємо за порядком
    return positions.sort((a: Position, b: Position) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    console.error("Error reading positions data:", error);
    return [];
  }
}

export function savePositions(positions: Position[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(positions, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving positions data:", error);
    throw error;
  }
}

export function getPositionById(id: number): Position | undefined {
  const positions = getAllPositions();
  return positions.find((p) => p.id === id);
}

export function addPosition(position: Omit<Position, "id" | "order"> & { order?: number }): Position {
  const positions = getAllPositions();
  const newId = positions.length > 0 ? Math.max(...positions.map((p) => p.id)) + 1 : 1;
  // Якщо порядок не вказано, додаємо в кінець
  const maxOrder = positions.length > 0 ? Math.max(...positions.map((p) => p.order || 0)) : 0;
  const newPosition: Position = { 
    ...position, 
    id: newId,
    order: position.order !== undefined ? position.order : maxOrder + 1
  };
  positions.push(newPosition);
  savePositions(positions);
  return newPosition;
}

export function updatePosition(id: number, position: Omit<Position, "id">): Position | null {
  const positions = getAllPositions();
  const index = positions.findIndex((p) => p.id === id);
  if (index === -1) return null;
  positions[index] = { ...position, id };
  savePositions(positions);
  return positions[index];
}

export function deletePosition(id: number): boolean {
  const positions = getAllPositions();
  const filtered = positions.filter((p) => p.id !== id);
  if (filtered.length === positions.length) return false;
  savePositions(filtered);
  return true;
}

export function movePosition(id: number, direction: "up" | "down"): boolean {
  const positions = getAllPositions();
  const index = positions.findIndex((p) => p.id === id);
  if (index === -1) return false;

  if (direction === "up" && index === 0) return false;
  if (direction === "down" && index === positions.length - 1) return false;

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const currentOrder = positions[index].order || index;
  const targetOrder = positions[targetIndex].order || targetIndex;

  // Обмінюємо порядок
  positions[index].order = targetOrder;
  positions[targetIndex].order = currentOrder;

  savePositions(positions);
  return true;
}

