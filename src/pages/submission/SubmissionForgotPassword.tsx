import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, FileText, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PortalHeader from "@/components/submission/PortalHeader";

const SubmissionForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg border border-border shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Reset your password</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your email and we'll send you a reset link.
              </p>
            </div>

            {sent ? (
              <div className="text-center space-y-4">
                <div className="bg-primary/10 text-primary rounded-lg p-6">
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm mt-1">We've sent a password reset link to <strong>{email}</strong>.</p>
                </div>
                <Link to="/submission/login" className="inline-flex items-center gap-2 text-sm text-link hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Back to login
                </Link>
              </div>
            ) : (
              <>
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
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send reset link"}
                  </button>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-6">
                  <Link to="/submission/login" className="text-link hover:underline font-medium">
                    <ArrowLeft className="inline h-3 w-3 mr-1" />Back to login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionForgotPassword;
