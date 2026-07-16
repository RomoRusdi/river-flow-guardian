import { Card } from "@/components/ui/card";

const stats = [
  { label: "Signal", value: "-62 dBm" },
  { label: "Power", value: "12.4 V" },
  { label: "MQTT", value: "1.2k/min" },
];

export function DeviceStatusCard() {
  return (
    <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-[13px] font-semibold">ESP32 WROOM-32U</h3>
          <p className="text-[11px] text-muted-foreground">Field Gateway · ID: PLTMH-BJR-01</p>
        </div>
        <div className="flex items-center gap-1.25 rounded border border-success/40 px-2 py-1 font-mono text-[10px] text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          ONLINE
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-inset-border bg-inset p-2 text-center"
          >
            <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {s.label}
            </div>
            <div className="mt-1 font-mono text-[13px] font-semibold">{s.value}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
