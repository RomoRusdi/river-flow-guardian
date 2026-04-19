// Mock data generators for the PLTMH Banjar river monitoring system.
// Replace with real Supabase / MQTT integration when backend is connected.

export type AlertLevel = "safe" | "standby" | "danger";

export interface Reading {
  time: string;
  timestamp: number;
  level: number; // meters
  velocity: number; // m/s
  discharge: number; // m³/s
}

export interface Anomaly {
  id: string;
  time: string;
  severity: AlertLevel;
  message: string;
}

const RIVER_WIDTH = 4.2; // meters - used for discharge calc

export function computeDischarge(level: number, velocity: number) {
  // Simple Q = A * v approximation, A = width * level
  return +(RIVER_WIDTH * level * velocity).toFixed(2);
}

export function getAlertLevel(level: number): AlertLevel {
  if (level >= 6) return "danger";
  if (level >= 4.5) return "standby";
  return "safe";
}

export function generateHistory(points = 48): Reading[] {
  const now = Date.now();
  const out: Reading[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = now - i * 15 * 60 * 1000; // 15 min intervals
    const base = 3.2 + Math.sin(i / 6) * 1.1 + Math.random() * 0.4;
    const level = +Math.max(0.5, Math.min(7.5, base)).toFixed(2);
    const velocity = +(0.8 + Math.sin(i / 4) * 0.5 + Math.random() * 0.25).toFixed(2);
    const d = new Date(t);
    out.push({
      timestamp: t,
      time: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
      level,
      velocity,
      discharge: computeDischarge(level, velocity),
    });
  }
  return out;
}

export function generatePrediction(last: Reading, hours = 12): Reading[] {
  const out: Reading[] = [];
  let level = last.level;
  let velocity = last.velocity;
  for (let i = 1; i <= hours * 2; i++) {
    const t = last.timestamp + i * 30 * 60 * 1000;
    level = +Math.max(0.5, Math.min(7.8, level + (Math.random() - 0.45) * 0.25)).toFixed(2);
    velocity = +Math.max(0.2, Math.min(2.5, velocity + (Math.random() - 0.5) * 0.12)).toFixed(2);
    const d = new Date(t);
    out.push({
      timestamp: t,
      time: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
      level,
      velocity,
      discharge: computeDischarge(level, velocity),
    });
  }
  return out;
}

export const mockAnomalies: Anomaly[] = [
  { id: "a1", time: "10 min ago", severity: "standby", message: "Rapid water level rise detected (+0.4m / 15min)" },
  { id: "a2", time: "42 min ago", severity: "safe", message: "Sensor calibration completed successfully" },
  { id: "a3", time: "1h 15min ago", severity: "standby", message: "Flow velocity exceeds seasonal average" },
  { id: "a4", time: "3h ago", severity: "danger", message: "Upstream rainfall pattern matches flood precursor" },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Operator" | "Viewer";
  status: "Active" | "Inactive";
  lastLogin: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Budi Santoso", email: "budi@pltmh-banjar.id", role: "Admin", status: "Active", lastLogin: "2 min ago" },
  { id: "u2", name: "Siti Rahmawati", email: "siti@pltmh-banjar.id", role: "Operator", status: "Active", lastLogin: "1 hour ago" },
  { id: "u3", name: "Agus Pranoto", email: "agus@pltmh-banjar.id", role: "Operator", status: "Active", lastLogin: "Yesterday" },
  { id: "u4", name: "Dewi Lestari", email: "dewi@pltmh-banjar.id", role: "Viewer", status: "Inactive", lastLogin: "3 days ago" },
];
