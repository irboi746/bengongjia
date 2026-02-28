"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DayRecord } from "../hooks/useSpots";

interface WeekStatsProps {
  records: DayRecord[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

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

export default function WeekStats({ records }: WeekStatsProps) {
  const data = records.slice(-7).map((r) => ({
    date: formatDate(r.date),
    白圈: r.white,
    黑圈: r.black,
  }));

  if (data.length === 0) {
    return <div className="stats-empty"><p>暂无数据</p></div>;
  }

  return (
    <div className="stats-section">
      <h3 className="stats-section-title">本周 · This Week</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid vertical={false} stroke="#e8e0d5" />
          <XAxis dataKey="date" tick={CHART_STYLES.tick} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={CHART_STYLES.tick} axisLine={false} tickLine={false} width={28} />
          <Tooltip contentStyle={CHART_STYLES.tooltip} />
          <Legend wrapperStyle={{ fontSize: "0.8rem", fontFamily: "inherit" }} />
          <Bar dataKey="白圈" fill="#e8e0d0" stroke="#c4793a" strokeWidth={1} radius={[3, 3, 0, 0]} />
          <Bar dataKey="黑圈" fill="#2a2018" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}