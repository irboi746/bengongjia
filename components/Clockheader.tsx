"use client";

import { useEffect, useState } from "react";
import { Solar } from "lunar-typescript";

function approximateLunar(date: Date): string {
  return Solar.fromDate(date).getLunar().toString();
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