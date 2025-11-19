import fs from "fs";
import path from "path";

export interface Category {
  id: number;
  name: string;
  type: "news_category" | "news_navigation" | "general";
  order: number;
  description?: string | null;
}

const dataFilePath = path.join(process.cwd(), "data", "categories.json");

export function getAllCategories(): Category[] {
  try {
    const fileContents = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading categories data:", error);
    return [];
  }
}

export function getCategoriesByType(type: Category["type"]): Category[] {
  const categories = getAllCategories();
  return categories
    .filter((cat) => cat.type === type)
    .sort((a, b) => a.order - b.order);
}

export function saveCategories(categories: Category[]): void {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(categories, null, 2), "utf8");
  } catch (error) {
    console.error("Error saving categories data:", error);
    throw error;
  }
}

export function getCategoryById(id: number): Category | undefined {
  const categories = getAllCategories();
  return categories.find((cat) => cat.id === id);
}

export function addCategory(category: Omit<Category, "id">): Category {
  const categories = getAllCategories();
  const newId = categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1;
  const newCategory: Category = { ...category, id: newId };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
}

export function updateCategory(id: number, category: Omit<Category, "id">): Category | null {
  const categories = getAllCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...category, id };
  saveCategories(categories);
  return categories[index];
}

export function deleteCategory(id: number): boolean {
  const categories = getAllCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  saveCategories(filtered);
  return true;
}






