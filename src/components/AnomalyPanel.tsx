import { Card } from "@/components/ui/card";
import { Anomaly } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const sevBorder = {
  safe: "border-l-success",
  standby: "border-l-warning",
  danger: "border-l-danger",
};

export function AnomalyPanel({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
      <h3 className="text-[13px] font-semibold">AI Anomaly Detection</h3>
      <p className="mb-2.5 text-[11px] text-muted-foreground">
        Peristiwa terbaru ditandai oleh model ML
      </p>
      <div className="flex flex-col gap-1.5">
        {anomalies.map((a) => (
          <div
            key={a.id}
            className={cn("border-l-2 bg-inset p-2 pl-2.5", sevBorder[a.severity])}
          >
            <p className="text-xs leading-snug">{a.message}</p>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/90">{a.time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
