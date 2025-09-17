import {
  ArrowRight,
  Bot,
  Brain,
  Heart,
  Headphones,
  Shield,
  Sparkles,
  SquarePen,
  Trees,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-cyan-50 via-emerald-50 to-white dark:from-cyan-950/30 dark:via-emerald-950/20 dark:to-transparent p-8 md:p-12">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Your companion for calm
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              MITR — Mental Health Support Platform
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Private, science-backed tools for your mind. Screen with PHQ‑9,
              GAD‑7, GHQ‑12, chat with our AI companion, explore CBT resources,
              and unwind in an immersive VR oasis.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/assessments"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
              >
                Start screening
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-sm font-medium hover:bg-accent"
              >
                Talk to AI
              </Link>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="relative">
            <div className="mx-auto w-full max-w-md rounded-2xl border bg-card p-4 shadow-xl">
              <div className="rounded-xl bg-gradient-to-br from-cyan-600 to-emerald-600 p-4 text-primary-foreground">
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Bot className="h-4 w-4" /> MITR Assistant
                </div>
                <div className="mt-3 space-y-2">
                  <div className="w-fit max-w-[85%] rounded-lg bg-white/15 px-3 py-2 text-sm backdrop-blur">
                    Hi, I’m here to support you. How are you feeling today?
                  </div>
                  <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-black/20 px-3 py-2 text-right text-sm backdrop-blur">
                    A little overwhelmed. I’d like to breathe and slow down.
                  </div>
                  <div className="w-fit max-w-[85%] rounded-lg bg-white/15 px-3 py-2 text-sm backdrop-blur">
                    Let’s do a 2‑minute breathing exercise and then a quick
                    PHQ‑9 check‑in.
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Link
                  to="/assessments"
                  className="rounded-lg border p-3 text-center text-xs hover:bg-accent"
                >
                  <SquarePen className="mx-auto mb-2 h-4 w-4" /> PHQ‑9
                </Link>
                <Link
                  to="/assessments"
                  className="rounded-lg border p-3 text-center text-xs hover:bg-accent"
                >
                  <SquarePen className="mx-auto mb-2 h-4 w-4" /> GAD‑7
                </Link>
                <Link
                  to="/assessments"
                  className="rounded-lg border p-3 text-center text-xs hover:bg-accent"
                >
                  <SquarePen className="mx-auto mb-2 h-4 w-4" /> GHQ‑12
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Bot className="h-5 w-5" />}
            title="AI Mental Health Chatbot"
            desc="24/7 empathetic conversations that guide, reflect, and support."
            cta="Open chat"
            to="/chat"
          />
          <FeatureCard
            icon={<SquarePen className="h-5 w-5" />}
            title="PHQ‑9 • GAD‑7 • GHQ‑12"
            desc="Clinically‑validated screeners with helpful insights and next steps."
            cta="Start"
            to="/assessments"
          />
          <FeatureCard
            icon={<Headphones className="h-5 w-5" />}
            title="Guided CBT Resources"
            desc="Curated exercises, worksheets, and guides to build resilient habits."
            cta="Browse"
            to="/resources"
          />
          <FeatureCard
            icon={<Trees className="h-5 w-5" />}
            title="VR Soothing Spaces"
            desc="Immersive nature scenes for focus, meditation, and breathing."
            cta="Enter VR"
            to="/vr"
          />
        </div>
      </section>

      {/* Mental health facts */}
      <section className="mx-auto max-w-6xl">
        <div className="rounded-2xl border bg-card p-6">
          <h3 className="text-lg font-semibold">Mental health at a glance</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border p-4">
              <div className="text-3xl font-extrabold text-primary">1 in 8</div>
              <p className="mt-1 text-sm text-muted-foreground">people globally live with a mental health condition.</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">Source: WHO</p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-3xl font-extrabold text-primary">~20%</div>
              <p className="mt-1 text-sm text-muted-foreground">of adolescents experience mental health challenges.</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">Source: WHO/UNICEF</p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-3xl font-extrabold text-primary">#1–2</div>
              <p className="mt-1 text-sm text-muted-foreground">Anxiety & depression are leading causes of disability.</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">Source: Global Burden of Disease</p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="text-3xl font-extrabold text-primary">Early</div>
              <p className="mt-1 text-sm text-muted-foreground">support improves outcomes and quality of life.</p>
              <p className="mt-1 text-[11px] text-muted-foreground/70">Consensus across clinical guidelines</p>
            </div>
          </div>
        </div>
      </section>

      {/* How MITR helps + FAQs */}
      <section className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border bg-card p-6">
            <h3 className="text-lg font-semibold">How MITR helps</h3>
            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
              <li><span className="block text-3xl font-extrabold text-primary">24/7</span> Always‑on AI support for check‑ins and grounding.</li>
              <li><span className="block text-3xl font-extrabold text-primary">3</span> Validated screeners: PHQ‑9, GAD‑7, GHQ‑12 with guidance.</li>
              <li><span className="block text-3xl font-extrabold text-primary">2 min</span> Quick breathing to reduce arousal before assessments.</li>
              <li><span className="block text-3xl font-extrabold text-primary">0</span> No medical advice. We complement—not replace—care.</li>
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold">FAQs</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <details className="rounded-lg border p-3 [&_summary]:cursor-pointer">
                <summary className="font-medium">Is MITR a replacement for therapy?</summary>
                <p className="mt-2 text-sm text-muted-foreground">No. MITR offers education and support but is not a substitute for professional care.</p>
              </details>
              <details className="rounded-lg border p-3 [&_summary]:cursor-pointer">
                <summary className="font-medium">Are my assessment results stored?</summary>
                <p className="mt-2 text-sm text-muted-foreground">We store them to show progress and insights. You can request deletion anytime.</p>
              </details>
              <details className="rounded-lg border p-3 [&_summary]:cursor-pointer">
                <summary className="font-medium">How do I get started?</summary>
                <p className="mt-2 text-sm text-muted-foreground">Begin with a PHQ‑9 check‑in or open the AI chat for a grounding exercise.</p>
              </details>
              <details className="rounded-lg border p-3 [&_summary]:cursor-pointer">
                <summary className="font-medium">Does MITR work on mobile?</summary>
                <p className="mt-2 text-sm text-muted-foreground">Yes, it’s optimized for phones, tablets, and desktops.</p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  cta,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-colors hover:bg-accent/50"
    >
      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-primary/10 p-3 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function ResourceCard({
  title,
  desc,
  tag,
  color,
}: {
  title: string;
  desc: string;
  tag: string;
  color: string;
}) {
  return (
    <div className={"relative bg-gradient-to-br p-6 md:p-8 " + color}>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur dark:bg-white/10 dark:text-white">
        {tag}
      </div>
      <h4 className="text-lg font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{desc}</p>
    </div>
  );
}
