import { ReactNode, useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Wifi, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  // Membaca status tema terakhir dari localStorage. Jika belum ada, default ke true (dark mode)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  });

  // Efek untuk menerapkan class dan menyimpan perubahan ke localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 flex-col">
              <h1 className="text-base font-semibold leading-tight md:text-lg">{title}</h1>
              {subtitle && <p className="text-xs text-muted-foreground leading-tight">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden gap-1.5 border-success/40 bg-success/10 text-success sm:inline-flex">
                <Wifi className="h-3 w-3" />
                ESP32 Aktif
              </Badge>
              
              {/* Tombol Tema Terang / Gelap */}
              <button 
                onClick={toggleTheme}
                className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Ubah Tema"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-warning" />
              </button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}