import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  variant?: "primary" | "success" | "warning" | "danger";
  trend?: number;
  max?: number;
  children?: ReactNode;
}

const variantStyles = {
  primary: { bg: "bg-gradient-water", iconBg: "bg-primary/15 text-primary", bar: "bg-primary" },
  success: { bg: "bg-gradient-success", iconBg: "bg-success/15 text-success", bar: "bg-success" },
  warning: { bg: "bg-gradient-warning", iconBg: "bg-warning/15 text-warning", bar: "bg-warning" },
  danger: { bg: "bg-gradient-danger", iconBg: "bg-danger/15 text-danger", bar: "bg-danger" },
};

export function KpiCard({ label, value, unit, icon: Icon, variant = "primary", trend, max, children }: KpiCardProps) {
  const styles = variantStyles[variant];
  const pct = max ? Math.min(100, (Number(value) / max) * 100) : null;

  return (
    <Card className={cn("relative overflow-hidden border-border/60 p-5 shadow-elevated", styles.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tabular-nums tracking-tight md:text-4xl">{value}</span>
            <span className="text-sm font-medium text-muted-foreground">{unit}</span>
          </div>
          {trend !== undefined && (
            <div className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trend >= 0 ? "text-success" : "text-danger")}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}% vs 1h ago
            </div>
          )}
        </div>
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", styles.iconBg)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {pct !== null && (
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span>0</span>
            <span>Max {max} {unit}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all duration-500", styles.bar)} style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}
      {children}
    </Card>
  );
}
