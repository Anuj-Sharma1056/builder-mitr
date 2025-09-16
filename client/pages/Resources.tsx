import React, { useEffect, useMemo, useState } from "react";
import {
  Filter,
  PlaySquare,
  BookOpen,
  FileText,
  Search,
  X,
  ExternalLink,
} from "lucide-react";

type ResourceType = "cbt" | "exercise" | "video" | "article";

interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  description: string;
  url: string;
  provider?: string;
  tags: string[];
  thumb?: string;
}

const RESOURCES: ResourceItem[] = [
  // CBT Guides (PDFs / modules)
  {
    id: "cbt-self-esteem",
    title: "CBT Module: What is Self‑Esteem?",
    type: "cbt",
    description:
      "CCI workbook module introducing self‑esteem with CBT strategies.",
    url: "/resources/cbt-self-esteem.html",
    provider: "Centre for Clinical Interventions (CCI)",
    tags: ["cbt", "self-esteem", "workbook"],
  },
  {
    id: "cbt-thought-record",
    title: "CBT Thought Record Sheet (PDF)",
    type: "cbt",
    description:
      "A printable thought record to identify triggers, thoughts, and balanced alternatives.",
    url: "/resources/cbt-thought-record.html",
    provider: "Get Self Help",
    tags: ["cbt", "thought record", "worksheet"],
  },
  {
    id: "cbt-what-is-anxiety",
    title: "CBT: What is Anxiety?",
    type: "cbt",
    description: "Learn how anxiety works and how CBT helps reduce it.",
    url: "/resources/cbt-what-is-anxiety.html",
    provider: "CCI",
    tags: ["cbt", "anxiety", "psychoeducation"],
  },

  // Exercises (guides)
  {
    id: "exercise-box-breathing",
    title: "Box Breathing: 4‑4‑4‑4 Technique",
    type: "exercise",
    description: "A simple paced breathing exercise to activate calm.",
    url: "/resources/box-breathing.html",
    provider: "Healthline",
    tags: ["breathing", "stress", "calming"],
  },
  {
    id: "exercise-grounding-54321",
    title: "Grounding Techniques (5‑4‑3‑2‑1)",
    type: "exercise",
    description: "Practice present‑moment awareness using your senses.",
    url: "https://www.healthline.com/health/grounding-techniques",
    provider: "Healthline",
    tags: ["grounding", "anxiety", "mindfulness"],
  },
  {
    id: "exercise-cognitive-restructuring",
    title: "Cognitive Restructuring in CBT",
    type: "exercise",
    description: "Step‑by‑step guide to challenge unhelpful thoughts.",
    url: "/resources/cognitive-restructuring.html",
    provider: "PositivePsychology.com",
    tags: ["cbt", "reframing", "thoughts"],
  },

  // Videos (YouTube)
  {
    id: "video-box-breathing",
    title: "Guided Box Breathing (5 mins)",
    type: "video",
    description: "A short guided session to slow your breath and mind.",
    url: "https://www.youtube.com/watch?v=tEmt1Znux58",
    provider: "YouTube",
    tags: ["breathing", "relaxation", "video"],
  },
  {
    id: "video-meditation-5min",
    title: "5‑Minute Mindful Breathing",
    type: "video",
    description: "Gently return attention to the breath.",
    url: "https://www.youtube.com/watch?v=YFSc7Ck0Ao0",
    provider: "YouTube",
    tags: ["meditation", "breath", "mindfulness"],
  },
  {
    id: "video-pmr",
    title: "Progressive Muscle Relaxation",
    type: "video",
    description: "Release tension through a guided PMR routine.",
    url: "https://www.youtube.com/watch?v=ihO02wUzgkc",
    provider: "YouTube",
    tags: ["relaxation", "pmr", "body"],
  },

  // Articles (trusted orgs)
  {
    id: "article-anxiety-self-care",
    title: "Anxiety self‑care tips",
    type: "article",
    description: "Simple ways to help manage anxiety symptoms day‑to‑day.",
    url: "/resources/anxiety-self-care.html",
    provider: "Mind UK",
    tags: ["anxiety", "self‑care", "tips"],
  },
  {
    id: "article-nhs-breathing",
    title: "NHS: Breathing Exercises for Stress",
    type: "article",
    description: "A quick technique to reduce stress whenever you need it.",
    url: "/resources/breathing-for-stress.html",
    provider: "NHS",
    tags: ["breathing", "stress", "nhs"],
  },
];

const TYPE_META: Record<
  ResourceType,
  { label: string; icon: React.ReactNode }
> = {
  cbt: { label: "CBT Guides", icon: <BookOpen className="h-4 w-4" /> },
  exercise: { label: "Exercises", icon: <FileText className="h-4 w-4" /> },
  video: { label: "Videos", icon: <PlaySquare className="h-4 w-4" /> },
  article: { label: "Articles", icon: <FileText className="h-4 w-4" /> },
};

function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      let id = "";
      if (u.hostname.includes("youtu.be")) id = u.pathname.slice(1);
      else id = u.searchParams.get("v") || "";
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  } catch {
    return url;
  }
}

export default function Resources() {
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([]);
  const [active, setActive] = useState<ResourceItem | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loadTimedOut, setLoadTimedOut] = useState(false);

  useEffect(() => {
    if (!active) return;
    setIframeLoaded(false);
    setLoadTimedOut(false);
    const t = setTimeout(() => setLoadTimedOut(true), 4500);
    return () => clearTimeout(t);
  }, [active]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => {
      const byType =
        selectedTypes.length === 0 || selectedTypes.includes(r.type);
      if (!byType) return false;
      if (!q) return true;
      const hay =
        `${r.title} ${r.description} ${r.provider || ""} ${r.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [query, selectedTypes]);

  const toggleType = (t: ResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="rounded-2xl border bg-card p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Resources Hub
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              CBT guides, exercises, articles, and videos to support your
              practice.
            </p>
          </div>
          <div className="flex w-full gap-2 md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by keyword..."
                className="w-full rounded-lg border bg-background pl-9 pr-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" /> Filter by type
          </span>
          {(Object.keys(TYPE_META) as ResourceType[]).map((t) => (
            <button
              key={t}
              onClick={() => toggleType(t)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                selectedTypes.includes(t)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "hover:bg-accent"
              }`}
            >
              {TYPE_META[t].icon}
              {TYPE_META[t].label}
            </button>
          ))}
          {selectedTypes.length > 0 && (
            <button
              onClick={() => setSelectedTypes([])}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-accent"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <article
            key={r.id}
            className="group relative overflow-hidden rounded-2xl border bg-card p-4 hover:bg-accent transition-colors"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              {TYPE_META[r.type].icon}
              {TYPE_META[r.type].label}
            </div>
            <h3 className="text-base font-semibold leading-snug">{r.title}</h3>
            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
              {r.description}
            </p>
            {r.provider && (
              <p className="mt-2 text-xs text-muted-foreground">
                Source: {r.provider}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => setActive(r)}
              className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Open
            </button>
          </article>
        ))}
      </div>

      {/* Iframe Overlay */}
      {active && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-4 md:inset-10 rounded-2xl border bg-card shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between border-b p-3 md:p-4">
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">
                  {TYPE_META[active.type].label}
                </div>
                <h3 className="truncate text-base md:text-lg font-semibold">
                  {active.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={active.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs hover:bg-accent"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open in new tab
                </a>
                <button
                  onClick={() => setActive(null)}
                  className="inline-flex items-center rounded-md border p-2 hover:bg-accent"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="relative flex-1 bg-background">
              {!iframeLoaded && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-lg border bg-card px-4 py-3 text-sm text-muted-foreground">
                    Loading resource...
                  </div>
                </div>
              )}
              <iframe
                key={active.id}
                src={toEmbedUrl(active.url)}
                className="h-full w-full"
                onLoad={() => setIframeLoaded(true)}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
                title={active.title}
              />
              {loadTimedOut && !iframeLoaded && (
                <div className="absolute inset-0 grid place-items-center p-4">
                  <div className="max-w-md rounded-xl border bg-card p-4 text-center text-sm">
                    <p className="text-muted-foreground">
                      This site may block embedding in an iframe. You can open
                      it directly in a new tab.
                    </p>
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Open resource
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
