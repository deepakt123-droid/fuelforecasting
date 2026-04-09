import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import { TrendingUp, Info, Calendar, Download } from "lucide-react";
import { FUEL_TYPES, CITIES, getHistoryForFuel, generateForecast, type FuelType, type City } from "@/data/fuelData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf", mumbai: "#fb923c", chennai: "#38bdf8", kolkata: "#a78bfa",
};

function ChartTooltip({ active, payload, label, unit }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string; dataKey: string }>; label?: string; unit?: string;
}) {
  if (!active || !payload?.length) return null;
  const isProjected = payload[0]?.dataKey?.startsWith("p_");
  return (
    <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 text-sm">
      <div className="font-semibold text-foreground mb-1">{label}</div>
      {isProjected && (
        <div className="text-xs text-amber-500 mb-2 flex items-center gap-1 font-medium">
          ◎ Projected (OLS Regression)
        </div>
      )}
      {payload.map(p => {
        const cityKey = p.dataKey.startsWith("p_") ? p.dataKey.slice(2) : p.dataKey;
        const city = CITIES.find(c => c.key === cityKey);
        return (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
              <span className="text-muted-foreground">{city?.label || cityKey}</span>
            </span>
            <span className="font-bold text-foreground">₹{p.value?.toFixed(2)} <span className="font-normal text-muted-foreground text-xs">{unit}</span></span>
          </div>
        );
      })}
    </div>
  );
}

export default function Forecast() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [selectedCities, setSelectedCities] = useState<City[]>(["delhi", "mumbai"]);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;
  const recentHistory = useMemo(() => history.slice(-12), [history]);
  const forecast = useMemo(() => generateForecast(history, 10), [history, selectedFuel]);

  const chartData = useMemo(() => {
    const histPoints = recentHistory.map(h => ({
      label: `${h.month} ${h.year}`,
      ...selectedCities.reduce((acc, c) => ({ ...acc, [c]: h[c] }), {} as Record<string, number>)
    }));
    const forecastPoints = forecast.map(f => ({
      label: f.label,
      ...selectedCities.reduce((acc, c) => ({ ...acc, [`p_${c}`]: f[c] }), {} as Record<string, number>)
    }));
    return [...histPoints, ...forecastPoints];
  }, [recentHistory, forecast, selectedCities]);

  const forecastByYear = useMemo(() => {
    const grouped: Record<number, typeof forecast> = {};
    forecast.forEach(f => {
      if (!grouped[f.year]) grouped[f.year] = [];
      grouped[f.year].push(f);
    });
    return grouped;
  }, [forecast]);

  const forecastYears = Object.keys(forecastByYear).map(Number).sort();

  const toggleCity = (city: City) => {
    setSelectedCities(prev =>
      prev.includes(city) ? (prev.length > 1 ? prev.filter(c => c !== city) : prev) : [...prev, city]
    );
  };

  const lastHistoricalLabel = `${recentHistory[recentHistory.length - 1]?.month} ${recentHistory[recentHistory.length - 1]?.year}`;

  const exportCSV = () => {
    const header = ["Month", "Year", ...CITIES.map(c => c.label)].join(",");
    const rows = forecast.map(f => [f.month, f.year, ...CITIES.map(c => f[c.key].toFixed(2))].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `fuel_forecast_${selectedFuel}.csv`; a.click();
  };

  return (
    <div className="space-y-6 page-forecast">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">10-Year Price Projection</h1>
          </div>
          <p className="text-muted-foreground text-sm">Month-wise OLS Regression Forecast — May 2026 to April 2036</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode("chart")} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${viewMode === "chart" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}`}>
            Chart View
          </button>
          <button onClick={() => setViewMode("table")} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border ${viewMode === "table" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}`}>
            Table View
          </button>
          <button onClick={exportCSV} className="px-3 py-1.5 rounded-lg text-sm font-semibold border border-border bg-card text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5">
            <Download size={13} /> CSV
          </button>
        </div>
      </div>

      {/* Methodology Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex gap-3">
        <Info size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <strong>Projection Methodology:</strong> Month-wise projections use Ordinary Least Squares (OLS) linear regression with a degree-2 polynomial extension and 2% sinusoidal seasonal adjustment. Model fitted on 2013–2026 historical data. Projections assume continuation of observed price trends; actual prices depend on global crude oil markets, government excise policy, state VAT rates, and geopolitical conditions.
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-5">
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedCities.includes(c.key) ? "text-white border-transparent" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"}`}
                style={selectedCities.includes(c.key) ? { background: CITY_COLORS[c.key] } : {}}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHART VIEW */}
      {viewMode === "chart" && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-bold text-foreground">{fuelInfo.label} — Historical + 10-Year Projection</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Solid = actual data · Dashed = OLS regression projection · Unit: {fuelInfo.unit}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-primary inline-block" /> Actual</span>
              <span className="flex items-center gap-1.5"><span className="w-5 border-t-2 border-dashed border-orange-400 inline-block" /> Projected</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} interval={14} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `₹${v}`} width={65} />
              <Tooltip content={<ChartTooltip unit={fuelInfo.unit.split("/")[0]} />} />
              <Legend
                formatter={name => {
                  const key = name.startsWith("p_") ? name.slice(2) : name;
                  return `${CITIES.find(c => c.key === key)?.label}${name.startsWith("p_") ? " (Projected)" : ""}`;
                }}
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              />
              <ReferenceLine x={lastHistoricalLabel} stroke="hsl(28 95% 60%)" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: "Projection →", position: "insideTopRight", fill: "hsl(28 95% 55%)", fontSize: 10 }} />
              {selectedCities.map(city => (
                <Line key={city} type="monotone" dataKey={city} stroke={CITY_COLORS[city]} strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "white" }} connectNulls={false} />
              ))}
              {selectedCities.map(city => (
                <Line key={`p_${city}`} type="monotone" dataKey={`p_${city}`} stroke={CITY_COLORS[city]} strokeWidth={2} strokeDasharray="5 3" dot={false} activeDot={{ r: 3 }} connectNulls={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Calendar size={12} /> Filter by Year
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedYear(null)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${!selectedYear ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                All Years
              </button>
              {forecastYears.map(year => (
                <button key={year} onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedYear === year ? "bg-accent text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                  {year}
                </button>
              ))}
            </div>
          </div>

          {(selectedYear ? [selectedYear] : forecastYears).map(year => (
            <div key={year} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="font-bold text-foreground flex items-center gap-2 text-sm">
                  <TrendingUp size={13} className="text-primary" />
                  {fuelInfo.label} Projection — {year}
                  <span className="prediction-badge text-xs px-2 py-0.5 rounded-full">OLS Projected</span>
                </div>
                <span className="text-xs text-muted-foreground">{fuelInfo.unit}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Month</th>
                      {CITIES.map(c => (
                        <th key={c.key} className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: CITY_COLORS[c.key] }}>{c.label}</th>
                      ))}
                      <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Metro Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(forecastByYear[year] || []).map((row, i) => {
                      const avg = CITIES.reduce((s, c) => s + row[c.key], 0) / CITIES.length;
                      return (
                        <tr key={row.label} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                          <td className="px-4 py-2.5 font-semibold text-foreground">{row.month}</td>
                          {CITIES.map(c => (
                            <td key={c.key} className="text-right px-4 py-2.5 font-bold text-foreground">₹{row[c.key].toFixed(2)}</td>
                          ))}
                          <td className="text-right px-4 py-2.5 text-muted-foreground font-medium">₹{avg.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Annual Summary */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground text-sm">Annual Projection Summary — All Cities</h3>
          <p className="text-xs text-muted-foreground">Average projected price per year · {fuelInfo.unit}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Year</th>
                {CITIES.map(c => (
                  <th key={c.key} className="text-right px-4 py-3 font-bold text-xs uppercase" style={{ color: CITY_COLORS[c.key] }}>{c.label} (Avg)</th>
                ))}
                <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Metro Avg</th>
              </tr>
            </thead>
            <tbody>
              {forecastYears.map(year => {
                const yd = forecastByYear[year];
                const avg = (c: City) => yd.reduce((s, d) => s + d[c], 0) / yd.length;
                const metroAvg = CITIES.reduce((s, c) => s + avg(c.key), 0) / CITIES.length;
                return (
                  <tr key={year} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-foreground">{year}</td>
                    {CITIES.map(c => <td key={c.key} className="text-right px-4 py-3 font-medium text-foreground">₹{avg(c.key).toFixed(2)}</td>)}
                    <td className="text-right px-4 py-3 font-bold text-primary">₹{metroAvg.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
