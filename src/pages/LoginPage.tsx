import { useState } from "react";
import JournalLayout from "@/components/JournalLayout";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
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
    setSubmitting(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
    }
  };

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Login", active: true },
      ]}
    >
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <User className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Log in</h1>
            <p className="text-sm text-muted-foreground mt-2">Access your account to manage submissions and preferences</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email address</label>
              <div className="relative">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="you@example.com" />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <div className="relative">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {submitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/forgot-password" className="text-link hover:underline font-medium">Forgot your password?</Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Don't have an account? <Link to="/register" className="text-link hover:underline font-medium">Register</Link>
          </p>
        </div>
      </section>
    </JournalLayout>
  );
};

export default LoginPage;
