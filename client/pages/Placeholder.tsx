import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export default function Placeholder({
  title,
  description,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-cyan-50 to-emerald-50 dark:from-cyan-950/30 dark:to-emerald-950/20 p-8 md:p-10">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/20 to-emerald-400/20 blur-2xl" />
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-muted-foreground">{description}</p>
            {ctaHref && ctaLabel && (
              <div className="mt-6">
                <a
                  href={ctaHref}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  {ctaLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
