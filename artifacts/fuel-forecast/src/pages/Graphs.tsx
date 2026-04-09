import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { FUEL_TYPES, CITIES, getHistoryForFuel, type FuelType, type City } from "@/data/fuelData";
import { BarChart2, Filter } from "lucide-react";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf",
  mumbai: "#fb923c",
  chennai: "#38bdf8",
  kolkata: "#a78bfa",
};

const CustomTooltip = ({ active, payload, label, unit }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  unit?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl shadow-lg p-3 text-sm">
        <div className="font-semibold text-foreground mb-2">{label}</div>
        {payload.map(p => (
          <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: p.color }} />
              <span className="text-muted-foreground">{p.name}</span>
            </span>
            <span className="font-semibold text-foreground">₹{p.value.toFixed(2)} <span className="font-normal text-muted-foreground text-xs">{unit}</span></span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Graphs() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [selectedCities, setSelectedCities] = useState<City[]>(["delhi", "mumbai", "chennai", "kolkata"]);
  const [yearRange, setYearRange] = useState<[number, number]>([2018, 2026]);

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  const filteredData = useMemo(() => {
    return history
      .filter(d => d.year >= yearRange[0] && d.year <= yearRange[1])
      .map(d => ({
        label: `${d.month} ${d.year}`,
        ...selectedCities.reduce((acc, c) => ({ ...acc, [c]: d[c] }), {} as Record<City, number>)
      }));
  }, [history, selectedFuel, selectedCities, yearRange]);

  const toggleCity = (city: City) => {
    setSelectedCities(prev =>
      prev.includes(city) ? (prev.length > 1 ? prev.filter(c => c !== city) : prev) : [...prev, city]
    );
  };

  const availableYears = [...new Set(history.map(h => h.year))].sort();
  const minYear = availableYears[0];
  const maxYear = availableYears[availableYears.length - 1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Price Charts</h1>
          </div>
          <p className="text-muted-foreground text-sm">Historical fuel price trends across metro cities</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-xs text-muted-foreground">
          <Filter size={12} /> {filteredData.length} data points
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap gap-4 items-start">
          {/* Fuel selector */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Fuel Type</div>
            <div className="flex gap-2">
              {FUEL_TYPES.map(f => (
                <button
                  key={f.key}
                  onClick={() => setSelectedFuel(f.key)}
                  data-testid={`chart-fuel-${f.key}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedFuel === f.key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* City selector */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Cities</div>
            <div className="flex gap-2">
              {CITIES.map(c => (
                <button
                  key={c.key}
                  onClick={() => toggleCity(c.key)}
                  data-testid={`city-toggle-${c.key}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                    selectedCities.includes(c.key)
                      ? "text-white border-transparent"
                      : "bg-transparent text-muted-foreground border-border hover:border-primary/50"
                  }`}
                  style={selectedCities.includes(c.key) ? { background: CITY_COLORS[c.key], borderColor: CITY_COLORS[c.key] } : {}}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Year range */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
            Year Range: {yearRange[0]} – {yearRange[1]}
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", range: [minYear, maxYear] as [number, number] },
              { label: "2018–2026", range: [2018, 2026] as [number, number] },
              { label: "2020–2026", range: [2020, 2026] as [number, number] },
              { label: "2022–2026", range: [2022, 2026] as [number, number] },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setYearRange(opt.range)}
                data-testid={`year-range-${opt.label}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  yearRange[0] === opt.range[0] && yearRange[1] === opt.range[1]
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="mb-4">
          <h2 className="font-semibold text-foreground">
            {fuelInfo.label} Price Trends — {yearRange[0]} to {yearRange[1]}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Unit: {fuelInfo.unit}</p>
        </div>
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={filteredData} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(168 25% 85% / 0.5)" strokeWidth={0.8} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }}
              tickLine={false}
              axisLine={false}
              interval={Math.floor(filteredData.length / 8)}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `₹${v}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip unit={fuelInfo.unit.split("/")[0]} />} />
            <Legend
              formatter={name => CITIES.find(c => c.key === name)?.label || name}
              wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
            />
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
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key events */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3">Key Price Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { year: "2014", event: "Petrol deregulation completed, prices decline sharply", type: "down" },
            { year: "2018", event: "Petrol touched record highs (~₹84/L in Delhi) due to global crude spike", type: "up" },
            { year: "2020", event: "COVID-19: Demand crash, petrol prices plunge in Apr-May", type: "down" },
            { year: "2021-22", event: "Post-COVID surge, petrol crossed ₹100/L. LPG hit ₹1103/cylinder", type: "up" },
            { year: "Nov 2021", event: "Fuel excise duty cut: Petrol down ~₹10/L overnight", type: "down" },
            { year: "Mar 2024", event: "LPG cylinder reduced by ₹100 ahead of elections", type: "down" },
          ].map(e => (
            <div key={e.year + e.event} className="flex gap-2.5 p-3 rounded-xl bg-muted/50 border border-border">
              <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                e.type === "up" ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}>
                {e.type === "up" ? "↑" : "↓"}
              </span>
              <div>
                <span className="font-semibold text-foreground">{e.year}: </span>
                <span className="text-muted-foreground">{e.event}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
