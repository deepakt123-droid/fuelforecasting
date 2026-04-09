import { useState, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceArea, ReferenceLine
} from "recharts";
import { TrendingUp, Info, Calendar, AlertTriangle } from "lucide-react";
import {
  FUEL_TYPES, CITIES, getHistoryForFuel, generateForecast,
  getHistoryAsForecasts, type FuelType, type City
} from "@/data/fuelData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf",
  mumbai: "#fb923c",
  chennai: "#38bdf8",
  kolkata: "#a78bfa",
};

const CustomTooltip = ({ active, payload, label, unit }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string; dataKey: string }>;
  label?: string;
  unit?: string;
}) => {
  if (active && payload && payload.length) {
    const isForecasted = payload[0]?.dataKey?.startsWith("f_");
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 text-sm">
        <div className="font-semibold text-foreground mb-1">{label}</div>
        {isForecasted && (
          <div className="text-xs text-orange-500 mb-2 flex items-center gap-1">
            <AlertTriangle size={10} /> AI Forecast
          </div>
        )}
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.color }} />
              <span className="text-muted-foreground">{p.name}</span>
            </span>
            <span className="font-semibold text-foreground">₹{p.value?.toFixed(2)} <span className="font-normal text-muted-foreground text-xs">{unit}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Forecast() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [selectedCities, setSelectedCities] = useState<City[]>(["delhi", "mumbai"]);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  // Get last 12 months of history + 10 years forecast
  const recentHistory = useMemo(() => history.slice(-12), [history]);
  const forecast = useMemo(() => generateForecast(history, 10), [history, selectedFuel]);

  // Combine: last 12 real data + 120 forecasted months
  const chartData = useMemo(() => {
    const histPoints = recentHistory.map(h => ({
      label: `${h.month} ${h.year}`,
      ...selectedCities.reduce((acc, c) => ({ ...acc, [c]: h[c] }), {} as Record<string, number>)
    }));
    const forecastPoints = forecast.map(f => ({
      label: f.label,
      ...selectedCities.reduce((acc, c) => ({ ...acc, [`f_${c}`]: f[c] }), {} as Record<string, number>)
    }));
    return [...histPoints, ...forecastPoints];
  }, [recentHistory, forecast, selectedCities]);

  // Group forecast by year for table view
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              10-Year Forecast
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Month-wise predictions from May 2026 to April 2036</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("chart")}
            data-testid="forecast-chart-view"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === "chart" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Chart View
          </button>
          <button
            onClick={() => setViewMode("table")}
            data-testid="forecast-table-view"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === "table" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex gap-3">
        <Info size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Forecast Methodology:</strong> Predictions use linear regression on historical price trends (2013–2026) with seasonal adjustments. These are statistical estimates based on past patterns. Actual prices depend on crude oil markets, government policy, taxes, and geopolitical factors.
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-5">
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fuel Type</div>
          <div className="flex gap-2">
            {FUEL_TYPES.map(f => (
              <button
                key={f.key}
                onClick={() => setSelectedFuel(f.key)}
                data-testid={`forecast-fuel-${f.key}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedFuel === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cities</div>
          <div className="flex gap-2">
            {CITIES.map(c => (
              <button
                key={c.key}
                onClick={() => toggleCity(c.key)}
                data-testid={`forecast-city-${c.key}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                  selectedCities.includes(c.key) ? "text-white border-transparent" : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                }`}
                style={selectedCities.includes(c.key) ? { background: CITY_COLORS[c.key] } : {}}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {viewMode === "chart" ? (
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-semibold text-foreground">
                {fuelInfo.label} — Historical + 10-Year Forecast
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Solid lines = actual data · Dashed lines = AI forecast · Unit: {fuelInfo.unit}</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="inline-block w-6 border-t-2 border-current text-primary" /> Historical</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-6 border-t-2 border-dashed text-orange-400" /> Forecast</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(168 25% 85% / 0.4)" strokeWidth={0.8} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "hsl(200 15% 50%)" }}
                tickLine={false}
                axisLine={false}
                interval={15}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `₹${v}`}
                width={65}
              />
              <Tooltip content={<CustomTooltip unit={fuelInfo.unit.split("/")[0]} />} />
              <Legend
                formatter={name => {
                  const key = name.startsWith("f_") ? (name.slice(2) as City) : (name as City);
                  return `${CITIES.find(c => c.key === key)?.label}${name.startsWith("f_") ? " (Forecast)" : ""}`;
                }}
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              />
              <ReferenceLine
                x={lastHistoricalLabel}
                stroke="hsl(28 95% 60%)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{ value: "Forecast →", position: "insideTopRight", fill: "hsl(28 95% 60%)", fontSize: 10 }}
              />
              {/* Historical lines */}
              {selectedCities.map(city => (
                <Line
                  key={city}
                  type="monotone"
                  dataKey={city}
                  name={city}
                  stroke={CITY_COLORS[city]}
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "white" }}
                  connectNulls={false}
                />
              ))}
              {/* Forecast lines (dashed) */}
              {selectedCities.map(city => (
                <Line
                  key={`f_${city}`}
                  type="monotone"
                  dataKey={`f_${city}`}
                  name={`f_${city}`}
                  stroke={CITY_COLORS[city]}
                  strokeWidth={2}
                  strokeDasharray="5 3"
                  dot={false}
                  activeDot={{ r: 3 }}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        /* Table View */
        <div className="space-y-4">
          {/* Year selector */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Calendar size={12} /> Select Year
            </div>
            <div className="flex flex-wrap gap-2">
              {forecastYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                  data-testid={`forecast-year-${year}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedYear === year ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Tables */}
          {(selectedYear ? [selectedYear] : forecastYears).map(year => (
            <div key={year} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <div className="font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary" />
                  {fuelInfo.label} Forecast — {year}
                  <span className="prediction-badge text-xs px-2 py-0.5 rounded-full">Predicted</span>
                </div>
                <span className="text-xs text-muted-foreground">{fuelInfo.unit}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Month</th>
                      {CITIES.filter(c => selectedCities.includes(c.key)).map(c => (
                        <th key={c.key} className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wide" style={{ color: CITY_COLORS[c.key] }}>{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(forecastByYear[year] || []).map((row, i) => (
                      <tr key={row.label} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`} data-testid={`forecast-row-${row.label}`}>
                        <td className="px-4 py-2.5 font-medium text-foreground">{row.month}</td>
                        {CITIES.filter(c => selectedCities.includes(c.key)).map(c => (
                          <td key={c.key} className="text-right px-4 py-2.5 font-semibold text-foreground">
                            ₹{row[c.key].toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 10-year summary */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Annual Forecast Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-2 font-semibold text-muted-foreground text-xs uppercase">Year</th>
                {CITIES.map(c => (
                  <th key={c.key} className="text-right pb-2 font-semibold text-xs uppercase" style={{ color: CITY_COLORS[c.key] }}>
                    {c.label} (Avg)
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {forecastYears.map(year => {
                const yearData = forecastByYear[year];
                const avg = (city: City) => yearData.reduce((s, d) => s + d[city], 0) / yearData.length;
                return (
                  <tr key={year} className="border-b border-border/50 hover:bg-muted/30 transition-colors" data-testid={`summary-row-${year}`}>
                    <td className="py-2.5 font-semibold text-foreground">{year}</td>
                    {CITIES.map(c => (
                      <td key={c.key} className="text-right py-2.5 font-medium text-foreground">
                        ₹{avg(c.key).toFixed(2)}
                      </td>
                    ))}
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
