import { BookOpen, ExternalLink, Database, FileText, BookMarked } from "lucide-react";
import { REFERENCES } from "@/data/mathData";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  "Government Data": <Database size={13} />,
  "Textbook": <BookMarked size={13} />,
  "Journal Article": <FileText size={13} />,
  "Research Report": <FileText size={13} />,
  "Data Repository": <Database size={13} />,
};

const TYPE_COLORS: Record<string, string> = {
  "Government Data": "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
  "Textbook": "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  "Journal Article": "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
  "Research Report": "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "Data Repository": "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
};

const TYPE_GROUPS = ["Government Data", "Data Repository", "Textbook", "Journal Article", "Research Report"];

export default function References() {
  const govData = REFERENCES.filter(r => r.type === "Government Data" || r.type === "Data Repository");
  const academic = REFERENCES.filter(r => r.type === "Textbook" || r.type === "Journal Article" || r.type === "Research Report");

  return (
    <div className="space-y-8 page-references">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">References & Data Sources</h1>
        </div>
        <p className="text-muted-foreground text-sm">Primary data sources, academic literature, and policy reports used in this system</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TYPE_GROUPS.filter(t => REFERENCES.some(r => r.type === t)).map(type => {
          const count = REFERENCES.filter(r => r.type === type).length;
          return (
            <div key={type} className={`rounded-2xl p-4 text-center border border-border card-lift ${TYPE_COLORS[type].replace("text-", "bg-").replace(/dark.*$/, "")}`}>
              <div className="flex justify-center mb-1 opacity-60">{TYPE_ICONS[type]}</div>
              <div className="text-xl font-bold text-foreground">{count}</div>
              <div className="text-xs text-muted-foreground">{type}</div>
            </div>
          );
        })}
      </div>

      {/* Primary Data Sources */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Database size={16} className="text-primary" /> Primary Data Sources
        </h2>
        <div className="space-y-3">
          {govData.map(ref => (
            <div key={ref.id} className="bg-card border border-border rounded-2xl p-5 card-lift">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-muted-foreground">[{ref.id}]</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${TYPE_COLORS[ref.type]}`}>
                    {TYPE_ICONS[ref.type]} {ref.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{ref.year}</span>
                </div>
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                    <ExternalLink size={11} /> {ref.url.replace("https://", "")}
                  </a>
                )}
              </div>
              <h3 className="font-bold text-foreground mb-1">{ref.title}</h3>
              <div className="text-xs text-muted-foreground mb-2 font-medium">{ref.authors} · {ref.source}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ref.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic References */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <BookMarked size={16} className="text-primary" /> Academic Literature
        </h2>
        <div className="space-y-3">
          {academic.map(ref => (
            <div key={ref.id} className="bg-card border border-border rounded-2xl p-5 card-lift">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-muted-foreground">[{ref.id}]</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${TYPE_COLORS[ref.type]}`}>
                    {TYPE_ICONS[ref.type]} {ref.type}
                  </span>
                  <span className="text-xs text-muted-foreground">{ref.year}</span>
                </div>
                {ref.url && (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                    <ExternalLink size={11} /> {ref.url.replace("https://doi.org/", "doi:")}
                  </a>
                )}
              </div>
              <h3 className="font-bold text-foreground mb-1">{ref.title}</h3>
              <div className="text-xs text-muted-foreground mb-2 font-medium italic">{ref.authors} ({ref.year}). {ref.source}.</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ref.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Citation guide */}
      <div className="bg-muted/40 border border-border rounded-2xl p-5 text-sm">
        <h3 className="font-bold text-foreground mb-3">How to Cite This System</h3>
        <div className="font-mono text-xs bg-card border border-border rounded-xl p-4 text-muted-foreground leading-relaxed">
          Fuel Price Trend Forecasting System for India. (2026). Based on PPAC MSHS data (2014–2026)
          and IndaneGas historical LPG prices (2013–2026). Statistical projection method: Ordinary
          Least Squares (OLS) linear and polynomial regression. [Online Dashboard].
        </div>
        <p className="text-muted-foreground text-xs mt-3">
          This system uses publicly available government data from PPAC and IOCL-IndaneGas.
          Statistical methods follow standard econometric textbook approaches (Montgomery et al., 2012; Draper & Smith, 1998).
          Projections are statistical estimates and not financial advice or market forecasts.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5 text-sm">
        <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">Disclaimer</h3>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          All price data is sourced from publicly available government publications. While every care has been taken to ensure accuracy,
          minor discrepancies may exist due to rounding or revision of original data. The statistical projections (2026–2036) are based
          on historical price trends and should not be construed as financial advice or official price forecasts. Actual fuel prices are
          determined by the Government of India and oil marketing companies based on prevailing crude oil prices, currency exchange rates,
          taxes, and commercial considerations.
        </p>
      </div>
    </div>
  );
}
