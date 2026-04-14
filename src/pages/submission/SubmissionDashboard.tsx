import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, LogOut, Clock, CheckCircle, XCircle, Send, Eye } from "lucide-react";
import { useEffect } from "react";
import PortalHeader from "@/components/submission/PortalHeader";

const statusConfig: Record<string, { label: string; icon: any; color: string }> = {
  submitted: { label: "Submitted", icon: Send, color: "text-blue-600 bg-blue-50" },
  under_review: { label: "Under Review", icon: Eye, color: "text-amber-600 bg-amber-50" },
  revision_requested: { label: "Revision Requested", icon: Clock, color: "text-orange-600 bg-orange-50" },
  accepted: { label: "Accepted", icon: CheckCircle, color: "text-primary bg-primary/10" },
  rejected: { label: "Rejected", icon: XCircle, color: "text-destructive bg-destructive/10" },
  published: { label: "Published", icon: CheckCircle, color: "text-primary bg-primary/10" },
};

const SubmissionDashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/submission/login");
    }
  }, [user, loading, navigate]);

  // Check approval status
  const { data: profile } = useQuery({
    queryKey: ["submission-profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, is_approved")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Fetch user's submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["my-submissions", user?.id],
    enabled: !!user && !!profile?.is_approved,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, status, article_type, submitted_at, decided_at, decision")
        .eq("submitted_by", user!.id)
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await signOut();
    navigate("/submission/login");
  };

  if (loading || !user) return null;

  // Not approved
  if (profile && !profile.is_approved) {
    return (
      <div className="min-h-screen bg-muted/30 flex flex-col">
        <PortalHeader onLogout={handleLogout} userName={profile.first_name || user.email || ""} />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md text-center">
            <div className="bg-card rounded-lg border border-border shadow-sm p-8">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-xl font-heading font-bold text-foreground mb-2">Account Pending Approval</h1>
              <p className="text-sm text-muted-foreground">
                Your account is still awaiting admin approval. You will be able to submit manuscripts once approved.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader showLogout onLogout={handleLogout} userName={profile?.first_name || user.email || ""} showBackLink={false} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground">My Articles</h1>
          <Link
            to="/submission/new"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 sm:px-6 py-2.5 rounded text-xs sm:text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
          >
            Submit New Manuscript
          </Link>
        </div>

        {/* Submissions list */}
        {isLoading ? (
          <div className="border border-border rounded-lg p-8 bg-card text-center">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="border border-border rounded-lg p-16 bg-card text-center">
            <div className="w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-full h-full text-primary/60">
                <rect x="25" y="10" width="70" height="90" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="35" x2="80" y2="35" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="2" />
                <line x1="40" y1="65" x2="70" y2="65" stroke="currentColor" strokeWidth="2" />
                <path d="M55 0 L65 0 L65 20 L75 20 L60 35 L45 20 L55 20 Z" fill="currentColor" opacity="0.3" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground mb-3">Submit a Manuscript</h2>
            <p className="text-sm text-muted-foreground mb-2">
              You currently have no submissions.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Select <strong className="text-foreground">Submit New Manuscript</strong> to create your first submission.
            </p>
            <Link
              to="/submission/new"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
            >
              Submit New Manuscript
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden sm:block border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {submissions.map((sub: any) => {
                    const config = statusConfig[sub.status] || statusConfig.submitted;
                    const Icon = config.icon;
                    return (
                      <tr key={sub.id} className="hover:bg-muted/50 transition-colors bg-card">
                        <td className="py-3 px-4 font-medium text-foreground max-w-sm">{sub.title}</td>
                        <td className="py-3 px-4 text-muted-foreground">{sub.article_type}</td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${config.color}`}>
                            <Icon className="h-3 w-3" />
                            {config.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="sm:hidden space-y-3">
              {submissions.map((sub: any) => {
                const config = statusConfig[sub.status] || statusConfig.submitted;
                const Icon = config.icon;
                return (
                  <div key={sub.id} className="bg-card border border-border rounded-lg p-4 space-y-2">
                    <p className="font-medium text-foreground text-sm">{sub.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{sub.article_type}</span>
                      <span className="text-xs text-muted-foreground">
                        {sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${config.color}`}>
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SubmissionDashboard;
