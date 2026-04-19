import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generateHistory, getAlertLevel } from "@/lib/mockData";
import { Download, Search, FileSpreadsheet } from "lucide-react";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Historical Data — PLTMH Banjar" },
      { name: "description", content: "Search, filter and export historical sensor readings from the river monitoring system." },
    ],
  }),
  component: HistoryPage,
});

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
    const header = "Time,Level (m),Velocity (m/s),Discharge (m³/s),Status\n";
    const rows = filtered.map((d) => `${d.time},${d.level},${d.velocity},${d.discharge},${d.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pltmh-banjar-history-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout title="Historical Data" subtitle="Browse, filter & export sensor readings">
      <Card className="border-border/60 shadow-elevated">
        <div className="flex flex-wrap items-center gap-3 border-b border-border/60 p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by time (e.g. 14:30)" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="safe">Safe only</SelectItem>
              <SelectItem value="standby">Standby only</SelectItem>
              <SelectItem value="danger">Danger only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button onClick={exportCSV}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export Excel</Button>
        </div>

        <div className="max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Water Level</TableHead>
                <TableHead className="text-right">Velocity</TableHead>
                <TableHead className="text-right">Discharge</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d, i) => (
                <TableRow key={`${d.timestamp}-${i}`}>
                  <TableCell className="font-mono text-xs">{d.time}</TableCell>
                  <TableCell className="text-right tabular-nums">{d.level.toFixed(2)} m</TableCell>
                  <TableCell className="text-right tabular-nums">{d.velocity.toFixed(2)} m/s</TableCell>
                  <TableCell className="text-right tabular-nums">{d.discharge.toFixed(2)} m³/s</TableCell>
                  <TableCell>
                    <StatusBadge status={d.status} />
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No records match your filters</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="border-t border-border/60 p-3 text-xs text-muted-foreground">Showing {filtered.length} of {data.length} records</div>
      </Card>
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    safe: { cls: "border-success/40 bg-success/10 text-success", label: "Safe" },
    standby: { cls: "border-warning/40 bg-warning/10 text-warning", label: "Standby" },
    danger: { cls: "border-danger/40 bg-danger/10 text-danger", label: "Danger" },
  };
  const c = map[status];
  return <Badge variant="outline" className={c.cls}>{c.label}</Badge>;
}
