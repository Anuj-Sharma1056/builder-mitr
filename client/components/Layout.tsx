import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Chatbot" },
  { to: "/assessments", label: "Assessments" },
  { to: "/resources", label: "Resources" },
  { to: "/vr", label: "VR Agent" },
];

import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<null | "privacy" | "terms" | "contact">(
    null,
  );
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fbfb] to-white dark:from-[#0b1220] dark:to-[#0b1220] text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/20 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-inner" />
            <span className="text-xl font-extrabold tracking-tight">MITR</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden sm:inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium hover:bg-accent"
            >
              Log in
            </Link>
            <Link
              to="/assessments"
              className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 md:py-12">{children}</main>

      <footer className="border-t py-8 mt-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MITR — Mental Wellness, with a friend.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button
              className="hover:text-foreground"
              onClick={() => setModal("privacy")}
            >
              Privacy
            </button>
            <button
              className="hover:text-foreground"
              onClick={() => setModal("terms")}
            >
              Terms
            </button>
            <button
              className="hover:text-foreground"
              onClick={() => setModal("contact")}
            >
              Contact
            </button>
          </div>
        </div>
      </footer>

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-4 md:inset-24 rounded-2xl border bg-card shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-lg font-semibold">
                {modal === "privacy" && "Privacy Policy (Simulated)"}
                {modal === "terms" && "Terms of Use (Simulated)"}
                {modal === "contact" && "Contact (Simulated)"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
              >
                Close
              </button>
            </div>
            <div className="p-4 space-y-4 text-sm leading-6 max-h-[70vh] overflow-auto">
              {modal === "privacy" && (
                <div>
                  <p>
                    We respect your privacy. Data you enter is processed to
                    provide the MITR experience. We do not sell personal data.
                    Sessions may be stored to improve your experience.
                  </p>
                  <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                    <li>
                      Encryption in transit; secure storage where applicable.
                    </li>
                    <li>You can request deletion by contacting us.</li>
                    <li>
                      Third‑party services (e.g., auth, analytics) may process
                      limited data.
                    </li>
                  </ul>
                </div>
              )}
              {modal === "terms" && (
                <div>
                  <p>
                    MITR is for education and wellbeing support only and is not
                    a substitute for professional diagnosis, treatment, or
                    therapy.
                  </p>
                  <h4 className="font-semibold mt-3">Do</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Use screeners and resources as guidance.</li>
                    <li>
                      Consult licensed professionals for medical decisions.
                    </li>
                    <li>Contact emergency services if you are in danger.</li>
                  </ul>
                  <h4 className="font-semibold mt-3">Don’t</h4>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Rely on MITR for crisis intervention.</li>
                    <li>Share passwords or sensitive financial data.</li>
                  </ul>
                  <p className="mt-3 text-muted-foreground">
                    By using MITR you agree to these simulated terms.
                  </p>
                </div>
              )}
              {modal === "contact" && (
                <div>
                  <p>Reach us at:</p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    <li>Email: support@mitr.example</li>
                    <li>Phone: +1 (555) 010‑9020</li>
                    <li>Office hours: Mon–Fri 9:00–17:00 (IST)</li>
                  </ul>
                  <p className="mt-3 text-muted-foreground">
                    For emergencies, call your local emergency number
                    immediately.
                  </p>
                </div>
              )}
              <div className="rounded-md border bg-accent/40 p-3 text-xs">
                Disclaimer: MITR does not provide medical advice. If you are
                thinking about harming yourself or others, or are in immediate
                danger, call local emergency services or a crisis hotline right
                away.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
