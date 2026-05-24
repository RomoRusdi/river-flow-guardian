import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { MonitoringChart } from "@/components/MonitoringChart";
import { generateHistory, generatePrediction } from "@/lib/mockData";
import { Brain, TrendingUp, Target, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "AI Analytics — PLTMH Banjar" },
      { name: "description", content: "Prediksi berbasis LSTM untuk ketinggian air sungai dan kecepatan aliran selama 6-12 jam ke depan." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const history = generateHistory(24);
  const predictions = generatePrediction(history[history.length - 1], 12);

  return (
    <AppLayout title="AI Analytics" subtitle="LSTM predictions · 6-12h forecast horizon">
      <div className="space-y-5">
        <Card className="border-border/60 bg-gradient-water p-5 shadow-elevated">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">LSTM</h2>
                  <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Active</Badge>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Dilatih menggunakan data sensor dan curah hujan historis selama 18 bulan. Memprediksi ketinggian air dan kecepatan aliran dengan granularitas 30 menit untuk 12 jam berikutnya.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <Metric icon={Target} label="Accuracy" value="94.2%" />
              <Metric icon={TrendingUp} label="MAE" value="0.18m" />
              <Metric icon={Zap} label="Latency" value="42ms" />
            </div>
          </div>
        </Card>

        <MonitoringChart data={history} predictions={predictions} title="Prakiraan cuaca: 12 jam ke depan" description="Solid = observed · Dashed = predicted" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-border/60 p-5 shadow-elevated">
            <h4 className="text-sm font-semibold">Fitur-Fitur yang Berkontribusi Utama</h4>
            <div className="mt-3 space-y-3">
              {[
                { name: "Curah hujan hulu (6 jam)", weight: 0.34 },
                { name: "Tinggi air saat ini", weight: 0.27 },
                { name: "Jam dalam sehari", weight: 0.16 },
                { name: "Kekuatan tanah", weight: 0.13 },
                { name: "Arah angin", weight: 0.1 },
              ].map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span className="tabular-nums font-medium">{(f.weight * 100).toFixed(0)}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${f.weight * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-border/60 p-5 shadow-elevated md:col-span-2">
            <h4 className="text-sm font-semibold">Model Insights</h4>
            <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Ketinggian air puncak yang diprediksi <span className="font-medium text-foreground">5.8 m</span> dalam waktu sekitar <span className="font-medium text-foreground">4 jam</span> — berada dalam ambang batas Standby.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                Kemungkinan melampaui ambang batas Bahaya (≥6 m) dalam 12 jam ke depan: <span className="font-medium text-warning">22%</span>.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Rekomendasi operasi turbin: <span className="font-medium text-foreground">Pertahankan kapasitas 85%</span> untuk 6 jam ke depan.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Pelatihan model terakhir: <span className="font-medium text-foreground">3 hari yang lalu</span> · Jadwal berikutnya: 4 hari.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof Brain; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/60 px-3 py-2">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <div className="mt-0.5 text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
