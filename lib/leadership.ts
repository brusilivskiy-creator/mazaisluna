import fs from "fs";
import path from "path";

export interface LeadershipPerson {
  id: number;
  politicianId: number | null;
  position: string;
}

const dataFilePath = path.join(process.cwd(), "data", "leadership.json");

export function getAllLeadership(): LeadershipPerson[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading leadership data:", error);
    return [];
  }
}

export function saveLeadership(leadership: LeadershipPerson[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(leadership, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving leadership data:", error);
    throw error;
  }
}

export function getLeadershipById(id: number): LeadershipPerson | undefined {
  const leadership = getAllLeadership();
  return leadership.find((person) => person.id === id);
}

export function addLeadership(person: Omit<LeadershipPerson, "id">): LeadershipPerson {
  const leadership = getAllLeadership();
  const newId = leadership.length > 0 ? Math.max(...leadership.map((p) => p.id)) + 1 : 1;
  const newPerson: LeadershipPerson = { ...person, id: newId };
  leadership.push(newPerson);
  saveLeadership(leadership);
  return newPerson;
}

export function updateLeadership(id: number, person: Omit<LeadershipPerson, "id">): LeadershipPerson | null {
  const leadership = getAllLeadership();
  const index = leadership.findIndex((p) => p.id === id);
  if (index === -1) return null;
  leadership[index] = { ...person, id };
  saveLeadership(leadership);
  return leadership[index];
}

export function deleteLeadership(id: number): boolean {
  const leadership = getAllLeadership();
  const filtered = leadership.filter((p) => p.id !== id);
  if (filtered.length === leadership.length) return false;
  saveLeadership(filtered);
  return true;
}

