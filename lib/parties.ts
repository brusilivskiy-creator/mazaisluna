import fs from "fs";
import path from "path";

export interface Party {
  id: number;
  name: string;
  logo: string;
  seats: number;
  note?: string | null;
}

const dataFilePath = path.join(process.cwd(), "data", "parties.json");

export function getAllParties(): Party[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading parties data:", error);
    return [];
  }
}

export function saveParties(parties: Party[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(parties, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving parties data:", error);
    throw error;
  }
}

export function getPartyById(id: number): Party | undefined {
  const parties = getAllParties();
  return parties.find((party) => party.id === id);
}

export function addParty(party: Omit<Party, "id">): Party {
  const parties = getAllParties();
  const newId = parties.length > 0 ? Math.max(...parties.map((p) => p.id)) + 1 : 1;
  const newParty: Party = { ...party, id: newId };
  parties.push(newParty);
  saveParties(parties);
  return newParty;
}

export function updateParty(id: number, party: Omit<Party, "id">): Party | null {
  const parties = getAllParties();
  const index = parties.findIndex((p) => p.id === id);
  if (index === -1) return null;
  parties[index] = { ...party, id };
  saveParties(parties);
  return parties[index];
}

export function deleteParty(id: number): boolean {
  const parties = getAllParties();
  const filtered = parties.filter((p) => p.id !== id);
  if (filtered.length === parties.length) return false;
  saveParties(filtered);
  return true;
}

