"use client";

import { DayRecord, SpotColor } from "../hooks/useSpots";

const SPOTS_PER_ROW = 5;

interface SpotWallProps {
  record: DayRecord;
  onRemove: (color: SpotColor) => void;
}

function SpotGrid({
  count,
  color,
  onRemove,
}: {
  count: number;
  color: SpotColor;
  onRemove: () => void;
}) {
  const spots = Array.from({ length: count });

  return (
    <div className="spot-column">
      <div className="spot-counter">
        <span className="spot-counter-number">{count}</span>
        <span className="spot-counter-label">{color === "white" ? "白圈" : "黑圈"}</span>
      </div>
      <div className="spot-grid">
        {spots.map((_, i) => (
          <button
            key={i}
            className={`spot spot-${color}`}
            onClick={onRemove}
            title={`Remove ${color} spot`}
            aria-label={`Remove ${color} spot`}
          />
        ))}
        {/* Empty placeholders to keep grid shape */}
        {count % SPOTS_PER_ROW !== 0 &&
          Array.from({ length: SPOTS_PER_ROW - (count % SPOTS_PER_ROW) }).map(
            (_, i) => <div key={`empty-${i}`} className="spot spot-empty" />
          )}
      </div>
    </div>
  );
}

export default function SpotWall({ record, onRemove }: SpotWallProps) {
  return (
    <div className="spot-wall">
      <SpotGrid
        count={record.white}
        color="white"
        onRemove={() => onRemove("white")}
      />
      <div className="spot-wall-divider" />
      <SpotGrid
        count={record.black}
        color="black"
        onRemove={() => onRemove("black")}
      />
    </div>
  );
}