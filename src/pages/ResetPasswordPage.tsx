import { useState, useEffect } from "react";
import JournalLayout from "@/components/JournalLayout";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check for recovery event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated successfully!" });
      navigate("/login");
    }
  };

  if (!ready) {
    return (
      <JournalLayout showJournalNav={false}>
        <section className="container mx-auto px-4 py-16 text-center">
          <p className="text-muted-foreground">Verifying your reset link...</p>
        </section>
      </JournalLayout>
    );
  }

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Reset Password", active: true },
      ]}
    >
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Lock className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Set new password</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your new password below.</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm new password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </section>
    </JournalLayout>
  );
};

export default ResetPasswordPage;
