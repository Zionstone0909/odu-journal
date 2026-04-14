import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Users, FileText, Shield, ShieldAlert, Edit, Trash2, Lock, Unlock, UserCheck, UserX, CheckCircle, Clock, Plus, Mail, X, Send, Upload, Library } from "lucide-react";

type AppRole = "admin" | "editor" | "reviewer" | "publisher";

const AdminDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"users" | "articles" | "approvals" | "bulk-upload" | "board-members" | "journals">("users");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>("publisher");
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardEmail, setNewBoardEmail] = useState("");
  const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
  const [editBoardEmail, setEditBoardEmail] = useState("");
  const [newJournal, setNewJournal] = useState({ title: "", issn: "", subject_category: "General", description: "", publisher: "", impact_factor: "" });
  const [csvUploading, setCsvUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || role !== "admin")) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

  // Fetch all users with roles
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    enabled: role === "admin",
    queryFn: async () => {
      const { data: roles, error: rErr } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rErr) throw rErr;

      const userIds = roles?.map((r: any) => r.user_id) || [];
      if (userIds.length === 0) return [];

      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email, institution, created_at, is_approved, country")
        .in("id", userIds);
      if (pErr) throw pErr;

      return (profiles || []).map((p: any) => ({
        ...p,
        role: roles?.find((r: any) => r.user_id === p.id)?.role || "publisher",
      }));
    },
  });

  // Fetch all articles
  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles"],
    enabled: role === "admin",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Fetch editorial board members
  const { data: boardMembers = [] } = useQuery({
    queryKey: ["editorial-board-members"],
    enabled: role === "admin",
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;

      // Cross-reference with profiles to check registration status
      const emails = (data || []).map((m: any) => m.email).filter(Boolean);
      let registeredEmails: string[] = [];
      if (emails.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("email")
          .in("email", emails);
        registeredEmails = (profiles || []).map((p: any) => p.email?.toLowerCase());
      }

      return (data || []).map((m: any) => ({
        ...m,
        registration_status: !m.email ? "no_email" : registeredEmails.includes(m.email.toLowerCase()) ? "registered" : "pending",
      }));
    },
  });

  // Fetch journals
  const { data: journals = [] } = useQuery({
    queryKey: ["admin-journals"],
    enabled: role === "admin",
    queryFn: async () => {
      const { data, error } = await supabase.from("journals").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });
  // Pending users
  const pendingUsers = users.filter((u: any) => !u.is_approved);
  const approvedUsers = users.filter((u: any) => u.is_approved);

  const editorCount = users.filter((u: any) => u.role === "editor").length;
  const adminCount = users.filter((u: any) => u.role === "admin").length;

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: AppRole }) => {
      if (newRole === "editor" && editorCount >= 20) throw new Error("Maximum 20 editors allowed");
      if (newRole === "admin" && adminCount >= 1 && !users.find((u: any) => u.id === userId && u.role === "admin")) {
        throw new Error("Maximum 1 admin allowed");
      }
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Role updated" });
      setEditingRole(null);
    },
    onError: (err: any) => {
      toast({ title: "Failed to update role", description: err.message, variant: "destructive" });
    },
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: true, approved_at: new Date().toISOString(), approved_by: user!.id })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User approved", description: "The user can now submit manuscripts." });
    },
    onError: (err: any) => {
      toast({ title: "Failed to approve user", description: err.message, variant: "destructive" });
    },
  });

  // Reject (delete) user mutation
  const rejectUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_approved: false })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "User registration rejected" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to reject user", description: err.message, variant: "destructive" });
    },
  });

  // Toggle article lock
  const toggleLockMutation = useMutation({
    mutationFn: async ({ id, is_locked }: { id: string; is_locked: boolean }) => {
      const { error } = await supabase.from("articles").update({ is_locked }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Article access updated" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to update", description: err.message, variant: "destructive" });
    },
  });

  // Delete article
  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      toast({ title: "Article deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Failed to delete", description: err.message, variant: "destructive" });
    },
  });

  // Add board member
  const addBoardMemberMutation = useMutation({
    mutationFn: async ({ full_name, email }: { full_name: string; email: string }) => {
      const { error } = await supabase.from("editorial_board_members").insert({ full_name, email: email || null, role: "editor" as any });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board-members"] });
      toast({ title: "Board member added" });
      setNewBoardName("");
      setNewBoardEmail("");
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Invite editor by email
  const inviteEditorMutation = useMutation({
    mutationFn: async ({ email, full_name }: { email: string; full_name: string }) => {
      const { data, error } = await supabase.functions.invoke("invite-editor", {
        body: { email, full_name },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: "Invitation sent!", description: "The editor will receive an email to set their password." });
    },
    onError: (err: any) => toast({ title: "Failed to send invite", description: err.message, variant: "destructive" }),
  });

  // Update board member email
  const updateBoardEmailMutation = useMutation({
    mutationFn: async ({ id, email }: { id: string; email: string }) => {
      const { error } = await supabase.from("editorial_board_members").update({ email: email || null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board-members"] });
      toast({ title: "Email updated" });
      setEditingBoardId(null);
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Delete board member
  const deleteBoardMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("editorial_board_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board-members"] });
      toast({ title: "Board member removed" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Add journal
  const addJournalMutation = useMutation({
    mutationFn: async (journal: { title: string; issn?: string; subject_category: string; description?: string; publisher?: string; impact_factor?: number | null }) => {
      const { error } = await supabase.from("journals").insert(journal);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journals"] });
      toast({ title: "Journal added" });
      setNewJournal({ title: "", issn: "", subject_category: "General", description: "", publisher: "", impact_factor: "" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Delete journal
  const deleteJournalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("journals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-journals"] });
      toast({ title: "Journal deleted" });
    },
    onError: (err: any) => toast({ title: "Failed", description: err.message, variant: "destructive" }),
  });

  // Parse a single CSV line respecting quoted fields
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') { current += '"'; i++; }
        else if (ch === '"') { inQuotes = false; }
        else { current += ch; }
      } else {
        if (ch === '"') { inQuotes = true; }
        else if (ch === ',') { result.push(current.trim()); current = ""; }
        else { current += ch; }
      }
    }
    result.push(current.trim());
    return result;
  };

  // CSV upload handler
  const handleJournalCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvUploading(true);
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) throw new Error("CSV must have a header row and at least one data row");
      const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z_]/g, ""));
      const titleIdx = headers.indexOf("title");
      if (titleIdx === -1) throw new Error("CSV must have a 'title' column");
      const issnIdx = headers.indexOf("issn");
      const catIdx = headers.findIndex(h => h.includes("subject") || h.includes("category"));
      const descIdx = headers.indexOf("description");
      const pubIdx = headers.indexOf("publisher");
      const ifIdx = headers.findIndex(h => h.includes("impact"));

      const rows = lines.slice(1).map(line => {
        const cols = parseCsvLine(line);
        return {
          title: cols[titleIdx],
          issn: issnIdx >= 0 ? cols[issnIdx] || null : null,
          subject_category: catIdx >= 0 ? cols[catIdx] || "General" : "General",
          description: descIdx >= 0 ? cols[descIdx] || null : null,
          publisher: pubIdx >= 0 ? cols[pubIdx] || null : null,
          impact_factor: ifIdx >= 0 && cols[ifIdx] ? parseFloat(cols[ifIdx]) || null : null,
        };
      }).filter(r => r.title);

      const { error } = await supabase.from("journals").insert(rows);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-journals"] });
      toast({ title: `${rows.length} journals imported` });
    } catch (err: any) {
      toast({ title: "CSV import failed", description: err.message, variant: "destructive" });
    } finally {
      setCsvUploading(false);
      e.target.value = "";
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          <AdminSidebar activeTab={activeTab} onTabChange={(tab) => {
            if (tab === "bulk-upload") { navigate("/admin/bulk-upload"); return; }
            setActiveTab(tab);
          }} />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-12 flex items-center border-b border-border px-4 bg-card">
              <SidebarTrigger className="mr-3" />
              <h1 className="text-sm font-heading font-bold text-foreground">Admin Dashboard</h1>
              {pendingUsers.length > 0 && activeTab !== "approvals" && (
                <button
                  onClick={() => setActiveTab("approvals")}
                  className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded text-xs font-semibold"
                >
                  <Clock className="h-3 w-3" />
                  {pendingUsers.length} pending approval{pendingUsers.length > 1 ? "s" : ""}
                </button>
              )}
            </header>
            <main className="flex-1 p-6 overflow-auto">
              {/* APPROVALS TAB */}
              {activeTab === "approvals" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">User Approvals</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Review and approve new user registrations. {pendingUsers.length} pending.
                    </p>
                  </div>

                  {pendingUsers.length === 0 ? (
                    <div className="border border-border rounded-lg p-12 bg-card text-center">
                      <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                      <h3 className="text-lg font-heading font-bold text-foreground mb-2">All caught up!</h3>
                      <p className="text-sm text-muted-foreground">No pending registrations to review.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingUsers.map((u: any) => (
                        <div key={u.id} className="border border-border rounded-lg p-5 bg-card">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-heading font-bold text-foreground">
                                {u.first_name} {u.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                              <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                                {u.institution && (
                                  <span>🏛️ {u.institution}</span>
                                )}
                                {u.country && (
                                  <span>🌍 {u.country}</span>
                                )}
                                <span>📅 Registered {new Date(u.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button
                                onClick={() => approveUserMutation.mutate(u.id)}
                                disabled={approveUserMutation.isPending}
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                              >
                                <UserCheck className="h-4 w-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => { if (confirm("Reject this registration?")) rejectUserMutation.mutate(u.id); }}
                                disabled={rejectUserMutation.isPending}
                                className="flex items-center gap-1.5 px-4 py-2 border border-destructive/30 text-destructive rounded text-sm font-medium hover:bg-destructive/10 transition-colors disabled:opacity-50"
                              >
                                <UserX className="h-4 w-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">User Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage users and assign roles. Editors: {editorCount}/20 · Admins: {adminCount}/1
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(["admin", "editor", "reviewer", "publisher"] as AppRole[]).map((r) => (
                      <div key={r} className="border border-border rounded-lg p-4 bg-card">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            r === "admin" ? "bg-destructive/10 text-destructive" :
                            r === "editor" ? "bg-amber-50 text-amber-600" :
                            r === "reviewer" ? "bg-blue-50 text-blue-600" :
                            "bg-secondary/10 text-secondary"
                          }`}>
                            {r === "admin" ? <ShieldAlert className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-foreground">
                              {users.filter((u: any) => u.role === r).length}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">{r}s</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {users.map((u: any) => (
                          <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">
                              {u.first_name} {u.last_name}
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                            <td className="py-3 px-4">
                              {u.is_approved ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                  <CheckCircle className="h-3 w-3" /> Approved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                                  <Clock className="h-3 w-3" /> Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {editingRole === u.id ? (
                                <select
                                  value={selectedRole}
                                  onChange={(e) => setSelectedRole(e.target.value as AppRole)}
                                  className="border border-border rounded px-2 py-1 text-xs bg-card"
                                >
                                  <option value="publisher">Publisher</option>
                                  <option value="reviewer">Reviewer</option>
                                  <option value="editor">Editor</option>
                                  <option value="admin">Admin</option>
                                </select>
                              ) : (
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                  u.role === "admin" ? "bg-destructive/10 text-destructive" :
                                  u.role === "editor" ? "bg-amber-50 text-amber-700" :
                                  u.role === "reviewer" ? "bg-blue-50 text-blue-700" :
                                  "bg-secondary/10 text-secondary"
                                }`}>
                                  {u.role}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {u.id === user?.id ? (
                                <span className="text-xs text-muted-foreground">You</span>
                              ) : editingRole === u.id ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => updateRoleMutation.mutate({ userId: u.id, newRole: selectedRole })}
                                    className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:opacity-90"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => setEditingRole(null)}
                                    className="px-3 py-1 border border-border rounded text-xs text-foreground hover:bg-muted"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => { setEditingRole(u.id); setSelectedRole(u.role); }}
                                  className="flex items-center gap-1 px-3 py-1 border border-border rounded text-xs text-foreground hover:bg-muted"
                                >
                                  <Edit className="h-3 w-3" /> Change Role
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ARTICLES TAB */}
              {activeTab === "articles" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Article Access Control</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage which articles are locked behind paywall
                    </p>
                  </div>

                  {articles.length === 0 ? (
                    <div className="border border-border rounded-lg p-8 bg-card text-center">
                      <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No articles yet</p>
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Authors</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Access</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Price</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {articles.map((a: any) => (
                            <tr key={a.id} className="hover:bg-muted/50 transition-colors">
                              <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">{a.title}</td>
                              <td className="py-3 px-4 text-muted-foreground">{a.authors}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${
                                  a.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {a.is_locked ? (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-destructive">
                                    <Lock className="h-3 w-3" /> Locked
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary">
                                    <Unlock className="h-3 w-3" /> Open
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-muted-foreground">
                                {a.is_locked ? `$${((a.price_cents || 0) / 100).toFixed(2)}` : "Free"}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => toggleLockMutation.mutate({ id: a.id, is_locked: !a.is_locked })}
                                    className="flex items-center gap-1 px-3 py-1 border border-border rounded text-xs text-foreground hover:bg-muted"
                                  >
                                    {a.is_locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                    {a.is_locked ? "Unlock" : "Lock"}
                                  </button>
                                  <button
                                    onClick={() => { if (confirm("Delete this article?")) deleteArticleMutation.mutate(a.id); }}
                                    className="flex items-center gap-1 px-3 py-1 border border-destructive/30 rounded text-xs text-destructive hover:bg-destructive/10"
                                  >
                                    <Trash2 className="h-3 w-3" /> Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* BOARD MEMBERS TAB */}
              {activeTab === "board-members" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Editorial Board Members</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add email addresses for board members so they automatically get the <strong>Editor</strong> role when they register.
                    </p>
                  </div>

                  {/* Add new member */}
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <h3 className="text-sm font-heading font-bold text-foreground mb-3">Add Board Member</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newBoardName.trim()) return;
                        addBoardMemberMutation.mutate({ full_name: newBoardName.trim(), email: newBoardEmail.trim() });
                      }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="text"
                        value={newBoardName}
                        onChange={(e) => setNewBoardName(e.target.value)}
                        placeholder="Full name"
                        required
                        className="flex-1 px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <input
                        type="email"
                        value={newBoardEmail}
                        onChange={(e) => setNewBoardEmail(e.target.value)}
                        placeholder="Email (for auto-role on registration)"
                        className="flex-1 px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                      <button
                        type="submit"
                        disabled={addBoardMemberMutation.isPending}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    </form>
                  </div>

                  {/* List */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {boardMembers.map((m: any) => (
                          <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">{m.full_name}</td>
                            <td className="py-3 px-4">
                              {editingBoardId === m.id ? (
                                <div className="flex gap-2">
                                  <input
                                    type="email"
                                    value={editBoardEmail}
                                    onChange={(e) => setEditBoardEmail(e.target.value)}
                                    className="px-2 py-1 border border-border rounded text-xs bg-background w-48"
                                    placeholder="Enter email"
                                  />
                                  <button
                                    onClick={() => updateBoardEmailMutation.mutate({ id: m.id, email: editBoardEmail })}
                                    className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold"
                                  >
                                    Save
                                  </button>
                                  <button onClick={() => setEditingBoardId(null)} className="px-2 py-1 border border-border rounded text-xs">
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <span className={m.email ? "text-foreground" : "text-muted-foreground italic"}>
                                  {m.email || "No email set"}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {m.registration_status === "registered" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                  <CheckCircle className="h-3 w-3" /> Registered
                                </span>
                              ) : m.registration_status === "pending" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                                  <Clock className="h-3 w-3" /> Invited
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                  <Clock className="h-3 w-3" /> No email
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize bg-amber-50 text-amber-700">
                                {m.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2">
                                {editingBoardId !== m.id && (
                                  <button
                                    onClick={() => { setEditingBoardId(m.id); setEditBoardEmail(m.email || ""); }}
                                    className="flex items-center gap-1 px-3 py-1 border border-border rounded text-xs text-foreground hover:bg-muted"
                                  >
                                    <Mail className="h-3 w-3" /> Set Email
                                  </button>
                                )}
                                {m.email && editingBoardId !== m.id && (
                                  <button
                                    onClick={() => inviteEditorMutation.mutate({ email: m.email, full_name: m.full_name })}
                                    disabled={inviteEditorMutation.isPending}
                                    className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                                  >
                                    <Send className="h-3 w-3" /> Send Invite
                                  </button>
                                )}
                                <button
                                  onClick={() => { if (confirm("Remove this board member?")) deleteBoardMemberMutation.mutate(m.id); }}
                                  className="flex items-center gap-1 px-3 py-1 border border-destructive/30 rounded text-xs text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-3 w-3" /> Remove
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {boardMembers.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-muted-foreground">No board members added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* JOURNALS TAB */}
              {activeTab === "journals" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-heading font-bold text-foreground">Journal Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add, manage, and import journals. {journals.length} journal{journals.length !== 1 ? "s" : ""} registered.
                    </p>
                  </div>

                  {/* CSV Upload */}
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <h3 className="text-sm font-heading font-bold text-foreground mb-2">Import from CSV</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      CSV must have a <strong>title</strong> column. Optional columns: issn, subject_category, description, publisher, impact_factor.
                    </p>
                    <label className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded text-sm font-medium cursor-pointer hover:bg-muted transition-colors">
                      <Upload className="h-4 w-4" />
                      {csvUploading ? "Importing..." : "Upload CSV"}
                      <input type="file" accept=".csv" onChange={handleJournalCsvUpload} className="hidden" disabled={csvUploading} />
                    </label>
                  </div>

                  {/* Add journal form */}
                  <div className="border border-border rounded-lg p-4 bg-card">
                    <h3 className="text-sm font-heading font-bold text-foreground mb-3">Add Journal</h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newJournal.title.trim()) return;
                        addJournalMutation.mutate({
                          title: newJournal.title.trim(),
                          issn: newJournal.issn.trim() || undefined,
                          subject_category: newJournal.subject_category || "General",
                          description: newJournal.description.trim() || undefined,
                          publisher: newJournal.publisher.trim() || undefined,
                          impact_factor: newJournal.impact_factor ? parseFloat(newJournal.impact_factor) : null,
                        });
                      }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    >
                      <input type="text" value={newJournal.title} onChange={(e) => setNewJournal(p => ({ ...p, title: e.target.value }))} placeholder="Journal title *" required className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={newJournal.issn} onChange={(e) => setNewJournal(p => ({ ...p, issn: e.target.value }))} placeholder="ISSN" className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={newJournal.subject_category} onChange={(e) => setNewJournal(p => ({ ...p, subject_category: e.target.value }))} placeholder="Subject category" className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={newJournal.publisher} onChange={(e) => setNewJournal(p => ({ ...p, publisher: e.target.value }))} placeholder="Publisher" className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={newJournal.impact_factor} onChange={(e) => setNewJournal(p => ({ ...p, impact_factor: e.target.value }))} placeholder="Impact factor" className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <input type="text" value={newJournal.description} onChange={(e) => setNewJournal(p => ({ ...p, description: e.target.value }))} placeholder="Description" className="px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
                      <div className="md:col-span-3">
                        <button type="submit" disabled={addJournalMutation.isPending} className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 disabled:opacity-50">
                          <Plus className="h-4 w-4" /> Add Journal
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Journals list */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">ISSN</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Publisher</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">IF</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {journals.map((j: any) => (
                          <tr key={j.id} className="hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4 font-medium text-foreground">{j.title}</td>
                            <td className="py-3 px-4 text-muted-foreground">{j.issn || "—"}</td>
                            <td className="py-3 px-4 text-muted-foreground">{j.subject_category}</td>
                            <td className="py-3 px-4 text-muted-foreground">{j.publisher || "—"}</td>
                            <td className="py-3 px-4 text-muted-foreground">{j.impact_factor ?? "—"}</td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => { if (confirm("Delete this journal?")) deleteJournalMutation.mutate(j.id); }}
                                className="flex items-center gap-1 px-3 py-1 border border-destructive/30 rounded text-xs text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3 w-3" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                        {journals.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-muted-foreground">No journals added yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>
      <SiteFooter />
    </div>
  );
};

export default AdminDashboard;
