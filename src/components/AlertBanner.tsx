import { AlertLevel } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const config = {
  safe: {
    title: "STATUS: AMAN",
    desc: "Tinggi & aliran air dalam kisaran normal. Semua sistem beroperasi normal.",
    label: "SAFE",
    box: "border-success/50 bg-success/6",
    accent: "border-success text-success",
    pill: "bg-success text-success-foreground",
  },
  standby: {
    title: "STATUS: SIAGA",
    desc: "Peningkatan ketinggian air terdeteksi. Pantau ketat & siapkan prosedur darurat.",
    label: "STANDBY",
    box: "border-warning/50 bg-warning/6",
    accent: "border-warning text-warning",
    pill: "bg-warning text-warning-foreground",
  },
  danger: {
    title: "STATUS: BAHAYA",
    desc: "Batas kritis terlampaui! Mulai protokol darurat segera.",
    label: "DANGER",
    box: "border-danger/50 bg-danger/6",
    accent: "border-danger text-danger",
    pill: "bg-danger text-danger-foreground",
  },
};

export function AlertBanner({ level }: { level: AlertLevel }) {
  const c = config[level];
  return (
    <div
      className={cn(
        "flex items-center gap-3.5 rounded-[18px] border p-4 shadow-elevated",
        c.box,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border-2 font-mono text-base font-bold animate-blink",
          c.accent,
        )}
      >
        !
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-[15px] font-semibold">{c.title}</h3>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.75 font-mono text-[10px] font-bold tracking-widest",
              c.pill,
            )}
          >
            {c.label}
          </span>
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">{c.desc}</p>
      </div>
    </div>
  );
}
