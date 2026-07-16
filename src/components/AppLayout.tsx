import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

function useClock() {
  // Kosong saat render pertama agar tidak terjadi hydration mismatch di SSR
  const [clock, setClock] = useState("");
  useEffect(() => {
    const format = () => {
      const d = new Date();
      return (
        d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) +
        " · " +
        d.toTimeString().slice(0, 8)
      );
    };
    setClock(format());
    const id = setInterval(() => setClock(format()), 1000);
    return () => clearInterval(id);
  }, []);
  return clock;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const clock = useClock();

  return (
    <SidebarProvider style={{ "--sidebar-width": "220px" } as React.CSSProperties}>
      <div className="flex min-h-screen w-full bg-background bg-grid">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-15 shrink-0 items-center gap-4 border-b border-sidebar-border bg-sidebar/85 px-5 backdrop-blur-md">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-[15px] font-semibold leading-tight">{title}</h1>
              {subtitle && (
                <p className="truncate text-[11px] leading-tight text-muted-foreground">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              <div className="hidden items-center rounded-full border border-input px-3 py-1.25 font-mono text-[11px] text-muted-foreground sm:flex">
                <span>{clock || "—"}</span>
              </div>
              <div className="hidden items-center gap-1.5 rounded-full border border-success/40 bg-success/10 px-3 py-1.25 font-mono text-[11px] text-success sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-blink" />
                ESP32 ONLINE
              </div>
              <button
                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border border-input font-mono text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Notifikasi"
              >
                !
                <span className="absolute right-1.25 top-1.25 h-1.5 w-1.5 rounded-full bg-warning" />
              </button>
            </div>
          </header>
          <main className="min-w-0 flex-1 p-5">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
