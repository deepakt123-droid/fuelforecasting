import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Home, BarChart2, Table, TrendingUp, Calculator, MapPin,
  Menu, X, Fuel, Moon, Sun, FlaskConical, BookOpen, Newspaper, ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home", section: "main" },
  { href: "/graphs", icon: BarChart2, label: "Price Charts", section: "main" },
  { href: "/table", icon: Table, label: "Data Tables", section: "main" },
  { href: "/forecast", icon: TrendingUp, label: "10-Year Projection", section: "main" },
  { href: "/calculator", icon: Calculator, label: "Expense Calculator", section: "main" },
  { href: "/city", icon: MapPin, label: "City Dashboard", section: "main" },
  { href: "/math", icon: FlaskConical, label: "Math Framework", section: "analysis" },
  { href: "/events", icon: Newspaper, label: "Market Events", section: "analysis" },
  { href: "/references", icon: BookOpen, label: "References", section: "analysis" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const NavContent = () => (
    <nav className="flex flex-col h-full overflow-hidden">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
            <Fuel size={15} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground text-sm leading-tight">Fuel Forecast</div>
            <div className="text-xs text-muted-foreground">India — Analytics</div>
          </div>
        </div>
      </div>

      <div className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
        {/* Main */}
        <div className="px-2 pb-1 pt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Analytics</span>
        </div>
        {NAV_ITEMS.filter(i => i.section === "main").map(item => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={15} className="flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <ChevronRight size={12} className="opacity-60" />}
              </div>
            </Link>
          );
        })}

        {/* Analysis */}
        <div className="px-2 pb-1 pt-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Research</span>
        </div>
        {NAV_ITEMS.filter(i => i.section === "analysis").map(item => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={15} className="flex-shrink-0" />
                <span className="flex-1 truncate">{item.label}</span>
                {isActive && <ChevronRight size={12} className="opacity-60" />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="px-2 py-3 border-t border-sidebar-border flex-shrink-0 space-y-1">
        <button
          onClick={toggleDark}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="px-3 py-2 rounded-xl bg-sidebar-accent/60 text-xs text-muted-foreground leading-relaxed">
          <div className="font-semibold text-sidebar-foreground mb-0.5 text-[11px]">Data Coverage</div>
          Petrol & Diesel: 2014–2026<br />
          LPG: 2013–2026 · Forecast: 2026–2036
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0 z-10">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1">
              <X size={18} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-muted transition-all">
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              <Fuel size={15} className="text-primary" />
              <span className="font-bold text-foreground text-sm">Fuel Forecast</span>
            </div>
          </div>
          <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-muted transition-all">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
