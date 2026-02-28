"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { STORIES, STORY_COVERS } from "../../utils/constants";

// Group stories by the "story" field
function groupByStory(stories: typeof STORIES) {
  const groups: Record<string, typeof STORIES> = {};
  for (const item of stories) {
    if (!groups[item.story]) groups[item.story] = [];
    groups[item.story].push(item);
  }
  return groups;
}

// Render content as simple markdown-like paragraphs
function MarkdownContent({ content }: { content: string }) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  return (
    <div className="prose-content space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className="leading-8 text-stone-700 text-[1.05rem]">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}

function slugify(str: string) {
  return `story-${encodeURIComponent(str)}`;
}

function chapterSlug(storyGroup: string, title: string) {
  return `${encodeURIComponent(storyGroup)}-${encodeURIComponent(title)}`;
}

export default function AnecdotesPage() {
  const grouped = groupByStory(STORIES);
  const groupKeys = Object.keys(grouped);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    document.querySelectorAll("[data-section]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;500;700&family=Cinzel+Decorative:wght@400;700&display=swap');

        .page-wrap {
          font-family: 'Noto Serif SC', serif;
          background: #f4efe6;
          min-height: 100vh;
          color: #1c1410;
          padding-bottom: 6rem;
        }

        /* ── Title block — matches HomeToolbar ── */
        .anecdotes-toolbar {
          display: flex;
          align-items: flex-start;
          max-width: 960px;
          margin: 0 auto;
          padding: 1.25rem 1.5rem 0;
        }

        /* reuse home-toolbar-title-block styles from HomeToolbar */
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

        /* ── TOC ── */
        .toc-item {
          cursor: pointer;
          transition: color 0.2s, padding-left 0.2s;
          border-left: 2px solid transparent;
          padding-left: 0.75rem;
          background: none;
          border-top: none;
          border-right: none;
          border-bottom: none;
        }
        .toc-item:hover {
          color: #c4793a;
          padding-left: 1rem;
        }
        .toc-item.active {
          color: #c4793a;
          border-left-color: #c4793a;
          padding-left: 1rem;
          font-weight: 500;
        }

        /* ── Story content ── */
        .story-section {
          scroll-margin-top: 5rem;
        }
        .chapter-divider {
          border: none;
          border-top: 1px solid #d8cfc0;
          margin: 2rem 0;
        }
        .drop-cap::first-letter {
          font-size: 3.5rem;
          float: left;
          line-height: 1;
          padding-right: 0.2rem;
          padding-top: 0.1rem;
          color: #c4793a;
          font-weight: 700;
        }
        .group-title-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .group-title-bar::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #d8cfc0;
        }

        @media (max-width: 768px) {
          .layout { flex-direction: column; }
          .toc-sidebar { display: none; }
        }
      `}</style>

      <div className="page-wrap">

        {/* Title block — mirrors HomeToolbar */}
        <div className="anecdotes-toolbar">
          <div className="home-toolbar-title-block">
            <h2 className="home-toolbar-title">典故</h2>
            <p className="home-toolbar-subtitle">Anecdotes · Stories of Practice</p>
          </div>
        </div>

        <div
          className="layout"
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "2rem 1.5rem 0",
            display: "flex",
            gap: "3rem",
          }}
        >
          {/* Table of Contents */}
          <aside
            className="toc-sidebar"
            style={{
              width: "200px",
              flexShrink: 0,
              position: "sticky",
              top: "5rem",
              alignSelf: "flex-start",
            }}
          >
            <p
              style={{
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#a08060",
                marginBottom: "1rem",
                fontFamily: "inherit",
              }}
            >
              Contents
            </p>
            <nav className="space-y-4">
              {groupKeys.map((groupKey) => (
                <div key={groupKey}>
                  <button
                    onClick={() => scrollTo(slugify(groupKey))}
                    className={`toc-item block text-left w-full text-sm font-medium mb-1 ${
                      activeId === slugify(groupKey) ? "active" : ""
                    }`}
                    style={{ color: "#1c1410" }}
                  >
                    {groupKey}
                  </button>
                  <div className="space-y-1 ml-2">
                    {grouped[groupKey].map((item) => {
                      const id = chapterSlug(item.story, item.title);
                      return (
                        <button
                          key={id}
                          onClick={() => scrollTo(id)}
                          className={`toc-item block text-left w-full text-xs ${
                            activeId === id ? "active" : ""
                          }`}
                          style={{ color: "#8b7355" }}
                        >
                          {item.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {groupKeys.map((groupKey, gi) => (
              <section
                key={groupKey}
                id={slugify(groupKey)}
                data-section
                className="story-section mb-16"
              >
                {/* Cover image */}
                {STORY_COVERS[groupKey] && (
                  <div className="relative w-full h-64 mb-8 rounded overflow-hidden">
                    <Image
                      src={STORY_COVERS[groupKey]}
                      alt={groupKey}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Story group title */}
                <div className="group-title-bar">
                  <h2
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      letterSpacing: "0.14em",
                      color: "#1c1410",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {groupKey}
                  </h2>
                </div>

                {/* Chapters */}
                {grouped[groupKey].map((item, ci) => {
                  const id = chapterSlug(item.story, item.title);
                  return (
                    <article
                      key={id}
                      id={id}
                      data-section
                      className="story-section mb-12"
                    >
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 500,
                          color: "#c4793a",
                          marginBottom: "1rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {item.title}
                      </h3>
                      <div className={ci === 0 ? "drop-cap" : ""}>
                        <MarkdownContent content={item.content} />
                      </div>
                      {ci < grouped[groupKey].length - 1 && (
                        <hr className="chapter-divider" />
                      )}
                    </article>
                  );
                })}

                {gi < groupKeys.length - 1 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#d8cfc0",
                      fontSize: "1.5rem",
                      letterSpacing: "0.5rem",
                      margin: "3rem 0",
                    }}
                  >
                    ✦ ✦ ✦
                  </div>
                )}
              </section>
            ))}
          </main>
        </div>
      </div>
    </>
  );
}