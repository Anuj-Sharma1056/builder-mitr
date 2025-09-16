import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <div className="mx-auto grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border bg-card shadow-lg md:grid-cols-2">
      <div className="relative hidden min-h-[420px] md:block">
        <img
          alt="Calm waves"
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-black/10" />
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Mindful breathing session ready
          </div>
          <h2 className="text-2xl font-bold leading-tight">Welcome to MITR</h2>
          <p className="mt-1 text-sm text-white/80">
            Your private space for mental wellness.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500" />
            <span className="text-xl font-extrabold tracking-tight">MITR</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold tracking-tight">Log in</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Continue your journey to a calmer mind.
          </p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border bg-background px-3 py-2 pl-10 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
          >
            Continue
          </button>

          <button
            type="button"
            className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Continue with Google
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to MITR’s privacy policy.
          </p>
        </form>
      </div>
    </div>
  );
}
