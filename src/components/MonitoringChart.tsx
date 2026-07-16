import { Card } from "@/components/ui/card";
import { Reading } from "@/lib/mockData";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
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
  standbyThreshold?: number;
  dangerThreshold?: number;
}

const COLORS = {
  level: "oklch(0.75 0.15 200)",
  velocity: "oklch(0.72 0.16 155)",
  predicted: "oklch(0.78 0.15 80)",
  danger: "oklch(0.62 0.22 25)",
  grid: "oklch(0.22 0.02 250 / 0.6)",
  tick: "oklch(0.5 0.02 250)",
};

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="inline-block h-2 w-2" style={{ background: color }} />
      {label}
    </span>
  );
}

export function MonitoringChart({
  data,
  predictions,
  title = "Grafik Pemantauan Real-time",
  description,
  standbyThreshold = 4.5,
  dangerThreshold = 6,
}: Props) {
  type ChartPoint = Omit<Reading, "level" | "velocity"> & {
    level: number | null;
    velocity: number | null;
    predLevel?: number | null;
  };

  const merged: ChartPoint[] = predictions
    ? [
        ...data.map((d, i) => ({
          ...d,
          // sambungkan garis solid & dashed di titik observasi terakhir
          predLevel: i === data.length - 1 ? d.level : null,
        })),
        ...predictions.map((d) => ({
          ...d,
          predLevel: d.level,
          level: null as number | null,
          velocity: null as number | null,
        })),
      ]
    : data;

  return (
    <Card className="min-w-0 rounded-2xl border-border bg-card p-4 shadow-elevated">
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {description && <p className="text-[11px] text-muted-foreground">{description}</p>}
        </div>
        <div className="flex gap-3 font-mono text-[10px] text-muted-foreground">
          <Swatch color={COLORS.level} label="Tinggi Air (m)" />
          {!predictions && <Swatch color={COLORS.velocity} label="Kecepatan (m/d)" />}
          {predictions && <Swatch color={COLORS.predicted} label="Prediksi" />}
        </div>
      </div>
      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={merged} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} vertical={false} />
            <XAxis
              dataKey="time"
              stroke={COLORS.tick}
              fontSize={9}
              fontFamily="IBM Plex Mono, monospace"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[0, 8]}
              stroke={COLORS.tick}
              fontSize={9}
              fontFamily="IBM Plex Mono, monospace"
              tickLine={false}
              axisLine={false}
            />
            <YAxis yAxisId="vel" domain={[0, 3]} hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.16 0.02 250)",
                border: "1px solid oklch(0.32 0.03 240 / 0.7)",
                borderRadius: 10,
                fontSize: 11,
                fontFamily: "IBM Plex Mono, monospace",
              }}
              labelStyle={{ color: "oklch(0.95 0.01 250)" }}
            />
            <ReferenceLine
              y={dangerThreshold}
              stroke={COLORS.danger}
              strokeDasharray="4 4"
              label={{ value: "Bahaya", fill: COLORS.danger, fontSize: 9, position: "insideTopRight" }}
            />
            <ReferenceLine
              y={standbyThreshold}
              stroke={COLORS.predicted}
              strokeDasharray="4 4"
              label={{ value: "Siaga", fill: COLORS.predicted, fontSize: 9, position: "insideTopRight" }}
            />
            <Area
              type="monotone"
              dataKey="level"
              name="Tinggi Air (m)"
              stroke={COLORS.level}
              strokeWidth={2}
              fill="oklch(0.75 0.15 200 / 0.12)"
              dot={false}
              isAnimationActive={false}
            />
            {!predictions && (
              <Line
                yAxisId="vel"
                type="monotone"
                dataKey="velocity"
                name="Kecepatan (m/d)"
                stroke={COLORS.velocity}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {predictions && (
              <Line
                type="monotone"
                dataKey="predLevel"
                name="Prediksi (m)"
                stroke={COLORS.predicted}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
