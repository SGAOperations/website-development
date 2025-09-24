import { Data } from "@measured/puck";
import fs from "fs";

// Replace with call to your database
export const getPage = (path: string) => {
  const allData: Record<string, Data> | null = fs.existsSync("database.json")
    ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
    : null;

  return allData ? allData[path] : null;
};

// Return the full pages mapping from the local JSON database.
export const getAllPages = (): Record<string, Data> | null => {
  return fs.existsSync("database.json")
    ? JSON.parse(fs.readFileSync("database.json", "utf-8"))
    : null;
};
