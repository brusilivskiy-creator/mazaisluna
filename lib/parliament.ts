import fs from "fs";
import path from "path";

export interface ParliamentConfig {
  diagram: string | null;
}

const DATA_FILE = path.join(process.cwd(), "data", "parliament.json");

export function getParliamentConfig(): ParliamentConfig {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return { diagram: null };
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading parliament config:", error);
    return { diagram: null };
  }
}

export function saveParliamentConfig(config: ParliamentConfig): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving parliament config:", error);
    throw error;
  }
}

