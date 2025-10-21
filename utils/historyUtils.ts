import { HistoryEntry } from '../types';

const HISTORY_KEY = 'lessonPlanHistory_v1';
const MAX_HISTORY_ITEMS = 20;

export function loadHistory(): HistoryEntry[] {
  try {
    const storedHistory = localStorage.getItem(HISTORY_KEY);
    if (storedHistory) {
      // Basic validation
      const parsed = JSON.parse(storedHistory);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Failed to load or parse history from localStorage:", error);
    localStorage.removeItem(HISTORY_KEY); // Clear corrupted data
  }
  return [];
}

export function saveHistory(history: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Failed to save history to localStorage:", error);
  }
}

export function addToHistory(entry: HistoryEntry, currentHistory: HistoryEntry[]): HistoryEntry[] {
  // Filter out any previous entry with the exact same content to avoid duplicates
  const filteredHistory = currentHistory.filter(item => item.lessonPlan.trim() !== entry.lessonPlan.trim());
  
  const newHistory = [entry, ...filteredHistory];
  
  if (newHistory.length > MAX_HISTORY_ITEMS) {
    return newHistory.slice(0, MAX_HISTORY_ITEMS);
  }
  return newHistory;
}
