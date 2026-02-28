"use client";

import { useRef } from "react";

interface HomeToolbarProps {
  onExport: () => void;
  onImport: (file: File) => void;
}

export default function HomeToolbar({ onExport, onImport }: HomeToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <>
      <style>{`
        .home-toolbar {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          max-width: 480px;
          margin: 0 auto;
          padding: 1.25rem 1.25rem 0;
        }
        .home-toolbar-title-block {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }
        .home-toolbar-title {
          font-size: 1.3rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          color: #1c1410;
          line-height: 1;
        }
        .home-toolbar-subtitle {
          font-size: 0.68rem;
          color: #a08060;
          letter-spacing: 0.06em;
        }
        .home-toolbar-actions {
          display: flex;
          flex-direction: row;
          gap: 0.5rem;
          align-items: center;
          padding-top: 0.2rem;
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
      `}</style>

      <div className="home-toolbar">
        <div className="home-toolbar-title-block">
          <h2 className="home-toolbar-title">降伏其心</h2>
          <p className="home-toolbar-subtitle">Conquer Your Thoughts · Geshe Ben Gungyal</p>
        </div>
        <div className="home-toolbar-actions">
          <button className="header-btn" onClick={onExport} title="Export CSV">
            <ExportIcon />
            <span>导出</span>
          </button>
          <button
            className="header-btn"
            onClick={() => fileInputRef.current?.click()}
            title="Import CSV"
          >
            <ImportIcon />
            <span>导入</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </>
  );
}

function ExportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ImportIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}