import { useState, useMemo } from "react";
import { FlaskConical, ChevronDown, ChevronRight, BarChart2, TrendingUp } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import { FUEL_TYPES, CITIES, type FuelType, type City } from "@/data/fuelData";
import { computeModelStats, computePredictorContributions, MATH_FORMULAS } from "@/data/mathData";

const CITY_COLORS: Record<City, string> = {
  delhi: "#2dd4bf", mumbai: "#fb923c", chennai: "#38bdf8", kolkata: "#a78bfa",
};

function FormulaCard({ formula, expanded, onToggle }: {
  formula: typeof MATH_FORMULAS[0]; expanded: boolean; onToggle: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden card-lift">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/30 transition-colors">
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${formula.color} flex-shrink-0`} />
          <div>
            <div className="font-bold text-foreground text-sm">{formula.title}</div>
            <div className="text-xs text-muted-foreground">{formula.desc}</div>
          </div>
        </div>
        {expanded ? <ChevronDown size={15} className="text-muted-foreground" /> : <ChevronRight size={15} className="text-muted-foreground" />}
      </button>
      {expanded && (
        <div className="px-5 pb-5 border-t border-border">
          <div className="formula-block mt-4 mb-3 text-base">{formula.latex}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{formula.detail}</p>
        </div>
      )}
    </div>
  );
}

function RSquaredBar({ value }: { value: number }) {
  const pct = value * 100;
  const color = pct >= 90 ? "bg-emerald-500" : pct >= 75 ? "bg-teal-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-bold text-foreground tabular-nums w-12 text-right">{pct.toFixed(2)}%</span>
    </div>
  );
}

export default function MathFramework() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [expandedFormula, setExpandedFormula] = useState<string | null>("linear");

  const modelStats = useMemo(() => computeModelStats(selectedFuel), [selectedFuel]);
  const contributions = useMemo(() => computePredictorContributions(selectedFuel), [selectedFuel]);

  // For bar chart: R² and RMSE per city
  const statsChart = modelStats.map(s => ({
    city: CITIES.find(c => c.key === s.city)?.label || s.city,
    cityKey: s.city,
    "R²": Math.round(s.rSquared * 1000) / 10,
    "RMSE (₹)": s.rmse,
    "MAE (₹)": s.mae,
  }));

  // Radar: contributions (normalised)
  const contributionRadar = contributions.map(c => ({
    city: CITIES.find(x => x.key === c.city)?.label || c.city,
    Intercept: c.interceptContrib,
    Linear: c.linearContrib,
    Quadratic: c.quadraticContrib,
    Seasonal: c.seasonalContrib,
  }));

  return (
    <div className="space-y-8 page-math">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Mathematical Framework</h1>
        </div>
        <p className="text-muted-foreground text-sm">Statistical model equations, coefficients, performance metrics, and predictor variable analysis</p>
      </div>

      {/* Model overview card */}
      <div className="relative overflow-hidden rounded-2xl p-6 border border-border" style={{
        background: "linear-gradient(135deg, hsl(250 40% 18%) 0%, hsl(220 35% 20%) 100%)"
      }}>
        <div className="absolute inset-0 dot-pattern opacity-10" />
        <div className="relative z-10">
          <div className="text-xs font-bold tracking-widest uppercase text-white/60 mb-3">Model Architecture</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Base Model (Linear OLS)</div>
              <div className="font-mono text-white text-lg">ŷ = β₀ + β₁t + ε</div>
              <div className="text-white/50 text-xs mt-1">t = monthly time index, ε = stochastic error</div>
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Extended Model (Degree-2)</div>
              <div className="font-mono text-white text-lg">ŷ = β₀ + β₁t + β₂t²</div>
              <div className="text-white/50 text-xs mt-1">Solved via Normal Equations</div>
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Normal Equations</div>
              <div className="font-mono text-white text-lg">β̂ = (XᵀX)⁻¹Xᵀy</div>
              <div className="text-white/50 text-xs mt-1">Closed-form minimum-variance estimator</div>
            </div>
            <div>
              <div className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-1">Seasonal Correction</div>
              <div className="font-mono text-white text-lg">× (1 + 0.02·sin(2πm/12 − π/6))</div>
              <div className="text-white/50 text-xs mt-1">Amplitude A = 2%, Phase = April peak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Formula Library */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
          Formula Library
        </h2>
        <div className="space-y-2">
          {MATH_FORMULAS.map(f => (
            <FormulaCard
              key={f.id}
              formula={f}
              expanded={expandedFormula === f.id}
              onToggle={() => setExpandedFormula(expandedFormula === f.id ? null : f.id)}
            />
          ))}
        </div>
      </div>

      {/* Fuel selector for stats */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-primary inline-block" />
            Model Performance Metrics
          </h2>
          <div className="flex gap-2">
            {FUEL_TYPES.map(f => (
              <button key={f.key} onClick={() => setSelectedFuel(f.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFuel === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* R² per city */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-foreground text-sm mb-1 flex items-center gap-1.5"><BarChart2 size={14} className="text-primary" /> R² — Coefficient of Determination</h3>
          <p className="text-xs text-muted-foreground mb-4">Proportion of price variance explained by the OLS linear model. Closer to 100% = better fit.</p>
          <div className="space-y-3">
            {modelStats.map(s => (
              <div key={s.city}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-semibold" style={{ color: CITY_COLORS[s.city] }}>
                    {CITIES.find(c => c.key === s.city)?.label}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">n = {s.n} obs</span>
                </div>
                <RSquaredBar value={s.rSquared} />
              </div>
            ))}
          </div>
        </div>

        {/* RMSE & Coefficients */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-3">RMSE & MAE (₹)</h3>
            <p className="text-xs text-muted-foreground mb-3">Root Mean Squared Error and Mean Absolute Error — average prediction deviation in rupees</p>
            <div className="space-y-2">
              {modelStats.map(s => (
                <div key={s.city} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 text-sm">
                  <span className="font-semibold" style={{ color: CITY_COLORS[s.city] }}>{CITIES.find(c => c.key === s.city)?.label}</span>
                  <div className="flex gap-4 text-xs font-mono">
                    <span><span className="text-muted-foreground">RMSE </span><span className="text-foreground font-bold">₹{s.rmse.toFixed(2)}</span></span>
                    <span><span className="text-muted-foreground">MAE </span><span className="text-foreground font-bold">₹{s.mae.toFixed(2)}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-3">OLS Coefficients (Linear Model)</h3>
            <p className="text-xs text-muted-foreground mb-3">β₀ = intercept (base price), β₁ = monthly trend slope (₹ per month)</p>
            <div className="space-y-2">
              {modelStats.map(s => (
                <div key={s.city} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0 text-sm">
                  <span className="font-semibold" style={{ color: CITY_COLORS[s.city] }}>{CITIES.find(c => c.key === s.city)?.label}</span>
                  <div className="flex gap-4 text-xs font-mono">
                    <span><span className="text-muted-foreground">β₀ </span><span className="text-foreground font-bold">₹{s.intercept.toFixed(2)}</span></span>
                    <span><span className="text-muted-foreground">β₁ </span><span className="text-foreground font-bold">{s.slope.toFixed(4)}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Polynomial coefficients */}
        <div className="bg-card border border-border rounded-2xl p-5 mb-4">
          <h3 className="font-bold text-foreground text-sm mb-1">Degree-2 Polynomial Coefficients</h3>
          <p className="text-xs text-muted-foreground mb-4">β₀ + β₁t + β₂t² solved via Normal Equations (XᵀX)⁻¹Xᵀy</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 font-bold text-muted-foreground text-xs uppercase">City</th>
                  <th className="text-right pb-2 font-bold text-muted-foreground text-xs uppercase font-mono">β₀ (intercept)</th>
                  <th className="text-right pb-2 font-bold text-muted-foreground text-xs uppercase font-mono">β₁ (linear)</th>
                  <th className="text-right pb-2 font-bold text-muted-foreground text-xs uppercase font-mono">β₂ (quadratic)</th>
                </tr>
              </thead>
              <tbody>
                {modelStats.map(s => (
                  <tr key={s.city} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 font-semibold" style={{ color: CITY_COLORS[s.city] }}>{CITIES.find(c => c.key === s.city)?.label}</td>
                    <td className="text-right py-2.5 font-mono text-foreground text-xs">{s.polyCoeffs[0].toFixed(4)}</td>
                    <td className="text-right py-2.5 font-mono text-foreground text-xs">{s.polyCoeffs[1].toFixed(6)}</td>
                    <td className="text-right py-2.5 font-mono text-foreground text-xs">{s.polyCoeffs[2].toFixed(8)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Predictor contributions bar chart */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <h3 className="font-bold text-foreground text-sm mb-1 flex items-center gap-1.5">
            <TrendingUp size={14} className="text-primary" /> Predictor Variable Contributions (%)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Relative contribution of each predictor to the projected price at the last historical observation. Intercept = base level; Linear = trend; Quadratic = acceleration; Seasonal = cyclical adjustment.</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={contributionRadar} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.4} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="city" tick={{ fontSize: 11, fill: "hsl(200 15% 50%)" }} tickLine={false} axisLine={false} width={55} />
              <Tooltip formatter={(v: number, name: string) => [`${v}%`, name]} />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="Intercept" stackId="a" fill="#2dd4bf" radius={[0,0,0,0]} />
              <Bar dataKey="Linear" stackId="a" fill="#fb923c" />
              <Bar dataKey="Quadratic" stackId="a" fill="#38bdf8" />
              <Bar dataKey="Seasonal" stackId="a" fill="#a78bfa" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Assumptions */}
      <div className="bg-muted/40 border border-border rounded-2xl p-5 text-sm">
        <h3 className="font-bold text-foreground mb-3">Gauss-Markov Assumptions (OLS)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { a: "Linearity", d: "Fuel price (y) is a linear function of time index (t) plus error ε" },
            { a: "Random sampling", d: "Monthly price observations are representative of the actual period" },
            { a: "No perfect collinearity", d: "t and t² are correlated but not perfectly, allowing identification" },
            { a: "Zero conditional mean", d: "E[ε | t] = 0 — systematic government interventions introduce some violation" },
            { a: "Homoscedasticity", d: "Var[ε | t] = σ² — price volatility increased in 2021–22 (partial violation)" },
            { a: "No autocorrelation", d: "Cov[εᵢ, εⱼ] = 0 — price stickiness in India implies mild positive autocorrelation" },
          ].map(item => (
            <div key={item.a} className="flex gap-2">
              <span className="mt-0.5 text-primary font-bold text-xs flex-shrink-0">✓</span>
              <div>
                <span className="font-semibold text-foreground">{item.a}: </span>
                <span className="text-muted-foreground">{item.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
