import { useState, useMemo } from "react";
import { Calculator, Fuel, Car, TrendingUp } from "lucide-react";
import { FUEL_TYPES, CITIES, getCurrentPrice, generateForecast, getHistoryForFuel, type FuelType, type City } from "@/data/fuelData";

export default function FuelCalculator() {
  const [fuel, setFuel] = useState<FuelType>("petrol");
  const [city, setCity] = useState<City>("delhi");
  const [litersPerMonth, setLitersPerMonth] = useState(40);
  const [mileage, setMileage] = useState(15);
  const [kmPerMonth, setKmPerMonth] = useState(1500);
  const [mode, setMode] = useState<"liters" | "km">("km");

  const currentPrices = getCurrentPrice(fuel);
  const currentPrice = currentPrices[city];
  const fuelInfo = FUEL_TYPES.find(f => f.key === fuel)!;
  const cityLabel = CITIES.find(c => c.key === city)?.label || city;

  // Effective liters per month
  const effectiveLiters = mode === "km" ? kmPerMonth / mileage : litersPerMonth;
  const monthlySpend = effectiveLiters * (fuel === "lpg" ? 1 : 1) * currentPrice;
  const annualSpend = monthlySpend * 12;

  // Future cost estimates using forecast
  const history = getHistoryForFuel(fuel);
  const forecast = useMemo(() => generateForecast(history, 10), [history, fuel]);

  const futureYearlyAvg = useMemo(() => {
    const byYear: Record<number, number[]> = {};
    forecast.forEach(f => {
      if (!byYear[f.year]) byYear[f.year] = [];
      byYear[f.year].push(f[city]);
    });
    const result: { year: number; avgPrice: number; monthlySpend: number; annualSpend: number; change: number }[] = [];
    Object.entries(byYear).forEach(([year, prices]) => {
      const avgPrice = prices.reduce((s, p) => s + p, 0) / prices.length;
      const monthly = effectiveLiters * avgPrice;
      const annual = monthly * 12;
      result.push({
        year: Number(year),
        avgPrice: Math.round(avgPrice * 100) / 100,
        monthlySpend: Math.round(monthly * 100) / 100,
        annualSpend: Math.round(annual * 100) / 100,
        change: ((avgPrice - currentPrice) / currentPrice) * 100,
      });
    });
    return result.sort((a, b) => a.year - b.year);
  }, [forecast, city, effectiveLiters, currentPrice]);

  const formatCurrency = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Calculator size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Fuel Expense Calculator</h1>
        </div>
        <p className="text-muted-foreground text-sm">Estimate your current & future fuel costs using real + forecasted prices</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Fuel size={16} className="text-primary" /> Your Fuel Profile
            </h2>

            {/* Fuel type */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Fuel Type</label>
              <div className="flex gap-2 flex-wrap">
                {FUEL_TYPES.map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFuel(f.key)}
                    data-testid={`calc-fuel-${f.key}`}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      fuel === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Your City</label>
              <div className="flex gap-2 flex-wrap">
                {CITIES.map(c => (
                  <button
                    key={c.key}
                    onClick={() => setCity(c.key)}
                    data-testid={`calc-city-${c.key}`}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      city === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-2">Calculation Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode("km")}
                  data-testid="calc-mode-km"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${mode === "km" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  <Car size={14} /> KM-based
                </button>
                <button
                  onClick={() => setMode("liters")}
                  data-testid="calc-mode-liters"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${mode === "liters" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  <Fuel size={14} /> Litre-based
                </button>
              </div>
            </div>

            {mode === "km" ? (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">KM per Month</label>
                    <span className="text-sm font-bold text-foreground">{kmPerMonth} km</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={5000}
                    step={50}
                    value={kmPerMonth}
                    onChange={e => setKmPerMonth(Number(e.target.value))}
                    data-testid="slider-km"
                    className="w-full accent-primary h-2 rounded-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>100</span><span>5,000 km</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Mileage (km/L)</label>
                    <span className="text-sm font-bold text-foreground">{mileage} km/L</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={35}
                    step={0.5}
                    value={mileage}
                    onChange={e => setMileage(Number(e.target.value))}
                    data-testid="slider-mileage"
                    className="w-full accent-primary h-2 rounded-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>5</span><span>35 km/L</span></div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {fuel === "lpg" ? "Cylinders/Month" : "Litres per Month"}
                  </label>
                  <span className="text-sm font-bold text-foreground">{litersPerMonth}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={fuel === "lpg" ? 10 : 100}
                  step={fuel === "lpg" ? 0.5 : 1}
                  value={litersPerMonth}
                  onChange={e => setLitersPerMonth(Number(e.target.value))}
                  data-testid="slider-liters"
                  className="w-full accent-primary h-2 rounded-full"
                />
              </div>
            )}

            <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground">
              <strong>Current {cityLabel} Price:</strong> ₹{currentPrice.toFixed(2)} {fuelInfo.unit}
              {mode === "km" && (
                <span className="ml-2">· Consumption: {effectiveLiters.toFixed(1)} L/month</span>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Current cost */}
          <div className="relative overflow-hidden rounded-2xl" style={{
            background: "linear-gradient(135deg, hsl(168 70% 35%) 0%, hsl(185 75% 42%) 100%)"
          }}>
            <div className="absolute inset-0 dot-pattern opacity-15" />
            <div className="relative z-10 p-6 text-white">
              <div className="text-sm opacity-75 mb-1">Current Monthly Spend ({cityLabel})</div>
              <div className="text-4xl font-bold mb-0.5" data-testid="result-monthly">{formatCurrency(monthlySpend)}</div>
              <div className="text-sm opacity-70">Annual: <strong>{formatCurrency(annualSpend)}</strong></div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Daily Cost", value: formatCurrency(monthlySpend / 30), icon: "📅" },
              { label: "Weekly Cost", value: formatCurrency(monthlySpend / 4.3), icon: "📆" },
              { label: fuel === "lpg" ? "Cylinders/Year" : "Litres/Year", value: fuel === "lpg" ? `${(effectiveLiters * 12).toFixed(1)}` : `${(effectiveLiters * 12).toFixed(0)} L`, icon: "⛽" },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="text-sm font-bold text-foreground" data-testid={`stat-${s.label.toLowerCase().replace(/ /g, "-")}`}>{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future cost projections */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <TrendingUp size={14} className="text-primary" />
          <h2 className="font-semibold text-foreground text-sm">10-Year Fuel Expense Forecast — {cityLabel}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Year</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Avg Price</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Monthly Cost</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">Annual Cost</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground text-xs uppercase">vs Today</th>
              </tr>
            </thead>
            <tbody>
              {futureYearlyAvg.map((row, i) => (
                <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`} data-testid={`calc-forecast-${row.year}`}>
                  <td className="px-4 py-3 font-bold text-foreground">{row.year}</td>
                  <td className="text-right px-4 py-3 font-medium text-foreground">₹{row.avgPrice.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 font-semibold text-primary">{formatCurrency(row.monthlySpend)}</td>
                  <td className="text-right px-4 py-3 font-medium text-foreground">{formatCurrency(row.annualSpend)}</td>
                  <td className="text-right px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      row.change > 0 ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                    }`}>
                      {row.change > 0 ? "+" : ""}{row.change.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
