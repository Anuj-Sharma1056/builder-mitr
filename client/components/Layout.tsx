import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "AI Chatbot" },
  { to: "/assessments", label: "Assessments" },
  { to: "/resources", label: "Resources" },
  { to: "/vr", label: "VR Agent" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4fbfb] to-white dark:from-[#0b1220] dark:to-[#0b1220] text-foreground">
      <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/20 border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 shadow-inner" />
            <span className="text-xl font-extrabold tracking-tight">
              MITR
            </span>
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
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
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
            <a className="hover:text-foreground" href="#privacy">Privacy</a>
            <a className="hover:text-foreground" href="#terms">Terms</a>
            <a className="hover:text-foreground" href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
