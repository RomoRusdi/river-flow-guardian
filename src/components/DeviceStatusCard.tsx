import { Card } from "@/components/ui/card";
import { Cpu, Signal, Battery, Radio } from "lucide-react";

export function DeviceStatusCard() {
  return (
    <Card className="border-border/60 p-5 shadow-elevated">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">ESP32 WROOM-32U</h3>
            <p className="text-xs text-muted-foreground">Field Gateway · ID: PLTMH-BJR-01</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-ring" />
          <span className="text-xs font-medium text-success">Online</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Signal} label="Signal" value="-62 dBm" sub="Excellent" />
        <Stat icon={Battery} label="Power" value="12.4 V" sub="Solar +" />
        <Stat icon={Radio} label="MQTT" value="1.2k/min" sub="Stable" />
      </div>
    </Card>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Signal; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{sub}</div>
    </div>
  );
}
