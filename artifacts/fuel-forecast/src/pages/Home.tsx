import { useState, useEffect } from "react";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, Minus, BarChart2, Table, Calculator, MapPin, Fuel } from "lucide-react";
import { FUEL_TYPES, CITIES, getCurrentPrice, petrolHistory, dieselHistory, lpgHistory, type City, type FuelType } from "@/data/fuelData";

function AnimatedNumber({ value, prefix = "" }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = 0;
    const end = value;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * (end - start) + start));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{prefix}{display.toFixed(2)}</span>;
}

function PriceChangeIndicator({ current, previous }: { current: number; previous: number }) {
  const change = ((current - previous) / previous) * 100;
  if (Math.abs(change) < 0.01) return <span className="flex items-center gap-1 text-muted-foreground text-xs"><Minus size={12} /> Stable</span>;
  if (change > 0) return <span className="flex items-center gap-1 text-red-500 text-xs"><TrendingUp size={12} /> +{change.toFixed(1)}%</span>;
  return <span className="flex items-center gap-1 text-emerald-500 text-xs"><TrendingDown size={12} /> {change.toFixed(1)}%</span>;
}

export default function Home() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");

  const currentPrices = getCurrentPrice(selectedFuel);
  const historyMap = { petrol: petrolHistory, diesel: dieselHistory, lpg: lpgHistory };
  const history = historyMap[selectedFuel];
  const prevRecord = history[history.length - 2];

  const maxPrice = Math.max(...CITIES.map(c => currentPrices[c.key]));
  const minPrice = Math.min(...CITIES.map(c => currentPrices[c.key]));
  const avgPrice = CITIES.reduce((s, c) => s + currentPrices[c.key], 0) / CITIES.length;

  const stats = [
    { label: "Avg Metro Price", value: avgPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", color: "from-teal-400 to-emerald-500", icon: "📊" },
    { label: "Lowest Price", value: minPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", color: "from-emerald-400 to-teal-500", icon: "⬇️" },
    { label: "Highest Price", value: maxPrice, unit: selectedFuel === "lpg" ? "₹/Cyl" : "₹/L", color: "from-orange-400 to-amber-500", icon: "⬆️" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl mint-glow" style={{
        background: "linear-gradient(135deg, hsl(168 70% 35%) 0%, hsl(185 75% 42%) 50%, hsl(168 60% 40%) 100%)"
      }}>
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="relative z-10 p-8 md:p-12 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Fuel size={20} className="opacity-80" />
            <span className="text-sm font-medium opacity-80 tracking-wider uppercase">India Fuel Analytics</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Fuel Price Trend<br />
            <span className="opacity-80">Forecasting System</span>
          </h1>
          <p className="text-white/70 max-w-2xl text-base md:text-lg mb-8 leading-relaxed">
            Analyze historical fuel price data for Delhi, Mumbai, Chennai & Kolkata. 
            Powered by real PPAC & IndaneGas data with AI-driven 10-year month-wise predictions.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/graphs">
              <button className="px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5" data-testid="link-graphs">
                View Price Charts
              </button>
            </Link>
            <Link href="/forecast">
              <button className="px-5 py-2.5 bg-white/15 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/25 transition-all backdrop-blur-sm" data-testid="link-forecast">
                10-Year Forecast
              </button>
            </Link>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full" />
        <div className="absolute -right-8 -bottom-20 w-48 h-48 bg-white/5 rounded-full" />
      </div>

      {/* Fuel Selector */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Current Prices</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
          {FUEL_TYPES.map(f => (
            <button
              key={f.key}
              onClick={() => setSelectedFuel(f.key)}
              data-testid={`fuel-tab-${f.key}`}
              className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                selectedFuel === f.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-muted-foreground hover:bg-muted border border-border"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {stats.map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-5 card-lift">
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r ${s.color} text-white text-xs font-semibold mb-2`}>
                <span>{s.icon}</span> {s.unit}
              </div>
              <div className="text-3xl font-bold text-foreground" data-testid={`stat-${s.label.toLowerCase().replace(/ /g, "-")}`}>
                ₹<AnimatedNumber value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* City price cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CITIES.map(city => {
            const price = currentPrices[city.key];
            const prevPrice = prevRecord[city.key];
            return (
              <div key={city.key} className="bg-card border border-border rounded-2xl p-4 card-lift" data-testid={`city-card-${city.key}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin size={13} style={{ color: city.color }} />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{city.label}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{price.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 mb-1">
                  {selectedFuel === "lpg" ? "per 14.2kg cylinder" : "per litre"}
                </div>
                <PriceChangeIndicator current={price} previous={prevPrice} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Navigation */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Explore Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/graphs", icon: BarChart2, label: "Price Charts", desc: "Interactive historical graphs", color: "text-teal-600 dark:text-teal-400", bg: "bg-teal-50 dark:bg-teal-950/30" },
            { href: "/table", icon: Table, label: "Data Tables", desc: "Full price history tables", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" },
            { href: "/forecast", icon: TrendingUp, label: "10-Year Forecast", desc: "Month-wise predictions", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
            { href: "/calculator", icon: Calculator, label: "Calculator", desc: "Fuel expense estimator", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30" },
          ].map(item => (
            <Link key={item.href} href={item.href}>
              <div className="bg-card border border-border rounded-2xl p-5 card-lift cursor-pointer group" data-testid={`nav-card-${item.label.toLowerCase().replace(/ /g, "-")}`}>
                <div className={`${item.bg} ${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon size={20} />
                </div>
                <div className="font-semibold text-foreground text-sm">{item.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Data source info */}
      <div className="bg-muted/50 border border-border rounded-2xl p-5 text-sm text-muted-foreground">
        <div className="font-semibold text-foreground mb-1">Data Sources</div>
        <p>Petrol & Diesel: PPAC Daily Price MSHS data (2014–April 2026) · LPG: IndaneGas Historical Prices for Non-Subsidised 14.2 kg cylinders (2013–March 2026) · Forecast: Linear regression with seasonal adjustments · Last updated: April 8, 2026</p>
      </div>
    </div>
  );
}
