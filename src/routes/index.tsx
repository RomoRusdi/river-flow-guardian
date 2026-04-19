import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/KpiCard";
import { AlertBanner } from "@/components/AlertBanner";
import { MonitoringChart } from "@/components/MonitoringChart";
import { AnomalyPanel } from "@/components/AnomalyPanel";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { generateHistory, getAlertLevel, mockAnomalies, computeDischarge } from "@/lib/mockData";
import { Droplets, Wind, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — PLTMH Banjar River Monitoring" },
      { name: "description", content: "Real-time IoT dashboard monitoring water level, flow velocity, and discharge for the PLTMH Banjar micro-hydro power plant." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState(() => generateHistory());

  useEffect(() => {
    const id = setInterval(() => {
      setData((prev) => {
        const last = prev[prev.length - 1];
        const newLevel = +Math.max(0.5, Math.min(7.8, last.level + (Math.random() - 0.5) * 0.3)).toFixed(2);
        const newVel = +Math.max(0.2, Math.min(2.5, last.velocity + (Math.random() - 0.5) * 0.15)).toFixed(2);
        const now = new Date();
        const next = {
          timestamp: Date.now(),
          time: `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`,
          level: newLevel,
          velocity: newVel,
          discharge: computeDischarge(newLevel, newVel),
        };
        return [...prev.slice(1), next];
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const latest = data[data.length - 1];
  const prev = data[data.length - 5] ?? data[0];
  const level = getAlertLevel(latest.level);
  const trendLevel = +(((latest.level - prev.level) / prev.level) * 100).toFixed(1);
  const trendVel = +(((latest.velocity - prev.velocity) / prev.velocity) * 100).toFixed(1);
  const trendDis = +(((latest.discharge - prev.discharge) / prev.discharge) * 100).toFixed(1);

  return (
    <AppLayout title="Live Dashboard" subtitle="PLTMH Banjar · Real-time river monitoring">
      <div className="space-y-5">
        <AlertBanner level={level} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <KpiCard label="Water Level" value={latest.level.toFixed(2)} unit="m" icon={Droplets} variant={level === "danger" ? "danger" : level === "standby" ? "warning" : "primary"} trend={trendLevel} max={8} />
          <KpiCard label="Flow Velocity" value={latest.velocity.toFixed(2)} unit="m/s" icon={Wind} variant="success" trend={trendVel} max={3} />
          <KpiCard label="Discharge (Debit)" value={latest.discharge.toFixed(2)} unit="m³/s" icon={Activity} variant="primary" trend={trendDis} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <MonitoringChart data={data} description="Last 12 hours · 15-minute resolution · Auto-refresh 4s" />
          </div>
          <div className="space-y-4">
            <DeviceStatusCard />
            <AnomalyPanel anomalies={mockAnomalies} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
