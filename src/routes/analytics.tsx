import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { MonitoringChart } from "@/components/MonitoringChart";
import { generateHistory, generatePrediction } from "@/lib/mockData";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "AI Analytics — PLTMH Banjar" },
      { name: "description", content: "Prediksi berbasis LSTM untuk ketinggian air sungai dan kecepatan aliran selama 6-12 jam ke depan." },
    ],
  }),
  component: AnalyticsPage,
});

const modelStats = [
  { value: "94.2%", label: "Accuracy" },
  { value: "0.18m", label: "MAE" },
  { value: "42ms", label: "Latency" },
];

const features = [
  { name: "Curah hujan hulu (6 jam)", pct: 34 },
  { name: "Tinggi air saat ini", pct: 27 },
  { name: "Jam dalam sehari", pct: 16 },
  { name: "Kekuatan tanah", pct: 13 },
  { name: "Arah angin", pct: 10 },
];

const insights = [
  {
    marker: "text-primary",
    body: (
      <>
        Ketinggian air puncak diprediksi <strong className="font-medium text-foreground">5.8 m</strong> dalam
        ~4 jam — ambang Standby.
      </>
    ),
  },
  {
    marker: "text-warning",
    body: (
      <>
        Peluang melampaui ambang Bahaya (≥6m) dalam 12 jam:{" "}
        <strong className="font-medium text-warning">22%</strong>.
      </>
    ),
  },
  {
    marker: "text-success",
    body: (
      <>
        Rekomendasi turbin:{" "}
        <strong className="font-medium text-foreground">pertahankan kapasitas 85%</strong> untuk 6 jam
        ke depan.
      </>
    ),
  },
  {
    marker: "text-primary",
    body: (
      <>
        Pelatihan model terakhir: <strong className="font-medium text-foreground">3 hari lalu</strong> ·
        jadwal berikutnya 4 hari.
      </>
    ),
  },
];

function AnalyticsPage() {
  const [history] = useState(() => generateHistory(24));
  const [predictions] = useState(() => generatePrediction(history[history.length - 1], 12));

  return (
    <AppLayout title="AI Analytics" subtitle="Prediksi LSTM · horizon 6-12 jam">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between gap-4 rounded-[18px] border border-primary/40 bg-primary/6 p-4">
          <div className="flex min-w-65 flex-1 items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] border-2 border-primary font-mono font-bold text-primary">
              AI
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold">Model LSTM</h2>
                <span className="rounded border border-success/40 px-2 py-0.5 font-mono text-[9px] font-bold text-success">
                  ACTIVE
                </span>
              </div>
              <p className="mt-1.5 max-w-120 text-xs text-muted-foreground">
                Dilatih dari data sensor &amp; curah hujan historis 18 bulan. Prediksi ketinggian air
                &amp; kecepatan aliran, granularitas 30 menit untuk 12 jam ke depan.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {modelStats.map((s) => (
              <div key={s.label} className="self-start rounded-xl border border-border px-3.5 py-2 text-center">
                <div className="font-mono text-[15px] font-bold">{s.value}</div>
                <div className="text-[9px] uppercase text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <MonitoringChart
          data={history}
          predictions={predictions}
          title="Prakiraan 12 Jam Ke Depan"
          description="solid = observed · dashed = predicted"
        />

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
            <h4 className="mb-2.5 text-[13px] font-semibold">Fitur Berkontribusi Utama</h4>
            <div className="flex flex-col gap-2.5">
              {features.map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>{f.name}</span>
                    <span className="font-mono text-foreground">{f.pct}%</span>
                  </div>
                  <div className="mt-1 h-1.25 bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${f.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
            <h4 className="mb-2.5 text-[13px] font-semibold">Model Insights</h4>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              {insights.map((ins, i) => (
                <li key={i} className="flex gap-2">
                  <span className={ins.marker}>▸</span>
                  <span>{ins.body}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
