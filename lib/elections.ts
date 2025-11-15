import fs from "fs";
import path from "path";

export interface ParliamentElection {
  id: number;
  date: string; // ISO date string
  parties: {
    partyId: number;
    partyName: string;
    percentage: number;
  }[];
  majoritarianDistricts: {
    districtNumber: number;
    candidateId: number | null;
    candidateName: string | null;
    partyId: number | null;
    partyName: string | null;
  }[];
}

export interface LeaderElection {
  id: number;
  date: string; // ISO date string
  candidates: {
    candidateId: number | null;
    candidateName: string;
    percentage: number;
  }[];
}

export interface ElectionsData {
  parliament: ParliamentElection | null;
  leader: LeaderElection | null;
}

const dataFilePath = path.join(process.cwd(), "data", "elections.json");

export function getElections(): ElectionsData {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading elections data:", error);
    return { parliament: null, leader: null };
  }
}

export function saveElections(elections: ElectionsData): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(elections, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving elections data:", error);
    throw error;
  }
}

export function updateParliamentElection(election: ParliamentElection): void {
  const elections = getElections();
  elections.parliament = election;
  saveElections(elections);
}

export function updateLeaderElection(election: LeaderElection): void {
  const elections = getElections();
  elections.leader = election;
  saveElections(elections);
}

