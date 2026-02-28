"use client";

import { useMemo } from "react";
import { DayRecord } from "../hooks/useSpots";
import { ENCOURAGEMENTS } from "../utils/constants";

interface EncouragementProps {
  record: DayRecord;
}

function getTier(pct: number): keyof typeof ENCOURAGEMENTS {
  if (pct >= 80) return "excellent";
  if (pct >= 60) return "good";
  if (pct >= 40) return "progress";
  return "beginning";
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const TIER_LABELS: Record<keyof typeof ENCOURAGEMENTS, string> = {
  excellent: "卓越",
  good: "良好",
  progress: "进步中",
  beginning: "起步",
};

const TIER_COLORS: Record<keyof typeof ENCOURAGEMENTS, string> = {
  excellent: "#c4793a",
  good: "#7a9e6e",
  progress: "#6e8fae",
  beginning: "#9e7a6e",
};

export default function Encouragement({ record }: EncouragementProps) {
  const total = record.white + record.black;
  const pct = total === 0 ? 0 : Math.round((record.white / total) * 100);
  const tier = getTier(pct);

  const message = useMemo(
    () => getRandomItem(ENCOURAGEMENTS[tier]),
    // Re-roll only when the tier changes
    [tier]
  );

  const tierColor = TIER_COLORS[tier];

  return (
    <div className="encouragement">
      <div className="encouragement-bar-wrap">
        <div className="encouragement-bar-track">
          <div
            className="encouragement-bar-fill"
            style={{ width: `${pct}%`, background: tierColor }}
          />
        </div>
        <div className="encouragement-pct" style={{ color: tierColor }}>
          {pct}%
          <span className="encouragement-tier-label">{TIER_LABELS[tier]}</span>
        </div>
      </div>

      {total === 0 ? (
        <p className="encouragement-text encouragement-empty">
          今天还没有记录。开始添加你的圈吧。
        </p>
      ) : (
        <p className="encouragement-text">{message}</p>
      )}
    </div>
  );
}