import { useState } from "react";
import { MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { FUEL_TYPES, CITIES, getHistoryForFuel, getCurrentPrice, getYearlyAverage, type FuelType, type City } from "@/data/fuelData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf", mumbai: "#fb923c", chennai: "#38bdf8", kolkata: "#a78bfa",
};
const CITY_GRADIENTS: Record<City, string> = {
  delhi: "from-teal-400/25 to-teal-600/10",
  mumbai: "from-orange-400/25 to-orange-600/10",
  chennai: "from-sky-400/25 to-sky-600/10",
  kolkata: "from-violet-400/25 to-violet-600/10",
};

function Trend({ v1, v2 }: { v1: number; v2: number }) {
  const pct = ((v2 - v1) / v1) * 100;
  if (Math.abs(pct) < 0.5)
    return <span className="flex items-center gap-0.5 text-muted-foreground text-xs"><Minus size={10} /> Stable</span>;
  if (pct > 0)
    return <span className="flex items-center gap-0.5 text-red-500 text-xs font-semibold"><TrendingUp size={10} /> +{pct.toFixed(1)}%</span>;
  return <span className="flex items-center gap-0.5 text-emerald-500 text-xs font-semibold"><TrendingDown size={10} /> {pct.toFixed(1)}%</span>;
}

export default function CityFuel() {
  const [selectedCity, setSelectedCity] = useState<City>("delhi");
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [view, setView] = useState<"city" | "comparison" | "radar">("city");

  const currentCity = CITIES.find(c => c.key === selectedCity)!;
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  // Current prices per fuel for selected city
  const petrolPrice = getCurrentPrice("petrol")[selectedCity];
  const dieselPrice = getCurrentPrice("diesel")[selectedCity];
  const lpgPrice = getCurrentPrice("lpg")[selectedCity];

  // Historical for selected fuel+city
  const history = getHistoryForFuel(selectedFuel);
  const cityHistory = history.slice(-24).map(h => ({
    label: `${h.month} ${h.year}`,
    price: h[selectedCity],
  }));

  // Yearly trend for city
  const availableYears = [...new Set(history.map(h => h.year))].sort();
  const yearlyForCity = availableYears.map(year => ({
    year: String(year),
    price: getYearlyAverage(history, year)[selectedCity],
  }));

  // Metro comparison (current prices, all fuels)
  const comparisonData = FUEL_TYPES.map(f => {
    const prices = getCurrentPrice(f.key);
    return {
      fuel: f.label,
      ...CITIES.reduce((acc, c) => ({ ...acc, [c.key]: prices[c.key] }), {} as Record<City, number>)
    };
  });

  // Radar: multi-fuel snapshot per city (normalised 0-100 relative to max)
  const radarData = FUEL_TYPES.map(f => {
    const prices = getCurrentPrice(f.key);
    const values = CITIES.map(c => prices[c.key]);
    const maxV = Math.max(...values);
    return {
      fuel: f.label,
      ...CITIES.reduce((acc, c) => ({ ...acc, [c.key]: Math.round((prices[c.key] / maxV) * 100) }), {} as Record<City, number>)
    };
  });

  return (
    <div className="space-y-6 page-city">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">City Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">Per-city fuel profile, multi-city comparison, and normalised radar view</p>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2">
        {[
          { k: "city", label: "City Profile" },
          { k: "comparison", label: "City Comparison" },
          { k: "radar", label: "Radar View" },
        ].map(t => (
          <button key={t.k} onClick={() => setView(t.k as typeof view)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all border ${
              view === t.k ? "bg-primary text-white border-primary shadow-sm" : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* City + Fuel selectors */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-5">
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Select City</div>
          <div className="flex gap-2 flex-wrap">
            {CITIES.map(c => (
              <button key={c.key} onClick={() => setSelectedCity(c.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${
                  selectedCity === c.key ? "text-white border-transparent shadow-sm" : "bg-muted text-muted-foreground border-border hover:border-primary/50"
                }`}
                style={selectedCity === c.key ? { background: CITY_COLORS[c.key], borderColor: CITY_COLORS[c.key] } : {}}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Fuel Type</div>
          <div className="flex gap-2 flex-wrap">
            {FUEL_TYPES.map(f => (
              <button key={f.key} onClick={() => setSelectedFuel(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFuel === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CITY PROFILE */}
      {view === "city" && (
        <div className="space-y-5">
          {/* City hero card */}
          <div className={`rounded-2xl p-6 bg-gradient-to-br ${CITY_GRADIENTS[selectedCity]} border border-border`}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} style={{ color: CITY_COLORS[selectedCity] }} />
              <h2 className="font-bold text-foreground text-lg">{currentCity.label} — Fuel Snapshot</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { fuel: "Petrol", price: petrolPrice, unit: "/L", icon: "⛽" },
                { fuel: "Diesel", price: dieselPrice, unit: "/L", icon: "🚛" },
                { fuel: "LPG", price: lpgPrice, unit: "/Cyl", icon: "🔥" },
              ].map(f => (
                <div key={f.fuel} className="bg-card/70 border border-border rounded-xl p-4 text-center backdrop-blur-sm">
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xl font-bold text-foreground">₹{f.price.toFixed(0)}</div>
                  <div className="text-xs text-muted-foreground">{f.fuel} {f.unit}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 24-month price history chart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-1 text-sm">24-Month {fuelInfo.label} Price History — {currentCity.label}</h3>
            <p className="text-xs text-muted-foreground mb-4">Unit: {fuelInfo.unit}</p>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={cityHistory}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={62} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(2)}`, fuelInfo.label]} />
                <Line type="monotone" dataKey="price" stroke={CITY_COLORS[selectedCity]} strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "white" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly average trend */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground mb-1 text-sm">Annual Average {fuelInfo.label} Price — {currentCity.label}</h3>
            <p className="text-xs text-muted-foreground mb-4">{fuelInfo.unit}</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={yearlyForCity}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={62} />
                <Tooltip formatter={(v: number) => [`₹${v.toFixed(2)}`, fuelInfo.label]} />
                <Bar dataKey="price" fill={CITY_COLORS[selectedCity]} radius={[4,4,0,0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Year-over-year change table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 text-sm font-bold text-foreground">
              Year-over-Year Price Change — {currentCity.label} {fuelInfo.label}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 font-bold text-muted-foreground text-xs uppercase">Year</th>
                    <th className="text-right px-4 py-2.5 font-bold text-muted-foreground text-xs uppercase">Avg Price</th>
                    <th className="text-right px-4 py-2.5 font-bold text-muted-foreground text-xs uppercase">YoY Change</th>
                  </tr>
                </thead>
                <tbody>
                  {yearlyForCity.slice(1).map((row, i) => {
                    const prev = yearlyForCity[i];
                    const pct = ((row.price - prev.price) / prev.price) * 100;
                    return (
                      <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                        <td className="px-4 py-2.5 font-bold text-foreground">{row.year}</td>
                        <td className="text-right px-4 py-2.5 text-foreground font-mono">₹{row.price.toFixed(2)}</td>
                        <td className="text-right px-4 py-2.5">
                          <Trend v1={prev.price} v2={row.price} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CITY COMPARISON */}
      {view === "comparison" && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold text-foreground mb-1">Metro City Price Comparison</h2>
            <p className="text-xs text-muted-foreground mb-4">Current April 2026 prices across all fuel types · Unit varies</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={comparisonData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="fuel" tick={{ fontSize: 12, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={68} />
                <Tooltip formatter={(v: number, name: string) => [`₹${v.toFixed(2)}`, CITIES.find(c => c.key === name)?.label || name]} />
                <Legend formatter={name => CITIES.find(c => c.key === name)?.label || name} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                {CITIES.map(c => (
                  <Bar key={c.key} dataKey={c.key} fill={CITY_COLORS[c.key]} radius={[4,4,0,0]} maxBarSize={28} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* City summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CITIES.map(city => {
              const petrol = getCurrentPrice("petrol")[city.key];
              const diesel = getCurrentPrice("diesel")[city.key];
              const lpg = getCurrentPrice("lpg")[city.key];
              return (
                <div key={city.key} className={`rounded-2xl p-4 bg-gradient-to-br ${CITY_GRADIENTS[city.key]} border border-border card-lift`}>
                  <div className="flex items-center gap-1.5 mb-3">
                    <MapPin size={12} style={{ color: CITY_COLORS[city.key] }} />
                    <span className="text-xs font-bold uppercase tracking-wide" style={{ color: CITY_COLORS[city.key] }}>{city.label}</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Petrol</span><span className="font-bold text-foreground">₹{petrol.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Diesel</span><span className="font-bold text-foreground">₹{diesel.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-mrol-foreground text-muted-foreground">LPG</span><span className="font-bold text-foreground">₹{lpg.toFixed(0)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RADAR VIEW */}
      {view === "radar" && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-foreground mb-1">Normalised Multi-Fuel Radar</h2>
          <p className="text-xs text-muted-foreground mb-4">City fuel prices normalised 0–100 relative to highest metro price per fuel type. 100 = most expensive city.</p>
          <ResponsiveContainer width="100%" height={420}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="fuel" tick={{ fontSize: 12, fill: "hsl(200 15% 50%)" }} />
              {CITIES.map(c => (
                <Radar key={c.key} name={c.label} dataKey={c.key} stroke={CITY_COLORS[c.key]} fill={CITY_COLORS[c.key]} fillOpacity={0.12} strokeWidth={2} />
              ))}
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
              <Tooltip formatter={(v: number, name: string) => [`${v}/100`, name]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
