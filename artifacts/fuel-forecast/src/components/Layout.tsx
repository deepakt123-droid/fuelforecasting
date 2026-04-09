import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Home, BarChart2, Table, TrendingUp, Calculator, MapPin, Menu, X, Fuel, Moon, Sun } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/graphs", icon: BarChart2, label: "Price Charts" },
  { href: "/table", icon: Table, label: "Data Tables" },
  { href: "/forecast", icon: TrendingUp, label: "10-Year Forecast" },
  { href: "/calculator", icon: Calculator, label: "Calculator" },
  { href: "/city", icon: MapPin, label: "City Dashboard" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggleDark = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  const NavContent = () => (
    <nav className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Fuel size={16} className="text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground text-sm leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Fuel Forecast</div>
            <div className="text-xs text-muted-foreground">India Analytics</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                onClick={() => setSidebarOpen(false)}
                data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-sidebar-border">
        <button
          onClick={toggleDark}
          data-testid="btn-dark-mode"
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-all"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
        <div className="mt-3 px-3 py-2 rounded-xl bg-sidebar-accent/50 text-xs text-muted-foreground">
          <div className="font-semibold text-sidebar-foreground mb-0.5">Data Coverage</div>
          Petrol & Diesel: 2014–2026<br />
          LPG: 2013–2026<br />
          Forecast: 2026–2036
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 xl:w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0 z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              data-testid="btn-close-sidebar"
            >
              <X size={18} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              data-testid="btn-open-sidebar"
              className="p-2 rounded-xl hover:bg-muted transition-all"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              <Fuel size={16} className="text-primary" />
              <span className="font-bold text-foreground text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Fuel Forecast</span>
            </div>
          </div>
          <button onClick={toggleDark} className="p-2 rounded-xl hover:bg-muted transition-all">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-6 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
