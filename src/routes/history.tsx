import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateHistory, getAlertLevel, AlertLevel } from "@/lib/mockData";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historical Data — PLTMH Banjar" },
      { name: "description", content: "Cari, filter, dan ekspor data pembacaan sensor historis dari sistem pemantauan sungai." },
    ],
  }),
  component: HistoryPage,
});

const statusLabels: Record<AlertLevel, string> = {
  safe: "AMAN",
  standby: "SIAGA",
  danger: "BAHAYA",
};

function HistoryPage() {
  const [data] = useState(() => generateHistory(96));
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    return data
      .map((d) => ({ ...d, status: getAlertLevel(d.level) }))
      .filter((d) => (filter === "all" ? true : d.status === filter))
      .filter((d) => (search ? d.time.includes(search) : true))
      .reverse();
  }, [data, search, filter]);

  const exportCSV = () => {
    const header = "Time,Level (m),Velocity (m/d),Discharge (m3/d),Status\n";
    const rows = filtered
      .map((d) => `${d.time},${d.level},${d.velocity},${d.discharge},${statusLabels[d.status]}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pltmh-banjar-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title="Historical Data" subtitle="Cari, filter & ekspor data sensor">
      <Card className="rounded-2xl border-border bg-card shadow-elevated">
        <div className="flex flex-wrap items-center gap-2.5 border-b border-sidebar-border p-3.5">
          <Input
            placeholder="Cari waktu (mis. 14:30)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-45 flex-1 rounded-lg border-input bg-inset font-mono text-xs"
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 rounded-lg border-input bg-inset font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="font-mono text-xs">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="safe">Aman</SelectItem>
              <SelectItem value="standby">Siaga</SelectItem>
              <SelectItem value="danger">Bahaya</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV} className="rounded-[10px] border-input bg-transparent font-mono text-xs">
            <Download /> EXPORT CSV
          </Button>
        </div>

        <div className="max-h-140 overflow-auto">
          <Table className="text-xs">
            <TableHeader className="sticky top-0 z-10 bg-[oklch(0.19_0.025_250)]">
              <TableRow className="border-sidebar-border hover:bg-transparent">
                <HeaderCell>Waktu</HeaderCell>
                <HeaderCell className="text-right">Tinggi</HeaderCell>
                <HeaderCell className="text-right">Kecepatan</HeaderCell>
                <HeaderCell className="text-right">Debit</HeaderCell>
                <HeaderCell>Status</HeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, i) => (
                <TableRow key={`${d.timestamp}-${i}`} className="border-border/50">
                  <TableCell className="px-3 font-mono">{d.time}</TableCell>
                  <TableCell className="px-3 text-right font-mono">{d.level.toFixed(2)} m</TableCell>
                  <TableCell className="px-3 text-right font-mono">{d.velocity.toFixed(2)} m/d</TableCell>
                  <TableCell className="px-3 text-right font-mono">{d.discharge.toFixed(2)} m³/d</TableCell>
                  <TableCell className="px-3">
                    <StatusPill status={d.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Tidak ada data yang cocok dengan filter
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-sidebar-border p-3 font-mono text-[11px] text-muted-foreground">
          Menampilkan {filtered.length} dari {data.length} data
        </div>
      </Card>
    </AppLayout>
  );
}

function HeaderCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <TableHead
      className={cn(
        "px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground",
        className,
      )}
    >
      {children}
    </TableHead>
  );
}

function StatusPill({ status }: { status: AlertLevel }) {
  const map: Record<AlertLevel, string> = {
    safe: "border-success text-success",
    standby: "border-warning text-warning",
    danger: "border-danger text-danger",
  };
  return (
    <span className={cn("border px-2 py-0.5 font-mono text-[10px]", map[status])}>
      {statusLabels[status]}
    </span>
  );
}
