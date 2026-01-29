import { IconType } from "react-icons";
import { addDays, parseISO, differenceInDays } from "date-fns";
import { addWorkingDays } from "@/lib/dateUtils";

export type TaskStatus = "Not Started" | "Planning & Research" | "Implementing" | "On Hold" | "Completed";

export const TASK_STATUSES: TaskStatus[] = ["Not Started", "Planning & Research", "Implementing", "On Hold", "Completed"];

export interface Deliverable {
  id: string;
  text: string;
  status: TaskStatus; // Each deliverable has its own status
  startDate: string; // ISO date format
  durationDays: number; // Duration in days
  excludeHolidays?: boolean;
  excludeSaturdays?: boolean;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  iconName: string; // The specific icon name
  icon: IconType;
  deliverables: Deliverable[];
}

// Utility function to compute card duration from deliverables
export const computeCardDuration = (deliverables: Deliverable[]): { startDate: string; endDate: string; durationDays: number } | null => {
  if (deliverables.length === 0) return null;

  let minStart: Date | null = null;
  let maxEnd: Date | null = null;

  for (const d of deliverables) {
    const start = parseISO(d.startDate);
    // Use working days calculation
    const end = addWorkingDays(start, d.durationDays, {
      excludeHolidays: d.excludeHolidays ?? true,
      excludeSaturdays: d.excludeSaturdays ?? false,
    });

    if (!minStart || start < minStart) minStart = start;
    if (!maxEnd || end > maxEnd) maxEnd = end;
  }

  if (!minStart || !maxEnd) return null;

  return {
    startDate: minStart.toISOString().split("T")[0],
    endDate: maxEnd.toISOString().split("T")[0],
    durationDays: differenceInDays(maxEnd, minStart),
  };
};

// Utility to find next available start date after all existing deliverables
export const getNextAvailableDate = (deliverables: Deliverable[]): string => {
  if (deliverables.length === 0) {
    return new Date().toISOString().split("T")[0];
  }

  let maxEnd: Date | null = null;
  for (const d of deliverables) {
    const start = parseISO(d.startDate);
    const end = addWorkingDays(start, d.durationDays, {
      excludeHolidays: d.excludeHolidays ?? true,
      excludeSaturdays: d.excludeSaturdays ?? false,
    });
    if (!maxEnd || end > maxEnd) maxEnd = end;
  }

  return maxEnd ? maxEnd.toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
};

// Check if a date range overlaps with existing deliverables
export const isDateRangeOccupied = (
  deliverables: Deliverable[],
  startDate: string,
  durationDays: number,
  excludeId?: string,
  options?: { excludeHolidays?: boolean; excludeSaturdays?: boolean },
): boolean => {
  const newStart = parseISO(startDate);
  const newEnd = addWorkingDays(newStart, durationDays, {
    excludeHolidays: options?.excludeHolidays ?? true,
    excludeSaturdays: options?.excludeSaturdays ?? false,
  });

  for (const d of deliverables) {
    if (excludeId && d.id === excludeId) continue;

    const existingStart = parseISO(d.startDate);
    const existingEnd = addWorkingDays(existingStart, d.durationDays, {
      excludeHolidays: d.excludeHolidays ?? true,
      excludeSaturdays: d.excludeSaturdays ?? false,
    });

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }

  return false;
};

// Calculate status counts for progress display
export const getStatusCounts = (deliverables: Deliverable[]): Record<TaskStatus, number> => {
  const counts: Record<TaskStatus, number> = {
    "Not Started": 0,
    "Planning & Research": 0,
    Implementing: 0,
    "On Hold": 0,
    Completed: 0,
  };

  for (const d of deliverables) {
    counts[d.status]++;
  }

  return counts;
};

// Export types and utilities only
// ROADMAP_DATA has been moved to api/seed/roadmap/seedData.ts
