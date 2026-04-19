import { Card } from "@/components/ui/card";
import { Reading } from "@/lib/mockData";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";

interface Props {
  data: Reading[];
  predictions?: Reading[];
  title?: string;
  description?: string;
}

export function MonitoringChart({ data, predictions, title = "Real-time Monitoring", description }: Props) {
  const merged = predictions
    ? [
        ...data.map((d) => ({ ...d, predLevel: null as number | null, predVelocity: null as number | null })),
        ...predictions.map((d) => ({ ...d, predLevel: d.level, predVelocity: d.velocity, level: null as any, velocity: null as any })),
      ]
    : data;

  return (
    <Card className="border-border/60 p-5 shadow-elevated">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Water Level (m)</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Velocity (m/s)</span>
          {predictions && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Predicted</span>}
        </div>
      </div>
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={merged} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="lvl" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.68 0.18 235)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="oklch(0.68 0.18 235)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="vel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.7 0.17 152)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.7 0.17 152)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.025 252)" vertical={false} />
            <XAxis dataKey="time" stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="oklch(0.68 0.02 250)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.22 0.028 252)",
                border: "1px solid oklch(0.3 0.025 252)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.97 0.005 250)" }}
            />
            <ReferenceLine y={6} stroke="oklch(0.62 0.22 25)" strokeDasharray="4 4" label={{ value: "Danger", fill: "oklch(0.62 0.22 25)", fontSize: 10, position: "right" }} />
            <ReferenceLine y={4.5} stroke="oklch(0.78 0.16 85)" strokeDasharray="4 4" label={{ value: "Standby", fill: "oklch(0.78 0.16 85)", fontSize: 10, position: "right" }} />
            <Area type="monotone" dataKey="level" name="Level (m)" stroke="oklch(0.68 0.18 235)" strokeWidth={2} fill="url(#lvl)" />
            <Area type="monotone" dataKey="velocity" name="Velocity (m/s)" stroke="oklch(0.7 0.17 152)" strokeWidth={2} fill="url(#vel)" />
            {predictions && (
              <>
                <Line type="monotone" dataKey="predLevel" name="Pred. Level" stroke="oklch(0.78 0.16 85)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="predVelocity" name="Pred. Velocity" stroke="oklch(0.65 0.2 300)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </>
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
