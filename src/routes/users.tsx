import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { mockUsers, User } from "@/lib/mockData";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "User Management — PLTMH Banjar" },
      { name: "description", content: "Admin-only user management for the PLTMH Banjar monitoring platform." },
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
    <AppLayout title="User Management" subtitle="Admin-only · Manage system access & roles">
      <Card className="border-border/60 shadow-elevated">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{users.length} users</span>
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">Admin Access</Badge>
          </div>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}><Plus className="mr-2 h-4 w-4" /> New User</Button>
            </DialogTrigger>
            <UserDialog user={editing} onSave={save} />
          </Dialog>
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {u.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell><Badge variant="outline" className={u.role === "Admin" ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/50"}>{u.role}</Badge></TableCell>
                  <TableCell>
                    <Badge variant="outline" className={u.status === "Active" ? "border-success/40 bg-success/10 text-success" : "border-muted-foreground/30 bg-muted/40 text-muted-foreground"}>{u.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{u.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => { setEditing(u); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(u.id)}><Trash2 className="h-4 w-4 text-danger" /></Button>
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

function UserDialog({ user, onSave }: { user: User | null; onSave: (u: User) => void }) {
  const [form, setForm] = useState<User>(
    user ?? { id: `u${Date.now()}`, name: "", email: "", role: "Viewer", status: "Active", lastLogin: "Never" }
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{user ? "Edit user" : "Create new user"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-3">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Operator">Operator</SelectItem>
                <SelectItem value="Viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as User["status"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => onSave(form)} disabled={!form.name || !form.email}>{user ? "Save changes" : "Create user"}</Button>
      </DialogFooter>
    </DialogContent>
  );
}
