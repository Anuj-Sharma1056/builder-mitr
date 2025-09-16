import { ArrowRight, Bot, Brain, Heart, Headphones, Shield, Sparkles, SquarePen, Trees } from "lucide-react";
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
              Private, science-backed tools for your mind. Screen with PHQ‑9, GAD‑7, GHQ‑12, chat with our AI companion, explore CBT resources, and unwind in an immersive VR oasis.
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
            <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Shield className="h-4 w-4"/> HIPAA‑style privacy</div>
              <div className="flex items-center gap-2"><Brain className="h-4 w-4"/> Evidence‑based</div>
              <div className="flex items-center gap-2"><Heart className="h-4 w-4"/> Human‑centric</div>
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
                    Let’s do a 2‑minute breathing exercise and then a quick PHQ‑9 check‑in.
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <Link to="/assessments" className="rounded-lg border p-3 text-center text-xs hover:bg-accent">
                  <SquarePen className="mx-auto mb-2 h-4 w-4" /> PHQ‑9
                </Link>
                <Link to="/assessments" className="rounded-lg border p-3 text-center text-xs hover:bg-accent">
                  <SquarePen className="mx-auto mb-2 h-4 w-4" /> GAD‑7
                </Link>
                <Link to="/assessments" className="rounded-lg border p-3 text-center text-xs hover:bg-accent">
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
          <FeatureCard icon={<Bot className="h-5 w-5" />} title="AI Mental Health Chatbot" desc="24/7 empathetic conversations that guide, reflect, and support." cta="Open chat" to="/chat" />
          <FeatureCard icon={<SquarePen className="h-5 w-5" />} title="PHQ‑9 • GAD‑7 • GHQ‑12" desc="Clinically‑validated screeners with helpful insights and next steps." cta="Start" to="/assessments" />
          <FeatureCard icon={<Headphones className="h-5 w-5" />} title="Guided CBT Resources" desc="Curated exercises, worksheets, and guides to build resilient habits." cta="Browse" to="/resources" />
          <FeatureCard icon={<Trees className="h-5 w-5" />} title="VR Soothing Spaces" desc="Immersive nature scenes for focus, meditation, and breathing." cta="Enter VR" to="/vr" />
        </div>
      </section>

      {/* Resources teaser */}
      <section className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-2xl border">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <ResourceCard
              title="Box Breathing"
              desc="4‑4‑4‑4 method to calm the nervous system in minutes."
              tag="Breathing"
              color="from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20"
            />
            <ResourceCard
              title="Cognitive Reframing"
              desc="Identify and reframe unhelpful thought patterns."
              tag="CBT"
              color="from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20"
            />
            <ResourceCard
              title="Body Scan Meditation"
              desc="Release tension by scanning attention from head to toe."
              tag="Mindfulness"
              color="from-sky-50 to-emerald-50 dark:from-sky-950/20 dark:to-emerald-950/20"
            />
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

function ResourceCard({ title, desc, tag, color }: { title: string; desc: string; tag: string; color: string }) {
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
