"use client"

import { useSpots } from "@/hooks/useSpots";
import HomeToolbar from "@/components/HomeToolbar";
import ClockHeader from "@/components/Clockheader";
import SpotWall from "@/components/Spotwall";
import FloatingMenu from "@/components/FloatingMenu";
import Encouragement from "@/components/Encouragement";
import StatsChart from "@/components/Statschart";
import WeekStats from "@/components/Weekstats";
import MonthStats from "@/components/Monthstats";
import YearStats from "@/components/Yearstats";
import { useState } from "react";

type StatTab = "week" | "month" | "year";

function StatsSection({ records }: { records: import("../hooks/useSpots").DayRecord[] }) {
  const [tab, setTab] = useState<StatTab>("week");
  return (
    <div className="stats-wrap">
      <div className="stats-tabs">
        {(["week", "month", "year"] as StatTab[]).map((t) => (
          <button
            key={t}
            className={`stats-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t === "week" ? "本周" : t === "month" ? "月度" : "年度"}
          </button>
        ))}
      </div>
      {tab === "week" && <WeekStats records={records} />}
      {tab === "month" && <MonthStats records={records} />}
      {tab === "year" && <YearStats records={records} />}
    </div>
  );
}

export default function Home() {
  const { records, todayRecord, addSpot, removeSpot, exportCSV, importCSV, initialized } =
  useSpots();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Shippori+Mincho:wght@400;500;700&display=swap');

        /* ── Base ── */
        .home-root {
          font-family: 'Noto Serif SC', 'Shippori Mincho', serif;
          background: #f4efe6;
          min-height: 100vh;
          color: #1c1410;
          padding-bottom: 6rem;
        }


        /* ── Toolbar ── */
        .home-toolbar {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          align-items: center;
          gap: 0.5rem;
          max-width: 480px;
          margin: 0 auto;
          padding: 0.75rem 1.25rem 0;
        }
        .header-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-family: inherit;
          font-size: 0.75rem;
          color: #8b7355;
          background: transparent;
          border: 1px solid #ddd4c0;
          border-radius: 4px;
          padding: 0.3rem 0.65rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }
        .header-btn:hover {
          background: #ede7db;
          color: #1c1410;
        }

        /* ── Clock ── */
        .clock-header {
          text-align: center;
          padding: 2rem 1.25rem 1.5rem;
        }
        .clock-time {
          font-size: clamp(3rem, 12vw, 5rem);
          font-weight: 300;
          letter-spacing: 0.04em;
          line-height: 1;
          color: #1c1410;
          font-variant-numeric: tabular-nums;
        }
        .clock-colon {
          opacity: 0.4;
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0.1; }
        }
        .clock-date {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: #8b7355;
          letter-spacing: 0.08em;
        }
        .clock-lunar {
          margin-top: 0.25rem;
          font-size: 0.8rem;
          color: #b09070;
          letter-spacing: 0.1em;
        }
        .clock-header-skeleton {
          height: 160px;
        }

        /* ── Spot Wall ── */
        .spot-wall {
          display: flex;
          gap: 0;
          max-width: 480px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }
        .spot-column {
          flex: 1;
          min-width: 0;
        }
        .spot-wall-divider {
          width: 1px;
          background: #ddd4c0;
          margin: 0 1.25rem;
          align-self: stretch;
        }
        .spot-counter {
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }
        .spot-counter-number {
          font-size: 2rem;
          font-weight: 300;
          line-height: 1;
          color: #1c1410;
        }
        .spot-counter-label {
          font-size: 0.75rem;
          color: #8b7355;
          letter-spacing: 0.06em;
        }
        .spot-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .spot {
          width: calc(20% - 6px);
          aspect-ratio: 1;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.12s, opacity 0.12s;
          border: none;
          outline: none;
          flex-shrink: 0;
        }
        .spot:hover {
          transform: scale(0.88);
          opacity: 0.8;
        }
        .spot-white {
          background: #f4efe6;
          border: 1.5px solid #1c1410;
        }
        .spot-black {
          background: #1c1410;
        }
        .spot-empty {
          background: transparent;
          pointer-events: none;
        }

        /* ── Floating Menu ── */
        .floating-menu {
          position: fixed;
          bottom: 4.5rem;
          right: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          z-index: 9999;
        }
        .floating-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 12px rgba(0,0,0,0.18);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .floating-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 4px 18px rgba(0,0,0,0.22);
        }
        .floating-btn:active {
          transform: scale(0.95);
        }
        .floating-btn-white {
          background: #f4efe6;
          border: 1.5px solid #1c1410;
        }
        .floating-btn-black {
          background: #1c1410;
        }
        .floating-spot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: block;
        }
 

        /* ── Encouragement ── */
        .encouragement {
          max-width: 480px;
          margin: 2rem auto 0;
          padding: 0 1.25rem;
        }
        .encouragement-bar-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.9rem;
        }
        .encouragement-bar-track {
          flex: 1;
          height: 4px;
          background: #ddd4c0;
          border-radius: 2px;
          overflow: hidden;
        }
        .encouragement-bar-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease;
        }
        .encouragement-pct {
          font-size: 1.1rem;
          font-weight: 500;
          display: flex;
          align-items: baseline;
          gap: 0.3rem;
          min-width: 4rem;
          text-align: right;
        }
        .encouragement-tier-label {
          font-size: 0.7rem;
          color: #8b7355;
          letter-spacing: 0.06em;
        }
        .encouragement-text {
          font-size: 0.9rem;
          line-height: 1.8;
          color: #4a3f30;
          border-left: 2px solid #ddd4c0;
          padding-left: 0.85rem;
          letter-spacing: 0.04em;
        }
        .encouragement-empty {
          color: #b09070;
          border-left-color: transparent;
          padding-left: 0;
        }

        /* ── Stats ── */
        .stats-wrap {
          max-width: 480px;
          margin: 2rem auto 0;
          padding: 0 1.25rem;
        }
        .stats-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #ddd4c0;
          margin-bottom: 1.25rem;
        }
        .stats-tab {
          font-family: inherit;
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          color: #a08060;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          margin-bottom: -1px;
        }
        .stats-tab:hover { color: #1c1410; }
        .stats-tab.active {
          color: #1c1410;
          border-bottom-color: #c4793a;
          font-weight: 500;
        }
        .stats-section {
          /* no extra padding needed, wrap handles it */
        }
        .stats-section-title {
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          color: #8b7355;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .stats-subsection-title {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          color: #a08060;
          margin: 1.25rem 0 0.75rem;
        }
        .stats-selector-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .stats-selector {
          font-family: inherit;
          font-size: 0.8rem;
          color: #1c1410;
          background: #f4efe6;
          border: 1px solid #ddd4c0;
          border-radius: 4px;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
        }
        .stats-selector-total {
          font-size: 0.75rem;
          color: #8b7355;
          letter-spacing: 0.04em;
        }
        .stats-empty {
          color: #b09070;
          font-size: 0.85rem;
          text-align: center;
          padding: 2rem 0;
        }
        .stats-empty-month {
          color: #b09070;
          font-size: 0.8rem;
          text-align: center;
          padding: 1rem 0;
        }

        /* ── Section divider ── */
        .home-divider {
          max-width: 480px;
          margin: 1.75rem auto;
          border: none;
          border-top: 1px solid #ddd4c0;
        }
      `}</style>

      <div className="home-root">

        <HomeToolbar onExport={exportCSV} onImport={importCSV} />
        <ClockHeader />

        <hr className="home-divider" />

        {initialized && (
          <>
            <SpotWall record={todayRecord} onRemove={removeSpot} />

            <hr className="home-divider" />

            <Encouragement record={todayRecord} />

            <hr className="home-divider" />

            <StatsSection records={records} />
          </>
        )}

        <FloatingMenu onAdd={addSpot} />
      </div>
    </>
  );
}
