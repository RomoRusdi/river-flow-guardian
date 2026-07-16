import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { code: "DB", title: "Dashboard", url: "/" },
  { code: "AN", title: "AI Analytics", url: "/analytics" },
  { code: "HI", title: "Riwayat", url: "/history" },
  { code: "US", title: "Pengguna", url: "/users" },
  { code: "SE", title: "Pengaturan", url: "/settings" },
] as const;

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-0">
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border-2 border-primary font-mono text-[11px] font-bold text-primary">
            PB
          </div>
          <div>
            <div className="font-mono text-xs font-bold tracking-[0.08em] leading-tight">
              PLTMH BANJAR
            </div>
            <div className="text-[10px] uppercase tracking-[0.06em] text-muted-foreground leading-tight">
              River Guard System
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-2.5 py-3.5">
          <SidebarGroupLabel className="px-2.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/80">
            Operasional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const active = path === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "gap-2.5 rounded-[10px] px-2.5 py-2.25 text-xs text-muted-foreground border border-transparent",
                        active &&
                          "border-primary/40 bg-primary/12 text-foreground data-[active=true]:bg-primary/12 data-[active=true]:text-foreground",
                      )}
                    >
                      <Link to={item.url}>
                        <span
                          className={cn(
                            "rounded px-1.25 py-px font-mono text-[9px] font-bold border",
                            active
                              ? "border-primary text-primary"
                              : "border-muted-foreground/50 text-muted-foreground/80",
                          )}
                        >
                          {item.code}
                        </span>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-0">
        <div className="flex items-center gap-2 px-4 py-3.5">
          <span className="h-1.75 w-1.75 rounded-full bg-success animate-blink" />
          <span className="font-mono text-[10px] tracking-[0.04em] text-muted-foreground">
            SISTEM AKTIF · v2.0
          </span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
