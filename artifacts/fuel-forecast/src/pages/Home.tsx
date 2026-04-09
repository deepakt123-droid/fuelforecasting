import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  TrendingUp, TrendingDown, Minus, BarChart2, Table,
  Calculator, MapPin, Fuel, FlaskConical, Newspaper, BookOpen
} from "lucide-react";
import {
  FUEL_TYPES, CITIES, getCurrentPrice,
  petrolHistory, dieselHistory, lpgHistory,
  type City, type FuelType
} from "@/data/fuelData";

function AnimatedNumber({ value, decimals = 2 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const end = value;
    const duration = 1000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(eased * end);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{display.toFixed(decimals)}</span>;
}

function ChangeTag({ current, previous }: { current: number; previous: number }) {
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.01)
    return <span className="flex items-center gap-1 text-muted-foreground text-xs"><Minus size={11} /> Stable</span>;
  if (pct > 0)
    return <span className="flex items-center gap-1 text-red-500 text-xs font-medium"><TrendingUp size={11} /> +{pct.toFixed(1)}%</span>;
  return <span className="flex items-center gap-1 text-emerald-500 text-xs font-medium"><TrendingDown size={11} /> {pct.toFixed(1)}%</span>;
}

const QUICK_NAV = [
  { href: "/graphs", icon: BarChart2, label: "Price Charts", desc: "Historical trend visualisation", badge: "📈", bg: "bg-teal-50 dark:bg-teal-950/30", ic: "text-teal-600 dark:text-teal-400" },
  { href: "/forecast", icon: TrendingUp, label: "10-Year Projection", desc: "Month-wise predictions 2026–2036", badge: "🔭", bg: "bg-blue-50 dark:bg-blue-950/30", ic: "text-blue-600 dark:text-blue-400" },
  { href: "/calculator", icon: Calculator, label: "Expense Calculator", desc: "Future fuel cost estimator", badge: "🧮", bg: "bg-amber-50 dark:bg-amber-950/30", ic: "text-amber-600 dark:text-amber-400" },
  { href: "/city", icon: MapPin, label: "City Dashboard", desc: "Per-city & per-fuel breakdown", badge: "🏙️", bg: "bg-violet-50 dark:bg-violet-950/30", ic: "text-violet-600 dark:text-violet-400" },
  { href: "/math", icon: FlaskConical, label: "Math Framework", desc: "Model equations & statistics", badge: "📐", bg: "bg-indigo-50 dark:bg-indigo-950/30", ic: "text-indigo-600 dark:text-indigo-400" },
  { href: "/events", icon: Newspaper, label: "Market Events", desc: "Key price-impact events timeline", badge: "📰", bg: "bg-orange-50 dark:bg-orange-950/30", ic: "text-orange-600 dark:text-orange-400" },
  { href: "/table", icon: Table, label: "Data Tables", desc: "Complete historical database", badge: "📋", bg: "bg-slate-50 dark:bg-slate-950/30", ic: "text-slate-600 dark:text-slate-400" },
  { href: "/references", icon: BookOpen, label: "References", desc: "Sources & academic literature", badge: "📚", bg: "bg-rose-50 dark:bg-rose-950/30", ic: "text-rose-600 dark:text-rose-400" },
];

const OVERVIEW_STATS = [
  { label: "Years of Data", value: "13+", desc: "2013 → Apr 2026", icon: "📅" },
  { label: "Data Points", value: "1,200+", desc: "Monthly city-fuel records", icon: "🗃️" },
  { label: "Forecast Horizon", value: "120 mo", desc: "May 2026 → Apr 2036", icon: "🔭" },
  { label: "Model Type", value: "OLS", desc: "Ordinary Least Squares", icon: "📐" },
];

export default function Home() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");

  const currentPrices = getCurrentPrice(selectedFuel);
  const historyMap = { petrol: petrolHistory, diesel: dieselHistory, lpg: lpgHistory };
  const history = historyMap[selectedFuel];
  const prevRecord = history[history.length - 2];

  const maxPrice = Math.max(...CITIES.map(c => currentPrices[c.key]));
  const minPrice = Math.min(...CITIES.map(c => currentPrices[c.key]));
  const avgPrice = CITIES.reduce((s, c) => s + currentPrices[c.key], 0) / CITIES.length;

  const summaryStats = [
    { label: "Metro Average", value: avgPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", tag: "from-teal-500 to-emerald-600" },
    { label: "Lowest Metro", value: minPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", tag: "from-emerald-500 to-teal-600" },
    { label: "Highest Metro", value: maxPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", tag: "from-orange-500 to-amber-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl mint-glow" style={{
        background: "linear-gradient(135deg, hsl(168 72% 32%) 0%, hsl(185 75% 40%) 50%, hsl(168 65% 38%) 100%)"
      }}>
        <div className="absolute inset-0 dot-pattern opacity-25" />
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute -right-8 -bottom-24 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <Fuel size={18} />
            <span className="text-xs font-semibold tracking-widest uppercase">India Fuel Analytics Platform</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight">
            Fuel Price Trend<br />
            <span className="opacity-85">Forecasting System</span>
          </h1>
          <p className="text-white/70 max-w-2xl text-sm md:text-base mb-6 leading-relaxed">
            Real PPAC & IndaneGas data for Delhi, Mumbai, Chennai & Kolkata — petrol, diesel, and LPG — with
            Least Squares Regression models generating month-wise, 10-year price projections.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/graphs">
              <button className="px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:-translate-y-0.5">
                View Price Charts
              </button>
            </Link>
            <Link href="/forecast">
              <button className="px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm">
                10-Year Projection
              </button>
            </Link>
            <Link href="/math">
              <button className="px-5 py-2.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm">
                Math Framework
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {OVERVIEW_STATS.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center card-lift">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-xl font-bold text-primary">{s.value}</div>
            <div className="text-xs font-semibold text-foreground">{s.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Current Prices */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-foreground">Current Retail Prices</h2>
          <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-lg">As of April 2026</div>
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {FUEL_TYPES.map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedFuel(f.key)}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedFuel === f.key
                  ? "bg-primary text-white shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {summaryStats.map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-5 card-lift">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${s.tag} text-white text-xs font-bold mb-2`}>
                {s.unit}
              </div>
              <div className="text-3xl font-bold text-foreground">
                ₹<AnimatedNumber value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CITIES.map(city => {
            const price = currentPrices[city.key];
            const prevPrice = prevRecord[city.key];
            return (
              <div key={city.key} className="bg-card border border-border rounded-2xl p-4 card-lift">
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={12} style={{ color: city.color }} />
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{city.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">₹{price.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-0.5 mb-2">
                  {selectedFuel === "lpg" ? "per 14.2 kg cylinder" : "per litre"}
                </div>
                <ChangeTag current={price} previous={prevPrice} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3">Explore All Sections</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_NAV.map(item => (
            <Link key={item.href} href={item.href}>
              <div className="bg-card border border-border rounded-2xl p-4 card-lift cursor-pointer group h-full">
                <div className={`${item.bg} ${item.ic} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon size={19} />
                </div>
                <div className="font-semibold text-foreground text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-snug">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Model Summary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
          <FlaskConical size={15} className="text-primary" /> Regression Model Summary
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="font-semibold text-foreground mb-1">Linear Model</div>
            <div className="font-mono text-xs text-primary">ŷ = β₀ + β₁t + ε</div>
            <div className="text-xs text-muted-foreground mt-1">Ordinary Least Squares on monthly time index</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="font-semibold text-foreground mb-1">Polynomial Extension</div>
            <div className="font-mono text-xs text-primary">ŷ = β₀ + β₁t + β₂t²</div>
            <div className="text-xs text-muted-foreground mt-1">Degree-2 via Normal Equation β̂ = (XᵀX)⁻¹Xᵀy</div>
          </div>
          <div className="bg-muted/50 rounded-xl p-3">
            <div className="font-semibold text-foreground mb-1">Seasonal Adjustment</div>
            <div className="font-mono text-xs text-primary">× (1 + A·sin(2πm/12 − π/6))</div>
            <div className="text-xs text-muted-foreground mt-1">Sinusoidal correction, amplitude A = 2%</div>
          </div>
        </div>
      </div>

      {/* Data sources */}
      <div className="bg-muted/50 border border-border rounded-2xl p-5 text-sm text-muted-foreground">
        <div className="font-bold text-foreground mb-1">Data Sources</div>
        <p>
          Petrol & Diesel: PPAC Daily Price Monitor MSHS (Ministry of Petroleum & Natural Gas), 2014–April 2026. ·
          LPG: IndaneGas / IOCL Non-Subsidised 14.2 kg Cylinder prices, 2013–April 2026. ·
          Forecast methodology: Ordinary Least Squares linear and polynomial regression with sinusoidal seasonal adjustment. ·
          Last updated: April 2026.
        </p>
      </div>
    </div>
  );
}
