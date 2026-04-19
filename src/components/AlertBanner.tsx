import { AlertLevel } from "@/lib/mockData";
import { ShieldCheck, AlertTriangle, Siren } from "lucide-react";
import { cn } from "@/lib/utils";

const config = {
  safe: {
    icon: ShieldCheck,
    title: "Status: AMAN (Safe)",
    desc: "Water level and flow are within normal operating range. All systems nominal.",
    bg: "bg-gradient-success border-success/30",
    iconBg: "bg-success/20 text-success animate-pulse-ring",
    label: "SAFE",
    labelBg: "bg-success text-success-foreground",
  },
  standby: {
    icon: AlertTriangle,
    title: "Status: SIAGA (Standby)",
    desc: "Elevated water level detected. Monitor closely and prepare contingency procedures.",
    bg: "bg-gradient-warning border-warning/40",
    iconBg: "bg-warning/20 text-warning animate-pulse-ring-warn",
    label: "STANDBY",
    labelBg: "bg-warning text-warning-foreground",
  },
  danger: {
    icon: Siren,
    title: "Status: AWAS (Danger)",
    desc: "Critical threshold exceeded! Initiate emergency protocols immediately.",
    bg: "bg-gradient-danger border-danger/50",
    iconBg: "bg-danger/20 text-danger animate-pulse-ring-danger",
    label: "DANGER",
    labelBg: "bg-danger text-danger-foreground",
  },
};

export function AlertBanner({ level }: { level: AlertLevel }) {
  const c = config[level];
  const Icon = c.icon;
  return (
    <div className={cn("flex items-center gap-4 rounded-xl border p-4 shadow-elevated md:p-5", c.bg)}>
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-full", c.iconBg)}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">{c.title}</h3>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider", c.labelBg)}>{c.label}</span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">{c.desc}</p>
      </div>
    </div>
  );
}
