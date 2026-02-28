"use client";

import { SpotColor } from "../hooks/useSpots";

interface FloatingMenuProps {
  onAdd: (color: SpotColor) => void;
}

export default function FloatingMenu({ onAdd }: FloatingMenuProps) {
  return (
    <div className="floating-menu">
      <button
        className="floating-btn floating-btn-black"
        onClick={() => onAdd("black")}
        aria-label="Add black spot"
        title="Add black spot"
      >
        <span className="floating-spot floating-spot-black" />
      </button>
      <button
        className="floating-btn floating-btn-white"
        onClick={() => onAdd("white")}
        aria-label="Add white spot"
        title="Add white spot"
      >
        <span className="floating-spot floating-spot-white" />
      </button>
    </div>
  );
}