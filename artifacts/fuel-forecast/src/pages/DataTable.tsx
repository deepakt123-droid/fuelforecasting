import { useState, useMemo } from "react";
import { Table, Search, Download, ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { FUEL_TYPES, CITIES, getHistoryForFuel, getYearlyAverage, type FuelType, type City, type MonthlyPrice } from "@/data/fuelData";

type SortConfig = { key: keyof MonthlyPrice; direction: "asc" | "desc" } | null;

const CITY_COLORS: Record<City, string> = {
  delhi: "text-teal-600 dark:text-teal-400",
  mumbai: "text-orange-500 dark:text-orange-400",
  chennai: "text-sky-600 dark:text-sky-400",
  kolkata: "text-violet-600 dark:text-violet-400",
};

function SortIcon({ active, direction }: { active: boolean; direction: "asc" | "desc" }) {
  if (!active) return <div className="flex flex-col gap-0.5 opacity-30"><ChevronUp size={8} /><ChevronDown size={8} /></div>;
  return direction === "asc" ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
}

function YoYIndicator({ current, previous }: { current: number; previous: number }) {
  const pct = ((current - previous) / previous) * 100;
  if (Math.abs(pct) < 0.1) return <Minus size={10} className="text-muted-foreground" />;
  if (pct > 0) return <TrendingUp size={10} className="text-red-500" />;
  return <TrendingDown size={10} className="text-emerald-500" />;
}

export default function DataTable() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "year", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState<"monthly" | "yearly">("monthly");
  const pageSize = 24;

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  const filtered = useMemo(() => {
    let data = [...history];
    if (searchQuery) {
      data = data.filter(d =>
        String(d.year).includes(searchQuery) ||
        d.month.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortConfig) {
      data.sort((a, b) => {
        const av = a[sortConfig.key as keyof MonthlyPrice] as number;
        const bv = b[sortConfig.key as keyof MonthlyPrice] as number;
        return sortConfig.direction === "asc" ? (av < bv ? -1 : av > bv ? 1 : 0) : (av > bv ? -1 : av < bv ? 1 : 0);
      });
    }
    return data;
  }, [history, searchQuery, sortConfig]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const pageData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Yearly averages
  const availableYears = [...new Set(history.map(h => h.year))].sort();
  const yearlyData = availableYears.map(year => ({
    year,
    ...getYearlyAverage(history, year)
  })).reverse();

  const requestSort = (key: keyof MonthlyPrice) => {
    setSortConfig(prev => ({
      key, direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
    setCurrentPage(1);
  };

  const exportCSV = () => {
    const header = ["Month", "Year", ...CITIES.map(c => c.label)].join(",");
    const rows = filtered.map(d => [d.month, d.year, ...CITIES.map(c => d[c.key].toFixed(2))].join(","));
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${selectedFuel}_prices.csv`; a.click();
  };

  const THCell = ({ col, sortKey, label }: { col?: string; sortKey?: keyof MonthlyPrice; label: string }) => (
    <th
      className={`px-3 py-3 font-bold text-xs uppercase text-muted-foreground tracking-wide ${sortKey ? "cursor-pointer hover:text-foreground" : ""} ${col || "text-left"}`}
      onClick={() => sortKey && requestSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${col === "text-right" ? "justify-end" : ""}`}>
        {label}
        {sortKey && <SortIcon active={sortConfig?.key === sortKey} direction={sortConfig?.direction || "asc"} />}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Table size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Data Tables</h1>
          </div>
          <p className="text-muted-foreground text-sm">Complete historical fuel price database — sortable, searchable, exportable</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        {/* Fuel */}
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Fuel Type</div>
          <div className="flex gap-2">
            {FUEL_TYPES.map(f => (
              <button key={f.key} onClick={() => { setSelectedFuel(f.key); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedFuel === f.key ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}>
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* View toggle */}
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">View</div>
          <div className="flex gap-2">
            <button onClick={() => setView("monthly")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${view === "monthly" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}`}>
              Monthly
            </button>
            <button onClick={() => setView("yearly")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${view === "yearly" ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border"}`}>
              Yearly Averages
            </button>
          </div>
        </div>

        {/* Search */}
        {view === "monthly" && (
          <div className="flex-1 min-w-40">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">Search</div>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Year or month…"
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* MONTHLY TABLE */}
      {view === "monthly" && (
        <>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between flex-wrap gap-2">
              <div className="font-bold text-foreground text-sm">{fuelInfo.label} Monthly Prices — {fuelInfo.unit}</div>
              <div className="text-xs text-muted-foreground">{filtered.length} records · Page {currentPage}/{totalPages}</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <THCell label="Month" sortKey="month" />
                    <THCell label="Year" sortKey="year" />
                    {CITIES.map(c => (
                      <th key={c.key} className={`px-3 py-3 font-bold text-xs uppercase tracking-wide text-right cursor-pointer hover:opacity-80 ${CITY_COLORS[c.key]}`} onClick={() => requestSort(c.key as keyof MonthlyPrice)}>
                        <div className="flex items-center justify-end gap-1">
                          {c.label}
                          <SortIcon active={sortConfig?.key === c.key} direction={sortConfig?.direction || "asc"} />
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-3 font-bold text-xs uppercase text-right text-muted-foreground tracking-wide">Metro Avg</th>
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, i) => {
                    const metroAvg = CITIES.reduce((s, c) => s + row[c.key], 0) / CITIES.length;
                    const prevRow = history[history.indexOf(row) - 1];
                    return (
                      <tr key={`${row.year}-${row.month}`} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                        <td className="px-3 py-2.5 font-semibold text-foreground">
                          <div className="flex items-center gap-1">
                            {row.month}
                            {prevRow && <YoYIndicator current={row.delhi} previous={prevRow.delhi} />}
                          </div>
                        </td>
                        <td className="px-3 py-2.5 text-muted-foreground font-mono">{row.year}</td>
                        {CITIES.map(c => (
                          <td key={c.key} className={`text-right px-3 py-2.5 font-bold tabular-nums ${CITY_COLORS[c.key]}`}>
                            ₹{row[c.key].toFixed(2)}
                          </td>
                        ))}
                        <td className="text-right px-3 py-2.5 text-muted-foreground font-mono tabular-nums">
                          ₹{metroAvg.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="px-2 py-1 text-sm rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">««</button>
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 text-sm rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">‹ Prev</button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pg = Math.min(Math.max(currentPage - 2 + i, 1), totalPages);
                return (
                  <button key={pg} onClick={() => setCurrentPage(pg)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${pg === currentPage ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"}`}>
                    {pg}
                  </button>
                );
              })}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 text-sm rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">Next ›</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} className="px-2 py-1 text-sm rounded-lg hover:bg-muted disabled:opacity-40 transition-colors">»»</button>
            </div>
          )}
        </>
      )}

      {/* YEARLY TABLE */}
      {view === "yearly" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <div className="font-bold text-foreground text-sm">{fuelInfo.label} Annual Averages — {fuelInfo.unit}</div>
            <div className="text-xs text-muted-foreground">{availableYears.length} years</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 font-bold text-xs uppercase text-muted-foreground tracking-wide">Year</th>
                  {CITIES.map(c => (
                    <th key={c.key} className={`text-right px-4 py-3 font-bold text-xs uppercase tracking-wide ${CITY_COLORS[c.key]}`}>{c.label}</th>
                  ))}
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase text-muted-foreground tracking-wide">Metro Avg</th>
                  <th className="text-right px-4 py-3 font-bold text-xs uppercase text-muted-foreground tracking-wide">YoY</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.map((row, i) => {
                  const metroAvg = CITIES.reduce((s, c) => s + row[c.key], 0) / CITIES.length;
                  const prev = yearlyData[i + 1];
                  const prevMetro = prev ? CITIES.reduce((s, c) => s + prev[c.key], 0) / CITIES.length : null;
                  const yoy = prevMetro ? ((metroAvg - prevMetro) / prevMetro * 100) : null;
                  return (
                    <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 ? "bg-muted/10" : ""}`}>
                      <td className="px-4 py-3 font-bold text-foreground">{row.year}</td>
                      {CITIES.map(c => (
                        <td key={c.key} className={`text-right px-4 py-3 font-semibold tabular-nums ${CITY_COLORS[c.key]}`}>
                          ₹{row[c.key].toFixed(2)}
                        </td>
                      ))}
                      <td className="text-right px-4 py-3 font-mono text-muted-foreground tabular-nums">₹{metroAvg.toFixed(2)}</td>
                      <td className="text-right px-4 py-3">
                        {yoy !== null && (
                          <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${yoy > 0 ? "text-red-500" : yoy < 0 ? "text-emerald-500" : "text-muted-foreground"}`}>
                            {yoy > 0 ? <TrendingUp size={10} /> : yoy < 0 ? <TrendingDown size={10} /> : <Minus size={10} />}
                            {yoy > 0 ? "+" : ""}{yoy.toFixed(1)}%
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
