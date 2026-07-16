import { Card } from "@/components/ui/card";
import { AlertLevel } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface WaterGaugeProps {
  level: number;
  status: AlertLevel;
  max?: number;
  standbyThreshold?: number;
  dangerThreshold?: number;
}

const statusStyles: Record<AlertLevel, { text: string; fill: string }> = {
  safe: { text: "text-success", fill: "bg-success" },
  standby: { text: "text-warning", fill: "bg-warning" },
  danger: { text: "text-danger", fill: "bg-danger" },
};

export function WaterGauge({
  level,
  status,
  max = 8,
  standbyThreshold = 4.5,
  dangerThreshold = 6,
}: WaterGaugeProps) {
  const s = statusStyles[status];
  const fillPct = Math.min(100, (level / max) * 100);
  const ticks = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <Card className="flex flex-col items-center rounded-2xl border-border bg-card p-4 shadow-elevated">
      <h3 className="self-start text-[13px] font-semibold">Gauge Ketinggian Air</h3>
      <p className="mb-3.5 self-start text-[11px] text-muted-foreground">Skala 0–{max} meter</p>
      <div className="flex gap-2.5">
        <div className="flex h-55 flex-col-reverse justify-between font-mono text-[9px] text-muted-foreground/80">
          {ticks.map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>
        <div className="relative h-55 w-14 overflow-hidden rounded-[26px] border border-input bg-inset">
          <div
            className="absolute inset-x-0 border-t border-dashed border-warning"
            style={{ top: `${100 - (standbyThreshold / max) * 100}%` }}
          />
          <div
            className="absolute inset-x-0 border-t border-dashed border-danger"
            style={{ top: `${100 - (dangerThreshold / max) * 100}%` }}
          />
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 transition-[height] duration-600 ease-in-out",
              s.fill,
            )}
            style={{ height: `${fillPct}%` }}
          />
        </div>
      </div>
      <div className={cn("mt-3.5 font-mono text-[26px] font-bold", s.text)}>
        {level.toFixed(2)}
        <span className="text-[13px] font-normal text-muted-foreground"> m</span>
      </div>
    </Card>
  );
}
