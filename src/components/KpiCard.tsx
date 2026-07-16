import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit: string;
  variant?: "primary" | "success" | "warning" | "danger";
  trend?: number;
  max: number;
}

const variantStyles = {
  primary: { text: "text-primary", bar: "bg-primary" },
  success: { text: "text-success", bar: "bg-success" },
  warning: { text: "text-warning", bar: "bg-warning" },
  danger: { text: "text-danger", bar: "bg-danger" },
};

export function KpiCard({ label, value, unit, variant = "primary", trend, max }: KpiCardProps) {
  const styles = variantStyles[variant];
  const pct = Math.min(100, (Number(value) / max) * 100);

  return (
    <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {trend !== undefined && (
          <span
            className={cn(
              "font-mono text-[10px]",
              trend >= 0 ? "text-success" : "text-danger",
            )}
          >
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5 font-mono">
        <span className={cn("text-[32px] font-bold leading-none", styles.text)}>{value}</span>
        <span className="text-[13px] text-muted-foreground">{unit}</span>
      </div>
      <div className="mt-3 h-1.25 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full transition-all duration-500", styles.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.25 flex justify-between font-mono text-[9px] text-muted-foreground/80">
        <span>0</span>
        <span>
          MAX {max} {unit}
        </span>
      </div>
    </Card>
  );
}
