import { useState } from "react";
import { Newspaper, TrendingUp, TrendingDown, AlertTriangle, Globe, Landmark } from "lucide-react";

interface MarketEvent {
  id: string;
  date: string;
  year: number;
  title: string;
  desc: string;
  impact: "up" | "down" | "mixed";
  magnitude: "high" | "medium" | "low";
  category: "global" | "policy" | "geopolitical" | "domestic";
  fuelTypes: string[];
  priceEffect?: string;
}

const EVENTS: MarketEvent[] = [
  {
    id: "e1", date: "Oct 2014", year: 2014,
    title: "Diesel Price Deregulation",
    desc: "Government decontrolled diesel pricing, ending administrative pricing for the second most consumed fuel. Prices began market-linked monthly revisions.",
    impact: "down", magnitude: "high", category: "policy",
    fuelTypes: ["Diesel"], priceEffect: "Diesel prices aligned to market; initial drop of ~₹3/L"
  },
  {
    id: "e2", date: "Nov 2014–Jan 2015", year: 2014,
    title: "Global Crude Oil Price Collapse",
    desc: "Brent crude fell from $110/barrel to below $50/barrel as OPEC maintained production amid US shale oil surge. India benefited from lower import costs.",
    impact: "down", magnitude: "high", category: "global",
    fuelTypes: ["Petrol", "Diesel", "LPG"], priceEffect: "Delhi petrol fell from ₹71 → ₹59/L over 3 months"
  },
  {
    id: "e3", date: "Jan 2016", year: 2016,
    title: "LPG Subsidy Reforms (PAHAL Scheme)",
    desc: "Direct Benefit Transfer for LPG (DBTL) rolled out nationally. Subsidised LPG became market-linked for non-eligible households.",
    impact: "up", magnitude: "medium", category: "policy",
    fuelTypes: ["LPG"], priceEffect: "Non-subsidised LPG prices started distinct upward trajectory"
  },
  {
    id: "e4", date: "Jun 2017", year: 2017,
    title: "Daily Fuel Price Revision Begins",
    desc: "India switched from fortnightly to daily dynamic pricing for petrol and diesel, aligning with global crude movements and forex rates.",
    impact: "mixed", magnitude: "medium", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Greater price volatility; faster pass-through of crude shocks"
  },
  {
    id: "e5", date: "Sep–Oct 2018", year: 2018,
    title: "Petrol Touched ₹84/L — Record High (Pre-2021)",
    desc: "Brent crude rose above $85/barrel, US dollar strengthened, and Indian elections loomed. Petrol hit historic highs in Delhi.",
    impact: "up", magnitude: "high", category: "global",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Delhi petrol peaked at ₹84/L; diesel at ₹73/L"
  },
  {
    id: "e6", date: "Nov 2018", year: 2018,
    title: "Emergency Excise Duty Cut",
    desc: "Government reduced central excise duty on petrol and diesel by ₹1.50/L each, and asked states to cut VAT by ₹2.50/L amid public outcry over record prices.",
    impact: "down", magnitude: "medium", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Price reduced by ₹5–8/L across metros overnight"
  },
  {
    id: "e7", date: "Mar–May 2020", year: 2020,
    title: "COVID-19 Pandemic — Demand Collapse",
    desc: "Global lockdowns crushed fuel demand. Brent crude briefly turned negative (WTI Apr 2020). India imposed strict lockdown from March 25, 2020.",
    impact: "down", magnitude: "high", category: "global",
    fuelTypes: ["Petrol", "Diesel", "LPG"], priceEffect: "Petrol prices relatively stable due to simultaneous steep excise hikes"
  },
  {
    id: "e8", date: "Mar 2020", year: 2020,
    title: "Record Excise Duty Hike",
    desc: "Union government raised excise duty on petrol by ₹10/L and diesel by ₹13/L to shore up revenue during pandemic, offsetting the crude price fall for consumers.",
    impact: "up", magnitude: "high", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Consumers shielded from crash but paid more than global trend warranted"
  },
  {
    id: "e9", date: "May 2021", year: 2021,
    title: "Petrol Crosses ₹100/L in Delhi",
    desc: "Delhi petrol crossed ₹100/L for the first time as post-COVID demand recovered, crude rose above $70, and excise duties remained elevated.",
    impact: "up", magnitude: "high", category: "global",
    fuelTypes: ["Petrol"], priceEffect: "Delhi petrol: ₹100.21/L on 29 May 2021"
  },
  {
    id: "e10", date: "Oct 2021", year: 2021,
    title: "LPG Peaked at ₹1003/Cylinder",
    desc: "Non-subsidised LPG cylinder prices hit record levels as global LPG prices surged with economic reopening and freight costs rose post-pandemic.",
    impact: "up", magnitude: "high", category: "global",
    fuelTypes: ["LPG"], priceEffect: "Delhi 14.2 kg LPG: ₹1003; Mumbai: ₹1002"
  },
  {
    id: "e11", date: "Nov 2021", year: 2021,
    title: "Pre-Election Excise Duty Rollback",
    desc: "Government cut excise duty by ₹5/L (petrol) and ₹10/L (diesel) ahead of five state elections. Several states followed with VAT reductions.",
    impact: "down", magnitude: "high", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Petrol dropped ₹9–12/L across metros in a single day"
  },
  {
    id: "e12", date: "Feb–Jun 2022", year: 2022,
    title: "Russia–Ukraine War — Crude Spike",
    desc: "Russian invasion of Ukraine drove Brent above $120/barrel. India initially blocked retail price hikes for 137 days due to election cycle.",
    impact: "up", magnitude: "high", category: "geopolitical",
    fuelTypes: ["Petrol", "Diesel", "LPG"], priceEffect: "15 hikes in 16 days post-elections; petrol +₹10/L in April 2022"
  },
  {
    id: "e13", date: "May 2022", year: 2022,
    title: "Second Excise Duty Cut",
    desc: "Government cut excise duty on petrol by ₹8/L and diesel by ₹6/L to counter inflation and surging input costs for agriculture ahead of Kharif season.",
    impact: "down", magnitude: "high", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Petrol reduced by ₹9.5/L in Delhi"
  },
  {
    id: "e14", date: "Mar 2024", year: 2024,
    title: "LPG Cylinder Price Cut ₹100",
    desc: "Government reduced LPG cylinder price by ₹100 (from ₹903 to ₹803 in Delhi) ahead of 2024 Lok Sabha General Elections as a relief measure.",
    impact: "down", magnitude: "high", category: "policy",
    fuelTypes: ["LPG"], priceEffect: "Delhi LPG: ₹903 → ₹803; saving ₹1,200/year per household"
  },
  {
    id: "e15", date: "Mar 2024", year: 2024,
    title: "Petrol & Diesel Cut ₹2/L Pre-Election",
    desc: "State-owned OMCs (IOC, BPCL, HPCL) reduced petrol and diesel prices by ₹2/L — first cut in nearly 2 years — days before election schedule announcement.",
    impact: "down", magnitude: "medium", category: "policy",
    fuelTypes: ["Petrol", "Diesel"], priceEffect: "Delhi petrol: ₹94.77 → ₹92.72/L; diesel: ₹87.67 → ₹85.67/L"
  },
];

const CATEGORIES = [
  { key: "all", label: "All Events" },
  { key: "global", label: "Global Crude" },
  { key: "policy", label: "Govt Policy" },
  { key: "geopolitical", label: "Geopolitical" },
  { key: "domestic", label: "Domestic" },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  global: <Globe size={12} />,
  policy: <Landmark size={12} />,
  geopolitical: <AlertTriangle size={12} />,
  domestic: <Newspaper size={12} />,
};

const CATEGORY_COLORS: Record<string, string> = {
  global: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  policy: "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  geopolitical: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  domestic: "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
};

const MAGNITUDE_COLORS: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

export default function MarketEvents() {
  const [filter, setFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState<"all" | "up" | "down">("all");

  const filtered = EVENTS.filter(e =>
    (filter === "all" || e.category === filter) &&
    (impactFilter === "all" || e.impact === impactFilter)
  );

  const upCount = EVENTS.filter(e => e.impact === "up").length;
  const downCount = EVENTS.filter(e => e.impact === "down").length;

  return (
    <div className="space-y-6 page-events">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Newspaper size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Market Events Timeline</h1>
        </div>
        <p className="text-muted-foreground text-sm">Key events that caused significant fuel price movements in India (2014–2026)</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Events", value: EVENTS.length, icon: "📋", color: "text-foreground" },
          { label: "Price Increases", value: upCount, icon: "📈", color: "text-red-500" },
          { label: "Price Decreases", value: downCount, icon: "📉", color: "text-emerald-500" },
          { label: "Mixed Impact", value: EVENTS.filter(e => e.impact === "mixed").length, icon: "↕️", color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center card-lift">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-4">
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Category</div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setFilter(c.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${filter === c.key ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/40"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Impact Direction</div>
          <div className="flex gap-2">
            {[
              { k: "all", l: "All" },
              { k: "up", l: "↑ Price Rise" },
              { k: "down", l: "↓ Price Fall" },
            ].map(i => (
              <button key={i.k} onClick={() => setImpactFilter(i.k as "all"|"up"|"down")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${impactFilter === i.k ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}`}>
                {i.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {filtered.map((event, idx) => (
          <div key={event.id} className={`timeline-item flex gap-4 pb-5 ${idx === filtered.length - 1 ? "pb-0" : ""}`}>
            {/* Timeline icon */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-card shadow-sm z-10 flex-shrink-0 ${
                event.impact === "up" ? "bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800" :
                event.impact === "down" ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" :
                "bg-muted text-muted-foreground border-border"
              }`}>
                {event.impact === "up" ? <TrendingUp size={14} /> : event.impact === "down" ? <TrendingDown size={14} /> : <span className="text-xs font-bold">↕</span>}
              </div>
              {idx < filtered.length - 1 && (
                <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-border to-transparent min-h-4" />
              )}
            </div>

            {/* Event card */}
            <div className="flex-1 bg-card border border-border rounded-2xl p-4 mb-1 card-lift">
              <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-muted-foreground">{event.date}</span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${CATEGORY_COLORS[event.category]}`}>
                    {CATEGORY_ICONS[event.category]} {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className={`w-2 h-2 rounded-full ${MAGNITUDE_COLORS[event.magnitude]}`} />
                    {event.magnitude} impact
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {event.fuelTypes.map(f => (
                    <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{f}</span>
                  ))}
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{event.desc}</p>
              {event.priceEffect && (
                <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${
                  event.impact === "up" ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" :
                  event.impact === "down" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {event.impact === "up" ? "▲" : event.impact === "down" ? "▼" : "◆"} {event.priceEffect}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No events match the selected filters.
        </div>
      )}

      {/* Interpretation note */}
      <div className="bg-muted/40 border border-border rounded-2xl p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Note on Price Drivers:</strong> Indian fuel prices are influenced by three key layers: (1) Global crude oil benchmarks (Brent/WTI), (2) INR/USD exchange rate, and (3) Central excise duty + state VAT/sales tax. Government often cushions global swings via excise adjustments, creating the step-function price pattern visible in historical data rather than smooth market-linked movements.
      </div>
    </div>
  );
}
