"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { DayRecord } from "../hooks/useSpots";

interface YearStatsProps {
  records: DayRecord[];
}

const COLORS = { white: "#e8e0d0", black: "#2a2018" };
const CHART_STYLES = {
  tooltip: {
    background: "#f5f0e8",
    border: "1px solid #d8cfc0",
    borderRadius: "6px",
    fontSize: "0.85rem",
    fontFamily: "inherit",
  },
  tick: { fontSize: 11, fill: "#8b7355", fontFamily: "inherit" },
};

function aggregateByYear(records: DayRecord[]) {
  const map: Record<string, { white: number; black: number }> = {};
  for (const r of records) {
    const key = r.date.slice(0, 4); // "YYYY"
    if (!map[key]) map[key] = { white: 0, black: 0 };
    map[key].white += r.white;
    map[key].black += r.black;
  }
  return map;
}

export default function YearStats({ records }: YearStatsProps) {
  const yearMap = useMemo(() => aggregateByYear(records), [records]);
  const allYears = Object.keys(yearMap).sort();

  const currentYear = String(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Pie data for selected year
  const yearData = yearMap[selectedYear] ?? { white: 0, black: 0 };
  const pieData = [
    { name: "白圈", value: yearData.white },
    { name: "黑圈", value: yearData.black },
  ];
  const total = yearData.white + yearData.black;

  // Line chart: black spots per year for last 10 years
  const last10 = allYears.slice(-10).map((key) => ({
    year: key,
    黑圈: yearMap[key].black,
    白圈: yearMap[key].white,
  }));

  if (allYears.length === 0) {
    return <div className="stats-empty"><p>暂无数据</p></div>;
  }

  return (
    <div className="stats-section">
      <h3 className="stats-section-title">年度统计 · Yearly</h3>

      {/* Year selector */}
      <div className="stats-selector-row">
        <select
          className="stats-selector"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {allYears.map((y) => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>
        <span className="stats-selector-total">共 {total} 圈</span>
      </div>

      {/* Pie chart */}
      {total > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? COLORS.white : COLORS.black}
                  stroke={i === 0 ? "#c4793a" : "#1c1410"}
                  strokeWidth={i === 0 ? 1 : 0}
                />
              ))}
            </Pie>
            <Tooltip contentStyle={CHART_STYLES.tooltip} />
            <Legend wrapperStyle={{ fontSize: "0.8rem", fontFamily: "inherit" }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="stats-empty-month"><p>本年暂无数据</p></div>
      )}

      {/* Line chart: last 10 years trend */}
      {last10.length > 1 && (
        <>
          <h4 className="stats-subsection-title">近10年趋势 · 10-Year Trend</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={last10}>
              <CartesianGrid vertical={false} stroke="#e8e0d5" />
              <XAxis dataKey="year" tick={CHART_STYLES.tick} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={CHART_STYLES.tick} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={CHART_STYLES.tooltip} />
              <Legend wrapperStyle={{ fontSize: "0.8rem", fontFamily: "inherit" }} />
              <Line
                type="monotone"
                dataKey="黑圈"
                stroke="#2a2018"
                strokeWidth={2}
                dot={{ fill: "#2a2018", r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="白圈"
                stroke="#c4793a"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={{ fill: "#c4793a", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}