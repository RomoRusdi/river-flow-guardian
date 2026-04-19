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
      { name: "description", content: "Random Forest based predictions for river water level and flow velocity over the next 6-12 hours." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const history = generateHistory(24);
  const predictions = generatePrediction(history[history.length - 1], 12);

  return (
    <AppLayout title="AI Analytics" subtitle="Random Forest predictions · 6-12h forecast horizon">
      <div className="space-y-5">
        <Card className="border-border/60 bg-gradient-water p-5 shadow-elevated">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold">Random Forest Predictor</h2>
                  <Badge variant="outline" className="border-success/40 bg-success/10 text-success">Active</Badge>
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  Trained on 18 months of historical sensor + rainfall data. Predicts water level and flow velocity with 30-min granularity for the next 12 hours.
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

        <MonitoringChart data={history} predictions={predictions} title="Forecast: Next 12 hours" description="Solid = observed · Dashed = predicted" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="border-border/60 p-5 shadow-elevated">
            <h4 className="text-sm font-semibold">Top Contributing Features</h4>
            <div className="mt-3 space-y-3">
              {[
                { name: "Upstream rainfall (6h)", weight: 0.34 },
                { name: "Current water level", weight: 0.27 },
                { name: "Hour of day", weight: 0.16 },
                { name: "Soil saturation", weight: 0.13 },
                { name: "Wind direction", weight: 0.1 },
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
                Predicted peak water level of <span className="font-medium text-foreground">5.8 m</span> in approximately <span className="font-medium text-foreground">4 hours</span> — within Standby threshold.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                Probability of breaching Danger threshold (≥6 m) in next 12h: <span className="font-medium text-warning">22%</span>.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                Recommended turbine operation: <span className="font-medium text-foreground">Maintain 85% capacity</span> for next 6 hours.
              </li>
              <li className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Last model retrain: <span className="font-medium text-foreground">3 days ago</span> · Next scheduled: 4 days.
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
