import { Card } from "@/components/ui/card";
import { Anomaly } from "@/lib/mockData";
import { AlertTriangle, CheckCircle2, Siren, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const sevConfig = {
  safe: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10 border-success/20" },
  standby: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10 border-warning/20" },
  danger: { icon: Siren, color: "text-danger", bg: "bg-danger/10 border-danger/20" },
};

export function AnomalyPanel({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <Card className="border-border/60 p-5 shadow-elevated">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold">AI Anomaly Detection</h3>
          <p className="text-xs text-muted-foreground">Recent events flagged by ML model</p>
        </div>
      </div>
      <div className="space-y-2">
        {anomalies.map((a) => {
          const c = sevConfig[a.severity];
          const Icon = c.icon;
          return (
            <div key={a.id} className={cn("flex items-start gap-3 rounded-lg border p-3", c.bg)}>
              <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", c.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug">{a.message}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
