"use client";

import { useEffect, useState } from "react";

// Minimal Chinese lunar calendar approximation
// Uses a lookup approach for the heavenly stems + earthly branches
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const LUNAR_MONTHS = ["正", "二", "三", "四", "五", "六", "七", "八", "九", "十", "冬", "腊"];
const LUNAR_DAYS = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十",
];

function getChineseYear(year: number) {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return `${HEAVENLY_STEMS[stemIndex]}${EARTHLY_BRANCHES[branchIndex]}年`;
}

// Simple lunar date approximation (not a full calendar library)
function approximateLunar(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  // Approximate lunar month (offset by ~21 days from solar)
  const lunarMonth = ((month + 1) % 12);
  const lunarDay = Math.min(day, 30) - 1;

  return `${getChineseYear(year)} ${LUNAR_MONTHS[lunarMonth]}月${LUNAR_DAYS[lunarDay]}`;
}

const WEEKDAYS_ZH = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export default function ClockHeader() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!now) return <div className="clock-header-skeleton" />;

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const dateStr = now.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const weekday = WEEKDAYS_ZH[now.getDay()];
  const lunar = approximateLunar(now);

  return (
    <div className="clock-header">
      <div className="clock-time">
        {hh}<span className="clock-colon">:</span>{mm}<span className="clock-colon">:</span>{ss}
      </div>
      <div className="clock-date">{dateStr} · {weekday}</div>
      <div className="clock-lunar">{lunar}</div>
    </div>
  );
}