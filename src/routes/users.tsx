import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockUsers, User } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "User Management — PLTMH Banjar" },
      { name: "description", content: "Admin-only user management untuk platform pemantauan PLTMH Banjar." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const save = (u: User) => {
    setUsers((prev) => (prev.find((p) => p.id === u.id) ? prev.map((p) => (p.id === u.id ? u : p)) : [...prev, u]));
    setOpen(false);
    setEditing(null);
  };

  const remove = (id: string) => setUsers((prev) => prev.filter((p) => p.id !== id));

  return (
    <AppLayout title="User Management" subtitle="Admin-only · kelola akses & peran">
      <Card className="rounded-2xl border-border bg-card shadow-elevated">
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-sidebar-border p-3.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono">{users.length} PENGGUNA</span>
            <span className="border border-primary/40 px-2 py-0.5 font-mono text-[9px] text-primary">
              AKSES ADMIN
            </span>
          </div>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)} className="rounded-[10px] font-mono text-xs font-semibold">
                + TAMBAH USER
              </Button>
            </DialogTrigger>
            <UserDialog key={editing?.id ?? "new"} user={editing} onSave={save} onCancel={() => setOpen(false)} />
          </Dialog>
        </div>

        <div className="overflow-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="border-sidebar-border hover:bg-transparent">
                <HeaderCell>Nama</HeaderCell>
                <HeaderCell>Email</HeaderCell>
                <HeaderCell>Role</HeaderCell>
                <HeaderCell>Status</HeaderCell>
                <HeaderCell className="text-right">Aksi</HeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} className="border-border/50">
                  <TableCell className="px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6.5 w-6.5 items-center justify-center rounded-full border border-primary/50 font-mono text-[10px] font-bold text-primary">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-3 font-mono text-[11px] text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="px-3">
                    <Pill className={u.role === "Admin" ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"}>
                      {u.role}
                    </Pill>
                  </TableCell>
                  <TableCell className="px-3">
                    <Pill className={u.status === "Active" ? "border-success text-success" : "border-muted-foreground/60 text-muted-foreground/80"}>
                      {u.status}
                    </Pill>
                  </TableCell>
                  <TableCell className="px-3 text-right">
                    <div className="inline-flex gap-1">
                      <ActionButton className="text-primary" onClick={() => { setEditing(u); setOpen(true); }}>
                        EDIT
                      </ActionButton>
                      <ActionButton className="text-danger" onClick={() => remove(u.id)}>
                        HAPUS
                      </ActionButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppLayout>
  );
}

function HeaderCell({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <TableHead className={cn("px-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground", className)}>
      {children}
    </TableHead>
  );
}

function Pill({ className, children }: { className?: string; children: React.ReactNode }) {
  return <span className={cn("border px-2 py-0.5 font-mono text-[10px]", className)}>{children}</span>;
}

function ActionButton({ className, onClick, children }: { className?: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border border-input bg-transparent px-2 py-1 font-mono text-[10px] transition-colors hover:bg-accent",
        className,
      )}
    >
      {children}
    </button>
  );
}

function UserDialog({ user, onSave, onCancel }: { user: User | null; onSave: (u: User) => void; onCancel: () => void }) {
  const [form, setForm] = useState<User>(
    user ?? { id: `u${Date.now()}`, name: "", email: "", role: "Viewer", status: "Active", lastLogin: "Never" },
  );
  return (
    <DialogContent className="max-w-100 sm:max-w-100 rounded-[20px] border-primary/40 bg-card">
      <DialogHeader>
        <DialogTitle className="text-sm font-semibold">
          {user ? "Edit User" : "Tambah User Baru"}
        </DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-2.5">
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Nama</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 rounded-lg border-input bg-inset text-xs"
          />
        </div>
        <div>
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 rounded-lg border-input bg-inset text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
              <SelectTrigger className="mt-1 w-full rounded-lg border-input bg-inset text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as User["status"] })}>
              <SelectTrigger className="mt-1 w-full rounded-lg border-input bg-inset text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel} className="rounded-[10px] border-input bg-transparent text-xs">
          Batal
        </Button>
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.email} className="rounded-[10px] text-xs font-semibold">
          Simpan
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
