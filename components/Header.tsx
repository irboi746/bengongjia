// components/Header.tsx
"use client";
export default function Header() {

  return (
    <header className="bg-white border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Site Title */}
        <h2 className="text-xl font-bold text-gray-900">奔公甲的计算器</h2>
      </div>
    </header>
  );
}
