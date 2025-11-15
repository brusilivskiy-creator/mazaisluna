import fs from "fs";
import path from "path";

export interface Politician {
  id: number;
  name: string;
  image: string | null;
  party: string | null;
  partyLogo: string | null;
}

const dataFilePath = path.join(process.cwd(), "data", "politicians.json");

export function getAllPoliticians(): Politician[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading politicians data:", error);
    return [];
  }
}

export function savePoliticians(politicians: Politician[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(politicians, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving politicians data:", error);
    throw error;
  }
}

export function getPoliticianById(id: number): Politician | undefined {
  const politicians = getAllPoliticians();
  return politicians.find((p) => p.id === id);
}

export function addPolitician(politician: Omit<Politician, "id">): Politician {
  const politicians = getAllPoliticians();
  const newId = politicians.length > 0 ? Math.max(...politicians.map((p) => p.id)) + 1 : 1;
  const newPolitician: Politician = { ...politician, id: newId };
  politicians.push(newPolitician);
  savePoliticians(politicians);
  return newPolitician;
}

export function updatePolitician(id: number, politician: Omit<Politician, "id">): Politician | null {
  const politicians = getAllPoliticians();
  const index = politicians.findIndex((p) => p.id === id);
  if (index === -1) return null;
  politicians[index] = { ...politician, id };
  savePoliticians(politicians);
  return politicians[index];
}

export function deletePolitician(id: number): boolean {
  const politicians = getAllPoliticians();
  const filtered = politicians.filter((p) => p.id !== id);
  if (filtered.length === politicians.length) return false;
  savePoliticians(filtered);
  return true;
}

