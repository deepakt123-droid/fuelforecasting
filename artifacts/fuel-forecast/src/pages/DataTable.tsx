import { useState, useMemo } from "react";
import { Table, Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import { FUEL_TYPES, CITIES, getHistoryForFuel, type FuelType, type City, type MonthlyPrice } from "@/data/fuelData";

type SortConfig = { key: keyof MonthlyPrice; direction: "asc" | "desc" } | null;

const CITY_COLORS: Record<City, string> = {
  delhi: "text-teal-600 dark:text-teal-400",
  mumbai: "text-orange-500 dark:text-orange-400",
  chennai: "text-sky-600 dark:text-sky-400",
  kolkata: "text-violet-600 dark:text-violet-400",
};

export default function DataTable() {
  const [selectedFuel, setSelectedFuel] = useState<FuelType>("petrol");
  const [searchYear, setSearchYear] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "year", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  const history = getHistoryForFuel(selectedFuel);
  const fuelInfo = FUEL_TYPES.find(f => f.key === selectedFuel)!;

  const filtered = useMemo(() => {
    let data = [...history];
    if (searchYear) {
      data = data.filter(d => String(d.year).includes(searchYear) || d.month.toLowerCase().includes(searchYear.toLowerCase()));
    }
    if (sortConfig) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return data;
  }, [history, selectedFuel, searchYear, sortConfig]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: keyof MonthlyPrice) => {
    setSortConfig(prev => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
    setCurrentPage(1);
  };

  const SortIcon = ({ col }: { col: keyof MonthlyPrice }) => {
    if (sortConfig?.key !== col) return <ChevronUp size={12} className="text-muted-foreground/40" />;
    return sortConfig.direction === "asc"
      ? <ChevronUp size={12} className="text-primary" />
      : <ChevronDown size={12} className="text-primary" />;
  };

  const downloadCSV = () => {
    const headers = ["Month", "Year", "Delhi", "Mumbai", "Chennai", "Kolkata"];
    const rows = filtered.map(d => [d.month, d.year, d.delhi, d.mumbai, d.chennai, d.kolkata]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedFuel}_prices_india.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Year-wise summaries
  const yearSummaries = useMemo(() => {
    const years = [...new Set(history.map(h => h.year))].sort((a, b) => b - a);
    return years.map(year => {
      const rows = history.filter(h => h.year === year);
      const avg = (city: City) => Math.round(rows.reduce((s, d) => s + d[city], 0) / rows.length * 100) / 100;
      return { year, delhi: avg("delhi"), mumbai: avg("mumbai"), chennai: avg("chennai"), kolkata: avg("kolkata"), months: rows.length };
    });
  }, [history, selectedFuel]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Table size={20} className="text-primary" />
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Space Grotesk, sans-serif" }}>Data Tables</h1>
          </div>
          <p className="text-muted-foreground text-sm">Complete historical fuel price data — monthly records</p>
        </div>
        <button
          onClick={downloadCSV}
          data-testid="btn-download-csv"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:opacity-90 transition-all"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Fuel selector + search */}
      <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FUEL_TYPES.map(f => (
            <button
              key={f.key}
              onClick={() => { setSelectedFuel(f.key); setCurrentPage(1); }}
              data-testid={`table-fuel-${f.key}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                selectedFuel === f.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search year or month..."
            value={searchYear}
            onChange={e => { setSearchYear(e.target.value); setCurrentPage(1); }}
            data-testid="input-search-year"
            className="pl-8 pr-4 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
          />
        </div>
      </div>

      {/* Year summary table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-foreground text-sm">Yearly Average Prices — {fuelInfo.label} ({fuelInfo.unit})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Year</th>
                {CITIES.map(c => (
                  <th key={c.key} className={`text-right px-4 py-2.5 text-xs font-semibold uppercase ${CITY_COLORS[c.key]}`}>{c.label}</th>
                ))}
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase">Records</th>
              </tr>
            </thead>
            <tbody>
              {yearSummaries.slice(0, 10).map((row, i) => (
                <tr key={row.year} className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`} data-testid={`year-summary-${row.year}`}>
                  <td className="px-4 py-2.5 font-bold text-foreground">{row.year}</td>
                  {CITIES.map(c => (
                    <td key={c.key} className={`text-right px-4 py-2.5 font-medium ${CITY_COLORS[c.key]}`}>₹{row[c.key].toFixed(2)}</td>
                  ))}
                  <td className="text-right px-4 py-2.5 text-muted-foreground">{row.months}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly detail table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between flex-wrap gap-2">
          <h2 className="font-semibold text-foreground text-sm">Monthly Detail — {filtered.length} records</h2>
          <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {([
                  { key: "month" as keyof MonthlyPrice, label: "Month" },
                  { key: "year" as keyof MonthlyPrice, label: "Year" },
                  { key: "delhi" as keyof MonthlyPrice, label: "Delhi" },
                  { key: "mumbai" as keyof MonthlyPrice, label: "Mumbai" },
                  { key: "chennai" as keyof MonthlyPrice, label: "Chennai" },
                  { key: "kolkata" as keyof MonthlyPrice, label: "Kolkata" },
                ]).map(col => (
                  <th
                    key={col.key}
                    className={`px-4 py-2.5 text-xs font-semibold uppercase cursor-pointer hover:bg-muted/50 transition-colors select-none ${
                      ["delhi","mumbai","chennai","kolkata"].includes(col.key)
                        ? `text-right ${CITY_COLORS[col.key as City]}`
                        : "text-left text-muted-foreground"
                    }`}
                    onClick={() => handleSort(col.key)}
                    data-testid={`sort-${col.key}`}
                  >
                    <span className="flex items-center gap-1 justify-end">
                      {["delhi","mumbai","chennai","kolkata"].includes(col.key) && <SortIcon col={col.key} />}
                      {col.label}
                      {!["delhi","mumbai","chennai","kolkata"].includes(col.key) && <SortIcon col={col.key} />}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr
                  key={`${row.month}-${row.year}`}
                  className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                  data-testid={`table-row-${row.month}-${row.year}`}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.month}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.year}</td>
                  {CITIES.map(c => (
                    <td key={c.key} className={`text-right px-4 py-2.5 font-medium ${CITY_COLORS[c.key]}`}>₹{row[c.key].toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-border flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              data-testid="btn-prev-page"
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    data-testid={`page-${page}`}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      currentPage === page ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              data-testid="btn-next-page"
              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
