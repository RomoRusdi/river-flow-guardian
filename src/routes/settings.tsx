import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Radio, Database } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — PLTMH Banjar" },
      { name: "description", content: "Configure thresholds, integrations and notification preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppLayout title="Settings" subtitle="Thresholds · Integrations · Notifications">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card className="border-border/60 p-5 shadow-elevated">
          <h3 className="text-base font-semibold">Alert Thresholds</h3>
          <p className="text-xs text-muted-foreground">Define water level boundaries for the EWS system.</p>
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Standby threshold (m)</Label>
                <Input type="number" step="0.1" defaultValue={4.5} />
              </div>
              <div>
                <Label>Danger threshold (m)</Label>
                <Input type="number" step="0.1" defaultValue={6.0} />
              </div>
            </div>
            <div>
              <Label>River cross-section width (m)</Label>
              <Input type="number" step="0.1" defaultValue={4.2} />
            </div>
            <Button className="w-full">Save thresholds</Button>
          </div>
        </Card>

        <Card className="border-border/60 p-5 shadow-elevated">
          <h3 className="text-base font-semibold">Notifications</h3>
          <p className="text-xs text-muted-foreground">Where to send alerts when EWS triggers.</p>
          <div className="mt-4 space-y-4">
            <Toggle label="Email alerts" desc="Send to all admins on Standby+" defaultChecked />
            <Toggle label="WhatsApp / SMS" desc="Critical (Danger) alerts only" defaultChecked />
            <Toggle label="Push notifications" desc="Browser & mobile clients" />
            <Toggle label="Telegram bot" desc="Send to operations channel" defaultChecked />
          </div>
        </Card>

        <Card className="border-border/60 p-5 shadow-elevated lg:col-span-2">
          <h3 className="text-base font-semibold">Backend Integrations</h3>
          <p className="text-xs text-muted-foreground">Connect time-series storage and the live device telemetry stream.</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            <IntegrationCard icon={Database} title="Supabase" desc="PostgreSQL time-series" status="Ready" />
            <IntegrationCard icon={Radio} title="MQTT Broker" desc="WebSocket bridge" status="Ready" />
            <IntegrationCard icon={Cloud} title="Cloud Storage" desc="Long-term archival" status="Disabled" />
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function IntegrationCard({ icon: Icon, title, desc, status }: { icon: typeof Cloud; title: string; desc: string; status: string }) {
  const ready = status === "Ready";
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <Badge variant="outline" className={ready ? "border-success/40 bg-success/10 text-success" : "border-muted-foreground/30 bg-muted/40 text-muted-foreground"}>{status}</Badge>
      </div>
      <h4 className="mt-3 text-sm font-semibold">{title}</h4>
      <p className="text-xs text-muted-foreground">{desc}</p>
      <Button variant="outline" size="sm" className="mt-3 w-full">Configure</Button>
    </div>
  );
}
