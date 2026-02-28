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

interface MonthStatsProps {
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

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function getMonthKey(dateStr: string) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function aggregateByMonth(records: DayRecord[]) {
  const map: Record<string, { white: number; black: number }> = {};
  for (const r of records) {
    const key = getMonthKey(r.date);
    if (!map[key]) map[key] = { white: 0, black: 0 };
    map[key].white += r.white;
    map[key].black += r.black;
  }
  return map;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${MONTH_NAMES[parseInt(month) - 1]} ${year}`;
}

export default function MonthStats({ records }: MonthStatsProps) {
  const monthMap = useMemo(() => aggregateByMonth(records), [records]);
  const allMonths = Object.keys(monthMap).sort();

  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Pie data for selected month
  const monthData = monthMap[selectedMonth] ?? { white: 0, black: 0 };
  const pieData = [
    { name: "白圈", value: monthData.white },
    { name: "黑圈", value: monthData.black },
  ];
  const total = monthData.white + monthData.black;

  // Line chart: black spots per month for last 12 months
  const last12 = allMonths.slice(-12).map((key) => ({
    month: `${parseInt(key.split("-")[1])}月`,
    黑圈: monthMap[key].black,
    白圈: monthMap[key].white,
  }));

  if (allMonths.length === 0) {
    return <div className="stats-empty"><p>暂无数据</p></div>;
  }

  return (
    <div className="stats-section">
      <h3 className="stats-section-title">月度统计 · Monthly</h3>

      {/* Month selector */}
      <div className="stats-selector-row">
        <select
          className="stats-selector"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {allMonths.map((m) => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
        <span className="stats-selector-total">
          共 {total} 圈
        </span>
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
        <div className="stats-empty-month"><p>本月暂无数据</p></div>
      )}

      {/* Line chart: last 12 months black spots trend */}
      {last12.length > 1 && (
        <>
          <h4 className="stats-subsection-title">近12个月 · Black Spots Trend</h4>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={last12}>
              <CartesianGrid vertical={false} stroke="#e8e0d5" />
              <XAxis dataKey="month" tick={CHART_STYLES.tick} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={CHART_STYLES.tick} axisLine={false} tickLine={false} width={28} />
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