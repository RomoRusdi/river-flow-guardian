import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { KpiCard } from "@/components/KpiCard";
import { AlertBanner } from "@/components/AlertBanner";
import { MonitoringChart } from "@/components/MonitoringChart";
import { WaterGauge } from "@/components/WaterGauge";
import { AnomalyPanel } from "@/components/AnomalyPanel";
import { DeviceStatusCard } from "@/components/DeviceStatusCard";
import { generateHistory, getAlertLevel, mockAnomalies, computeDischarge } from "@/lib/mockData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Pemantauan Sungai PLTMH Banjar" },
      { name: "description", content: "Dashboard IoT real-time untuk memantau ketinggian air, kecepatan aliran, dan debit untuk pembangkit listrik mikrohidro PLTMH Banjar." },
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
    <AppLayout title="Dashboard Real-time" subtitle="PLTMH Banjar · Pemantauan sungai real-time">
      <div className="flex flex-col gap-4">
        <AlertBanner level={level} />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3.5">
          <KpiCard
            label="Tinggi Air"
            value={latest.level.toFixed(2)}
            unit="m"
            variant={level === "danger" ? "danger" : level === "standby" ? "warning" : "primary"}
            trend={trendLevel}
            max={8}
          />
          <KpiCard label="Kecepatan Aliran" value={latest.velocity.toFixed(2)} unit="m/d" variant="success" trend={trendVel} max={3} />
          <KpiCard label="Debit Air" value={latest.discharge.toFixed(2)} unit="m³/d" variant="primary" trend={trendDis} max={20} />
        </div>

        <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
          <MonitoringChart data={data} description="12 jam terakhir · auto-refresh 4 detik" />
          <WaterGauge level={latest.level} status={level} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5">
          <DeviceStatusCard />
          <AnomalyPanel anomalies={mockAnomalies} />
        </div>
      </div>
    </AppLayout>
  );
}
