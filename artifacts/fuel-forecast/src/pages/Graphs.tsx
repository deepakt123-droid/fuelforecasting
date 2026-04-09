import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { BarChart2, Filter, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { FUEL_TYPES, CITIES, getHistoryForFuel, getYearlyAverage, type FuelType, type City } from "@/data/fuelData";
import { computeCorrelation, computeTimeCorrelation } from "@/data/mathData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf",
  mumbai: "#fb923c",
  chennai: "#38bdf8",
  kolkata: "#a78bfa",
};

function ChartTooltip({ active, payload, label, unit }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string; unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-foreground mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground">{CITIES.find(c => c.key === p.name)?.label || p.name}</span>
          </span>
          <span className="font-bold text-foreground">₹{Number(p.value).toFixed(2)} <span className="font-normal text-xs text-muted-foreground">{unit}</span></span>
        </div>
      ))}
    </div>
  );
}

function corrColor(r: number): string {
  const abs = Math.abs(r);
  if (abs >= 0.98) return "bg-teal-600 text-white";
  if (abs >= 0.92) return "bg-teal-400 text-white";
  if (abs >= 0.80) return "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100";
  if (abs >= 0.60) return "bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200";
  return "bg-muted text-muted-foreground";
}

export default function Graphs() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [selectedCities, setSelectedCities] = useState<City[]>(["delhi", "mumbai", "chennai", "kolkata"]);
  const [yearRange, setYearRange] = useState<[number, number]>([2018, 2026]);
  const [view, setView] = useState<"trend" | "yoy" | "corr">("trend");

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  const availableYears = [...new Set(history.map(h => h.year))].sort();
  const minYear = availableYears[0];
  const maxYear = availableYears[availableYears.length - 1];

  const filteredData = useMemo(() =>
    history
      .filter(d => d.year >= yearRange[0] && d.year <= yearRange[1])
      .map(d => ({
        label: `${d.month} ${d.year}`,
        ...selectedCities.reduce((acc, c) => ({ ...acc, [c]: d[c] }), {} as Record<City, number>)
      })),
    [history, selectedCities, yearRange]
  );

  // YoY comparison: yearly averages
  const yoyData = useMemo(() => {
    return availableYears.map(year => {
      const avg = getYearlyAverage(history, year);
      return {
        year: String(year),
        ...selectedCities.reduce((acc, c) => ({ ...acc, [c]: avg[c] }), {} as Record<string, number>)
      };
    });
  }, [history, selectedCities, availableYears]);

  // YoY % change
  const yoyChange = useMemo(() => {
    return availableYears.slice(1).map(year => {
      const prev = getYearlyAverage(history, year - 1);
      const curr = getYearlyAverage(history, year);
      return {
        year: String(year),
        ...selectedCities.reduce((acc, c) => ({
          ...acc,
          [c]: Math.round(((curr[c] - prev[c]) / prev[c]) * 1000) / 10
        }), {} as Record<string, number>)
      };
    });
  }, [history, selectedCities, availableYears]);

  // Correlation
  const corrResults = useMemo(() => computeCorrelation(selectedFuel), [selectedFuel]);
  const timeCorr = useMemo(() => computeTimeCorrelation(selectedFuel), [selectedFuel]);

  const getCorr = (c1: City, c2: City) => {
    const r = corrResults.find(r => (r.city1 === c1 && r.city2 === c2) || (r.city1 === c2 && r.city2 === c1));
    return r ? r.r : 1;
  };

  const toggleCity = (city: City) => {
    setSelectedCities(prev =>
      prev.includes(city) ? (prev.length > 1 ? prev.filter(c => c !== city) : prev) : [...prev, city]
    );
  };

  return (
    <div className="space-y-6 page-graphs">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Price Charts</h1>
          </div>
          <p className="text-muted-foreground text-sm">Historical fuel price trends, year-over-year comparison & correlation analysis</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground">
          <Filter size={12} /> {filteredData.length} data points
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { k: "trend", label: "Trend Lines" },
          { k: "yoy", label: "Year-over-Year" },
          { k: "corr", label: "Correlation Analysis" },
        ].map(t => (
          <button
            key={t.k}
            onClick={() => setView(t.k as typeof view)}
            className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all border ${
              view === t.k
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-5">
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
          <div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Cities</div>
            <div className="flex gap-2 flex-wrap">
              {CITIES.map(c => (
                <button key={c.key} onClick={() => toggleCity(c.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedCities.includes(c.key) ? "text-white border-transparent" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                  }`}
                  style={selectedCities.includes(c.key) ? { background: CITY_COLORS[c.key], borderColor: CITY_COLORS[c.key] } : {}}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          {view === "trend" && (
            <div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
                Year Range: {yearRange[0]}–{yearRange[1]}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { l: "All", r: [minYear, maxYear] as [number,number] },
                  { l: "2018–2026", r: [2018, 2026] as [number,number] },
                  { l: "2020–2026", r: [2020, 2026] as [number,number] },
                  { l: "2022–2026", r: [2022, 2026] as [number,number] },
                ].map(opt => (
                  <button key={opt.l} onClick={() => setYearRange(opt.r)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      yearRange[0] === opt.r[0] && yearRange[1] === opt.r[1]
                        ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TREND VIEW */}
      {view === "trend" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4">
            <h2 className="font-bold text-foreground">{fuelInfo.label} Price Trends — {yearRange[0]} to {yearRange[1]}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Unit: {fuelInfo.unit}</p>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} interval={Math.floor(filteredData.length / 8)} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={62} />
              <Tooltip content={<ChartTooltip unit={fuelInfo.unit.split("/")[0]} />} />
              <Legend formatter={name => CITIES.find(c => c.key === name)?.label || name} wrapperStyle={{ fontSize: "12px", paddingTop: "14px" }} />
              {selectedCities.map(city => (
                <Line key={city} type="monotone" dataKey={city} stroke={CITY_COLORS[city]} strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "white" }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* YoY VIEW */}
      {view === "yoy" && (
        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="mb-4">
              <h2 className="font-bold text-foreground">Yearly Average {fuelInfo.label} Price</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Annual mean across all months · Unit: {fuelInfo.unit}</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={yoyData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={62} />
                <Tooltip content={<ChartTooltip unit={fuelInfo.unit.split("/")[0]} />} />
                <Legend formatter={name => CITIES.find(c => c.key === name)?.label || name} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                {selectedCities.map(city => (
                  <Bar key={city} dataKey={city} fill={CITY_COLORS[city]} radius={[4,4,0,0]} maxBarSize={30} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* YoY % change table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground text-sm">Year-over-Year % Change</h3>
              <p className="text-xs text-muted-foreground">Positive = price rise · Negative = price fall</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2.5 font-bold text-muted-foreground text-xs uppercase">Year</th>
                    {CITIES.filter(c => selectedCities.includes(c.key)).map(c => (
                      <th key={c.key} className="text-right px-4 py-2.5 font-bold text-xs uppercase" style={{ color: CITY_COLORS[c.key] }}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yoyChange.map((row, i) => (
                    <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                      <td className="px-4 py-2.5 font-bold text-foreground">{row.year}</td>
                      {CITIES.filter(c => selectedCities.includes(c.key)).map(c => {
                        const v = row[c.key] as number;
                        return (
                          <td key={c.key} className="text-right px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                              v > 5 ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" :
                              v < -5 ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {v > 0 ? <TrendingUp size={10} /> : v < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                              {v > 0 ? "+" : ""}{v.toFixed(1)}%
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CORRELATION VIEW */}
      {view === "corr" && (
        <div className="space-y-5">
          {/* City-city correlation matrix */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold text-foreground mb-1">Inter-City Price Correlation Matrix</h2>
            <p className="text-xs text-muted-foreground mb-4">Pearson r — how closely city prices move together (1.0 = perfect correlation)</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold text-muted-foreground uppercase">City</th>
                    {CITIES.map(c => (
                      <th key={c.key} className="px-3 py-2 text-center text-xs font-bold uppercase" style={{ color: CITY_COLORS[c.key] }}>{c.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CITIES.map(c1 => (
                    <tr key={c1.key}>
                      <td className="px-3 py-2 font-bold text-xs uppercase" style={{ color: CITY_COLORS[c1.key] }}>{c1.label}</td>
                      {CITIES.map(c2 => {
                        const r = getCorr(c1.key, c2.key);
                        return (
                          <td key={c2.key} className="px-3 py-2 text-center">
                            <span className={`corr-cell inline-block px-3 py-1.5 rounded-lg text-xs font-bold tabular-nums ${corrColor(r)}`}>
                              {r.toFixed(4)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Time correlation */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <h2 className="font-bold text-foreground mb-1">Time–Price Correlation</h2>
            <p className="text-xs text-muted-foreground mb-4">Pearson r between month index (time) and fuel price — measures overall upward trend strength</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CITIES.map(c => {
                const r = timeCorr[c.key];
                const pct = Math.abs(r) * 100;
                return (
                  <div key={c.key} className="bg-muted/50 rounded-xl p-4 text-center">
                    <div className="text-xs font-bold uppercase mb-2" style={{ color: CITY_COLORS[c.key] }}>{c.label}</div>
                    <div className="text-2xl font-bold text-foreground tabular-nums">{r.toFixed(4)}</div>
                    <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{pct.toFixed(1)}% correlation</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interpretation */}
          <div className="bg-muted/40 border border-border rounded-2xl p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Interpretation:</strong> All four metro cities show very high inter-city correlations (r &gt; 0.90) because fuel prices are driven by the same national factors: global crude oil prices, central excise duty, and government pricing policy. City-wise differences reflect local state VAT/sales tax variations and distribution costs.
          </div>
        </div>
      )}
    </div>
  );
}
