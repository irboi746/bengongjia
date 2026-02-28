// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "奔公甲的计算器",
  description: "奔公甲的计算器",
};

export const viewport = {
  width: 'device-width', initialScale: 1};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body >

        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className="flex-shrink-0">
            <Header />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto relative">
            {children}
          </div>

          {/* Bottom Navigation */}
          <div className="flex-shrink-0">
            <BottomNav />
          </div>
        </div>
      </body>
    </html>
  );
}
