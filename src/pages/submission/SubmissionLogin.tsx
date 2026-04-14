import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PortalHeader from "@/components/submission/PortalHeader";
import SEOHead from "@/components/SEOHead";

const SubmissionLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      setSubmitting(false);
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
      return;
    }

    // Check if user is approved
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_approved")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.is_approved) {
        await supabase.auth.signOut();
        setSubmitting(false);
        toast({
          title: "Account pending approval",
          description: "Your account is awaiting admin approval. You will be notified once approved.",
          variant: "destructive",
        });
        return;
      }
    }

    setSubmitting(false);
    toast({ title: "Welcome back!" });
    navigate("/submission/dashboard");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg border border-border shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Submission Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">Log in to submit or manage your manuscripts</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="you@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                {submitting ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                <Link to="/submission/forgot-password" className="text-link hover:underline font-medium">
                  Forgot your password?
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/submission/register" className="text-link hover:underline font-medium">
                  Register here
                </Link>
              </p>
              <p className="text-xs text-muted-foreground">
                New accounts require admin approval before you can submit manuscripts.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionLogin;
