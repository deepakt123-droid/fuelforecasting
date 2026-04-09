import { useState, useMemo } from "react";
import { Calculator, Fuel, Car, TrendingUp, FlaskConical, AlertCircle } from "lucide-react";
import { FUEL_TYPES, CITIES, getCurrentPrice, generateForecast, getHistoryForFuel, type FuelType, type City } from "@/data/fuelData";

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function FuelCalculator() {
  const [fuel, setFuel] = useState<FuelType>("petrol");
  const [city, setCity] = useState<City>("delhi");
  const [mileage, setMileage] = useState(15);
  const [kmPerMonth, setKmPerMonth] = useState(1500);
  const [litersPerMonth, setLitersPerMonth] = useState(40);
  const [mode, setMode] = useState<"km" | "liters">("km");

  const currentPrices = getCurrentPrice(fuel);
  const currentPrice = currentPrices[city];
  const fuelInfo = FUEL_TYPES.find(f => f.key === fuel)!;
  const cityLabel = CITIES.find(c => c.key === city)?.label || city;

  const effectiveLiters = mode === "km" ? kmPerMonth / mileage : litersPerMonth;
  const monthlySpend = effectiveLiters * currentPrice;
  const annualSpend = monthlySpend * 12;

  const history = getHistoryForFuel(fuel);
  const forecast = useMemo(() => generateForecast(history, 10), [history, fuel]);

  const futureData = useMemo(() => {
    const byYear: Record<number, number[]> = {};
    forecast.forEach(f => {
      if (!byYear[f.year]) byYear[f.year] = [];
      byYear[f.year].push(f[city]);
    });
    return Object.entries(byYear).map(([year, prices]) => {
      const avgPrice = prices.reduce((s, p) => s + p, 0) / prices.length;
      const monthly = effectiveLiters * avgPrice;
      return {
        year: Number(year),
        avgPrice: Math.round(avgPrice * 100) / 100,
        monthlySpend: Math.round(monthly * 100) / 100,
        annualSpend: Math.round(monthly * 12 * 100) / 100,
        change: ((avgPrice - currentPrice) / currentPrice) * 100,
      };
    }).sort((a, b) => a.year - b.year);
  }, [forecast, city, effectiveLiters, currentPrice]);

  const tenYearTotal = futureData.reduce((s, r) => s + r.annualSpend, 0);
  const peak = futureData[futureData.length - 1];

  return (
    <div className="space-y-6 page-calculator">
      {/* Header — Research / Calculator theme */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator size={20} className="text-amber-600 dark:text-amber-400" />
            <h1 className="text-2xl font-bold text-foreground">Fuel Expense Calculator</h1>
          </div>
          <p className="text-muted-foreground text-sm">Compute present & projected fuel costs using OLS-based price projections</p>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-700 dark:text-amber-300 font-medium flex items-center gap-1.5">
          <FlaskConical size={12} /> Regression-based estimation
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl p-3 flex gap-2 text-sm">
        <AlertCircle size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <span className="text-amber-700 dark:text-amber-300">Future costs are projected using OLS regression on historical data. Actual prices will differ based on crude oil markets, government policy, and state taxes.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <h2 className="font-bold text-foreground flex items-center gap-2 text-sm uppercase tracking-wider">
              <Fuel size={14} className="text-amber-600 dark:text-amber-400" /> Input Parameters
            </h2>

            {/* Fuel type */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">Fuel Type</label>
              <div className="flex gap-2 flex-wrap">
                {FUEL_TYPES.map(f => (
                  <button key={f.key} onClick={() => setFuel(f.key)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${fuel === f.key ? "bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">City</label>
              <div className="flex gap-2 flex-wrap">
                {CITIES.map(c => (
                  <button key={c.key} onClick={() => setCity(c.key)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      city === c.key ? "border-transparent bg-amber-500 text-white shadow-sm" : "bg-muted text-muted-foreground border-border hover:border-amber-400/50"
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mode */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">Calculation Mode</label>
              <div className="flex gap-2">
                <button onClick={() => setMode("km")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border ${mode === "km" ? "bg-amber-500 text-white border-amber-500" : "bg-muted text-muted-foreground border-border"}`}>
                  <Car size={13} /> Distance-based
                </button>
                <button onClick={() => setMode("liters")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 border ${mode === "liters" ? "bg-amber-500 text-white border-amber-500" : "bg-muted text-muted-foreground border-border"}`}>
                  <Fuel size={13} /> Volume-based
                </button>
              </div>
            </div>

            {mode === "km" ? (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Distance / Month</label>
                    <span className="text-sm font-bold text-foreground font-mono">{kmPerMonth.toLocaleString()} km</span>
                  </div>
                  <input type="range" min={100} max={5000} step={50} value={kmPerMonth} onChange={e => setKmPerMonth(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>100 km</span><span>5,000 km</span></div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Vehicle Efficiency</label>
                    <span className="text-sm font-bold text-foreground font-mono">{mileage} km/L</span>
                  </div>
                  <input type="range" min={5} max={35} step={0.5} value={mileage} onChange={e => setMileage(Number(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>5 km/L</span><span>35 km/L</span></div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    {fuel === "lpg" ? "Cylinders / Month" : "Volume / Month (Litres)"}
                  </label>
                  <span className="text-sm font-bold text-foreground font-mono">{litersPerMonth}</span>
                </div>
                <input type="range" min={1} max={fuel === "lpg" ? 10 : 100} step={fuel === "lpg" ? 0.5 : 1} value={litersPerMonth} onChange={e => setLitersPerMonth(Number(e.target.value))} className="w-full" />
              </div>
            )}

            <div className="bg-muted/60 rounded-xl p-3 text-xs text-muted-foreground font-mono space-y-1">
              <div>Current {cityLabel} Price: <span className="text-foreground font-bold">₹{currentPrice.toFixed(2)}</span> / {fuel === "lpg" ? "cylinder" : "litre"}</div>
              {mode === "km" && <div>Computed consumption: <span className="text-foreground font-bold">{effectiveLiters.toFixed(2)} L/month</span></div>}
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Hero result */}
          <div className="relative overflow-hidden rounded-2xl" style={{
            background: "linear-gradient(135deg, hsl(35 80% 40%) 0%, hsl(25 90% 50%) 100%)"
          }}>
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="relative z-10 p-6 text-white">
              <div className="text-xs font-bold uppercase tracking-widest opacity-75 mb-2">Monthly Fuel Spend — {cityLabel}</div>
              <div className="text-4xl font-bold font-mono mb-1">{INR.format(monthlySpend)}</div>
              <div className="text-sm opacity-75">Annual: <strong className="opacity-100">{INR.format(annualSpend)}</strong></div>
            </div>
          </div>

          {/* Breakdown grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Daily", value: INR.format(monthlySpend / 30), icon: "📅" },
              { label: "Weekly", value: INR.format(monthlySpend / 4.33), icon: "📆" },
              { label: fuel === "lpg" ? "Cyl/Year" : "Litres/Year", value: fuel === "lpg" ? `${(effectiveLiters * 12).toFixed(1)}` : `${Math.round(effectiveLiters * 12)} L`, icon: "⛽" },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center card-lift">
                <div className="text-lg mb-0.5">{s.icon}</div>
                <div className="text-sm font-bold text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* 10-year totals */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-2">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">10-Year Cumulative Summary</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total projected spend (10 yr)</span>
              <span className="font-bold text-foreground">{INR.format(tenYearTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Projected price in 2036 ({cityLabel})</span>
              <span className="font-bold text-foreground">₹{peak?.avgPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price change 2026 → 2036</span>
              <span className={`font-bold ${peak?.change > 0 ? "text-red-500" : "text-emerald-500"}`}>
                {peak?.change > 0 ? "+" : ""}{peak?.change.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Future cost projections table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <TrendingUp size={14} className="text-amber-600 dark:text-amber-400" />
          <h2 className="font-bold text-foreground text-sm">10-Year Expense Projection — {cityLabel} · {fuelInfo.label}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Year</th>
                <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Avg Price</th>
                <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Monthly Cost</th>
                <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">Annual Cost</th>
                <th className="text-right px-4 py-3 font-bold text-muted-foreground text-xs uppercase">vs 2026</th>
              </tr>
            </thead>
            <tbody>
              {futureData.map((row, i) => (
                <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                  <td className="px-4 py-3 font-bold text-foreground">{row.year}</td>
                  <td className="text-right px-4 py-3 font-mono text-foreground">₹{row.avgPrice.toFixed(2)}</td>
                  <td className="text-right px-4 py-3 font-bold text-amber-600 dark:text-amber-400">{INR.format(row.monthlySpend)}</td>
                  <td className="text-right px-4 py-3 text-foreground">{INR.format(row.annualSpend)}</td>
                  <td className="text-right px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.change > 0 ? "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"}`}>
                      {row.change > 0 ? "+" : ""}{row.change.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Computation Trace */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-bold text-foreground mb-3 text-sm flex items-center gap-2">
          <FlaskConical size={14} className="text-amber-600 dark:text-amber-400" /> Computation Trace
        </h3>
        <div className="font-mono text-xs text-muted-foreground space-y-1.5 bg-muted/50 rounded-xl p-4">
          <div><span className="text-foreground">mode</span> = "{mode}"</div>
          {mode === "km" ? (
            <>
              <div><span className="text-foreground">distance_per_month</span> = {kmPerMonth} km</div>
              <div><span className="text-foreground">vehicle_efficiency</span> = {mileage} km/L</div>
              <div><span className="text-foreground">effective_volume</span> = {kmPerMonth}/{mileage} = {effectiveLiters.toFixed(2)} L/month</div>
            </>
          ) : (
            <div><span className="text-foreground">volume_per_month</span> = {litersPerMonth} {fuel === "lpg" ? "cyl" : "L"}</div>
          )}
          <div><span className="text-foreground">current_price</span> = ₹{currentPrice.toFixed(2)} / {fuel === "lpg" ? "cyl" : "L"} ({cityLabel})</div>
          <div><span className="text-foreground">monthly_spend</span> = {effectiveLiters.toFixed(2)} × {currentPrice.toFixed(2)} = <span className="text-amber-500 font-bold">{INR.format(monthlySpend)}</span></div>
          <div><span className="text-foreground">annual_spend</span> = {INR.format(monthlySpend)} × 12 = <span className="text-amber-500 font-bold">{INR.format(annualSpend)}</span></div>
          <div className="pt-1 border-t border-border"><span className="text-foreground">projection_model</span> = OLS Linear Regression + Seasonal Adjustment</div>
        </div>
      </div>
    </div>
  );
}
