import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import JournalLayout from "@/components/JournalLayout";
import { Bell, CheckCircle, Info, AlertTriangle, Mail, Check, Trash2 } from "lucide-react";

const iconMap: Record<string, any> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  email: Mail,
};

const colorMap: Record<string, string> = {
  success: "text-primary bg-primary/10",
  info: "text-blue-600 bg-blue-50",
  warning: "text-amber-600 bg-amber-50",
  email: "text-violet-600 bg-violet-50",
};

const NotificationsPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("user-notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, queryClient]);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  if (!loading && !user) {
    return (
      <JournalLayout showJournalNav={false}>
        <section className="container mx-auto px-4 py-16 text-center">
          <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground mb-6">Please log in to view your notifications.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90"
          >
            Log in
          </button>
        </section>
      </JournalLayout>
    );
  }

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Notifications", active: true },
      ]}
    >
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
                <Bell className="h-6 w-6" />
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-2.5 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {notifications.length === 0 ? "No notifications yet" : `${notifications.length} total · ${unreadCount} unread`}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                <Check className="h-4 w-4" />
                Mark all read
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="border border-border rounded-lg p-12 bg-card text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-heading font-bold text-foreground mb-2">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You'll receive notifications here when there are updates to your account, submissions, or editorial activities.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((n: any) => {
                const Icon = iconMap[n.type] || Info;
                const colorClass = colorMap[n.type] || colorMap.info;
                return (
                  <div
                    key={n.id}
                    className={`border rounded-lg p-4 transition-colors cursor-pointer ${
                      n.is_read
                        ? "border-border bg-card hover:bg-muted/50"
                        : "border-primary/20 bg-primary/5 hover:bg-primary/10"
                    }`}
                    onClick={() => {
                      if (!n.is_read) markReadMutation.mutate(n.id);
                      if (n.link) navigate(n.link);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-sm font-semibold ${n.is_read ? "text-foreground" : "text-foreground"}`}>
                            {n.title}
                          </h3>
                          {!n.is_read && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(n.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </JournalLayout>
  );
};

export default NotificationsPage;
