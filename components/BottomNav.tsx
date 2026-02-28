// components/BottomNav.tsx
"use client";

import Link from "next/link";
import { Home, LibraryBigIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "首页" },
    { href: "/anecdotes", icon: LibraryBigIcon, label: "典故" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              pathname === href
                ? "text-gray-600 border-t-2 border-gray-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label={label}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
