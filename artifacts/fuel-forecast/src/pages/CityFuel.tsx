import { useState } from "react";
import { MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FUEL_TYPES, CITIES, getHistoryForFuel, getCurrentPrice, getYearlyAverage, type FuelType, type City } from "@/data/fuelData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf",
  mumbai: "#fb923c",
  chennai: "#38bdf8",
  kolkata: "#a78bfa",
};

const CITY_BG: Record<City, string> = {
  delhi: "from-teal-400/20 to-teal-600/10",
  mumbai: "from-orange-400/20 to-orange-600/10",
  chennai: "from-sky-400/20 to-sky-600/10",
  kolkata: "from-violet-400/20 to-violet-600/10",
};

function TrendBadge({ v1, v2 }: { v1: number; v2: number }) {
  const pct = ((v2 - v1) / v1) * 100;
  if (Math.abs(pct) < 0.5) return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus size={10} /> Stable</span>;
  if (pct > 0) return <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold"><TrendingUp size={10} /> +{pct.toFixed(1)}%</span>;
  return <span className="flex items-center gap-0.5 text-emerald-500 text-xs font-semibold"><TrendingDown size={10} /> {pct.toFixed(1)}%</span>;
}

export default function CityFuel() {
  const [selectedCity, setSelectedCity] = useState<City>("delhi");
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");

  const cityInfo = CITIES.find(c => c.key === selectedCity)!;
  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;
  const currentPrice = getCurrentPrice(selectedFuel)[selectedCity];

  // YoY comparison
  const recentYears = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const yearlyData = recentYears.map(year => ({
    year: String(year),
    ...CITIES.reduce((acc, c) => ({
      ...acc,
      [c.key]: getYearlyAverage(history, year)[c.key] || 0
    }), {} as Record<City, number>)
  })).filter(d => d[selectedCity] > 0);

  // All cities at a glance for current fuel
  const allCityCurrentPrices = getCurrentPrice(selectedFuel);
  const maxCity = CITIES.reduce((a, b) => allCityCurrentPrices[a.key] > allCityCurrentPrices[b.key] ? a : b);
  const minCity = CITIES.reduce((a, b) => allCityCurrentPrices[a.key] < allCityCurrentPrices[b.key] ? a : b);

  // Price change stats
  const prev2025Avg = getYearlyAverage(history, 2025)[selectedCity];
  const prev2024Avg = getYearlyAverage(history, 2024)[selectedCity];
  const prev2020Avg = getYearlyAverage(history, 2020)[selectedCity];

  // Monthly recent trend
  const recent12 = history.slice(-12).map(h => ({
    label: `${h.month.substring(0, 3)} '${String(h.year).slice(-2)}`,
    price: h[selectedCity],
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Space Grotesk, sans-serif" }}>City & Fuel Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">Detailed metrics per city and fuel type</p>
      </div>

      {/* City selector cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CITIES.map(c => {
          const price = allCityCurrentPrices[c.key];
          const isSelected = selectedCity === c.key;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedCity(c.key)}
              data-testid={`city-select-${c.key}`}
              className={`text-left rounded-2xl p-4 transition-all border-2 card-lift ${
                isSelected ? "border-primary shadow-md" : "border-transparent bg-card hover:border-border"
              }`}
              style={isSelected ? { borderColor: CITY_COLORS[c.key] } : {}}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${CITY_BG[c.key]} flex items-center justify-center mb-2`}>
                <MapPin size={14} style={{ color: CITY_COLORS[c.key] }} />
              </div>
              <div className="font-bold text-foreground">{c.label}</div>
              <div className="text-lg font-bold mt-0.5" style={{ color: CITY_COLORS[c.key] }}>₹{price.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">{fuelInfo.unit}</div>
            </button>
          );
        })}
      </div>

      {/* Fuel selector */}
      <div className="flex gap-2 flex-wrap">
        {FUEL_TYPES.map(f => (
          <button
            key={f.key}
            onClick={() => setSelectedFuel(f.key)}
            data-testid={`city-fuel-${f.key}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedFuel === f.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* City Detail */}
      <div className={`rounded-2xl p-6 bg-gradient-to-br ${CITY_BG[selectedCity]} border border-border`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin size={16} style={{ color: CITY_COLORS[selectedCity] }} />
              <h2 className="font-bold text-foreground text-xl">{cityInfo.label}</h2>
            </div>
            <div className="text-4xl font-bold text-foreground mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }} data-testid="city-current-price">
              ₹{currentPrice.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">{fuelInfo.label} · {fuelInfo.unit} · April 2026</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "vs 2025 avg", v1: prev2025Avg, v2: currentPrice },
              { label: "vs 2024 avg", v1: prev2024Avg, v2: currentPrice },
              { label: "vs 2020 avg", v1: prev2020Avg, v2: currentPrice },
            ].map(stat => (
              <div key={stat.label} className="bg-card/70 rounded-xl px-3 py-2 text-center">
                <div className="text-xs text-muted-foreground mb-0.5">{stat.label}</div>
                <TrendBadge v1={stat.v1} v2={stat.v2} />
              </div>
            ))}
            <div className="bg-card/70 rounded-xl px-3 py-2 text-center">
              <div className="text-xs text-muted-foreground mb-0.5">Rank in metros</div>
              <div className="text-sm font-bold text-foreground">
                {CITIES.sort((a, b) => allCityCurrentPrices[a.key] - allCityCurrentPrices[b.key]).findIndex(c => c.key === selectedCity) + 1} / 4
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent 12-month trend */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 text-sm">12-Month Price Trend — {cityInfo.label}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={recent12} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(168 25% 85% / 0.4)" strokeWidth={0.8} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={50} />
              <Tooltip
                formatter={(v: number) => [`₹${v.toFixed(2)}`, cityInfo.label]}
                contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
              />
              <Bar dataKey="price" fill={CITY_COLORS[selectedCity]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Year-over-year comparison */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4 text-sm">Year-over-Year — All Cities ({fuelInfo.label})</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={yearlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(168 25% 85% / 0.4)" strokeWidth={0.8} />
              <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={50} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              {CITIES.map(c => (
                <Bar key={c.key} dataKey={c.key} name={c.label} fill={CITY_COLORS[c.key]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* All cities comparison */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4 text-sm">Metro Cities Price Comparison — {fuelInfo.label} (April 2026)</h3>
        <div className="space-y-3">
          {CITIES.sort((a, b) => allCityCurrentPrices[a.key] - allCityCurrentPrices[b.key]).map(c => {
            const price = allCityCurrentPrices[c.key];
            const pct = (price / maxCity.key ? allCityCurrentPrices[maxCity.key] : price) * 100;
            const barWidth = (price / allCityCurrentPrices[maxCity.key]) * 100;
            return (
              <div key={c.key} data-testid={`compare-bar-${c.key}`}>
                <div className="flex items-center justify-between mb-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={12} style={{ color: CITY_COLORS[c.key] }} />
                    <span className="font-medium text-foreground">{c.label}</span>
                    {c.key === minCity.key && <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">Cheapest</span>}
                    {c.key === maxCity.key && <span className="text-xs bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 px-1.5 py-0.5 rounded-full font-semibold">Highest</span>}
                  </div>
                  <span className="font-bold text-foreground">₹{price.toFixed(2)}</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barWidth}%`, background: CITY_COLORS[c.key] }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
