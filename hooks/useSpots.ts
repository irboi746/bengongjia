"use client";

import { useState, useEffect, useCallback } from "react";

export type SpotColor = "white" | "black";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  white: number;
  black: number;
}

const TODAY = () => new Date().toISOString().slice(0, 10);

function loadRecords(): DayRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("spot-records");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: DayRecord[]) {
  localStorage.setItem("spot-records", JSON.stringify(records));
}

export function useSpots() {
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());
    setInitialized(true);
  }, []);

  const today = TODAY();

  const todayRecord: DayRecord = records.find((r) => r.date === today) ?? {
    date: today,
    white: 0,
    black: 0,
  };

  const updateToday = useCallback(
    (updated: DayRecord) => {
      setRecords((prev) => {
        const next = prev.filter((r) => r.date !== today);
        const merged = [...next, updated].sort((a, b) =>
          a.date.localeCompare(b.date)
        );
        saveRecords(merged);
        return merged;
      });
    },
    [today]
  );

  const addSpot = useCallback(
    (color: SpotColor) => {
      updateToday({
        ...todayRecord,
        [color]: todayRecord[color] + 1,
      });
    },
    [todayRecord, updateToday]
  );

  const removeSpot = useCallback(
    (color: SpotColor) => {
      if (todayRecord[color] === 0) return;
      updateToday({
        ...todayRecord,
        [color]: todayRecord[color] - 1,
      });
    },
    [todayRecord, updateToday]
  );

  // CSV Export
  const exportCSV = useCallback(() => {
    const header = "date,white,black\n";
    const rows = records
      .map((r) => `${r.date},${r.white},${r.black}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spots.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [records]);

  // CSV Import
  const importCSV = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.trim().split("\n").slice(1); // skip header
      const parsed: DayRecord[] = lines
        .map((line) => {
          const [date, white, black] = line.split(",");
          return {
            date: date?.trim(),
            white: parseInt(white) || 0,
            black: parseInt(black) || 0,
          };
        })
        .filter((r) => r.date);
      setRecords(parsed);
      saveRecords(parsed);
    };
    reader.readAsText(file);
  }, []);

  return {
    records,
    todayRecord,
    addSpot,
    removeSpot,
    exportCSV,
    importCSV,
    initialized,
  };
}