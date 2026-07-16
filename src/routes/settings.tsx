import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PLTMH Banjar" },
      { name: "description", content: "Konfigurasi threshold, integrasi, dan preferensi notifikasi." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout title="Settings" subtitle="Threshold · Integrasi · Notifikasi">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-3.5">
        <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
          <h3 className="text-sm font-semibold">Threshold Peringatan</h3>
          <p className="mb-3 text-[11px] text-muted-foreground">Batas ketinggian air untuk sistem EWS</p>
          <div className="grid grid-cols-2 gap-2.5">
            <NumberField label="Siaga (m)" defaultValue={4.5} />
            <NumberField label="Bahaya (m)" defaultValue={6.0} />
          </div>
          <div className="mt-2.5">
            <NumberField label="Lebar Penampang Sungai (m)" defaultValue={4.2} />
          </div>
          <Button className="mt-3.5 w-full rounded-[10px] font-mono text-xs font-semibold">
            SIMPAN THRESHOLD
          </Button>
        </Card>

        <Card className="rounded-2xl border-border bg-card p-4 shadow-elevated">
          <h3 className="text-sm font-semibold">Notifikasi</h3>
          <p className="mb-3 text-[11px] text-muted-foreground">Kanal pengiriman peringatan EWS</p>
          <div className="flex flex-col gap-2">
            <Toggle label="Email alerts" desc="Kirim ke semua admin pada Standby+" defaultChecked />
            <Toggle label="WhatsApp / SMS" desc="Peringatan kritis (Bahaya) saja" defaultChecked />
            <Toggle label="Push notifications" desc="Browser & client mobile" />
            <Toggle label="Telegram bot" desc="Kirim ke channel operasional" defaultChecked />
          </div>
        </Card>

        <Card className="col-span-full rounded-2xl border-border bg-card p-4 shadow-elevated">
          <h3 className="text-sm font-semibold">Integrasi Backend</h3>
          <p className="mb-3 text-[11px] text-muted-foreground">
            Hubungkan penyimpanan time-series &amp; telemetri perangkat
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
            <IntegrationCard code="DB" title="Supabase" desc="PostgreSQL time-series" ready />
            <IntegrationCard code="RF" title="MQTT Broker" desc="WebSocket bridge" ready />
            <IntegrationCard code="CL" title="Cloud Storage" desc="Long-term archival" />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function NumberField({ label, defaultValue }: { label: string; defaultValue: number }) {
  return (
    <div>
      <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input
        type="number"
        step="0.1"
        defaultValue={defaultValue}
        className="mt-1 rounded-lg border-input bg-inset font-mono text-xs"
      />
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[10px] border border-inset-border bg-inset p-2.5">
      <div>
        <p className="text-xs font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function IntegrationCard({ code, title, desc, ready }: { code: string; title: string; desc: string; ready?: boolean }) {
  return (
    <div className="rounded-[10px] border border-inset-border bg-inset p-3.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px]">{code}</span>
        <span
          className={cn(
            "border px-1.5 py-0.5 font-mono text-[9px]",
            ready ? "border-success/40 text-success" : "border-muted-foreground/40 text-muted-foreground/80",
          )}
        >
          {ready ? "READY" : "DISABLED"}
        </span>
      </div>
      <div className="mt-2 text-[13px] font-semibold">{title}</div>
      <div className="text-[11px] text-muted-foreground">{desc}</div>
      <Button
        variant="outline"
        size="sm"
        className="mt-2.5 w-full rounded-lg border-input bg-transparent text-[11px]"
      >
        Configure
      </Button>
    </div>
  );
}
