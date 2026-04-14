import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Building, Globe, FileText, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import PortalHeader from "@/components/submission/PortalHeader";
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES } from "@/lib/countries";

const SubmissionRegister = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      toast({ title: "Please agree to the Terms & Conditions", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (!country) {
      toast({ title: "Please select a country/region", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await signUp(email, password, {
      first_name: firstName,
      last_name: lastName,
      institution,
      country,
      state_province: stateProvince,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      navigate("/submission/pending");
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="bg-card rounded-lg border border-border shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <UserPlus className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Register for Submission Portal</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create an account to submit manuscripts. Admin approval is required.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-destructive">*</span> fields are required
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    First name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Last name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email address <span className="text-destructive">*</span>
                </label>
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
                <label className="block text-sm font-medium text-foreground mb-1">
                  Institution / Affiliation <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="University or organization"
                  />
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Country / Region <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                  >
                    <option value="">Select a Country/Region</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  County / State / Province <span className="text-destructive">*</span>
                </label>
                <input
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Confirm password <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-start gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="rounded border-border mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className="text-link hover:underline">Terms & Conditions</Link>{" "}
                    and{" "}
                    <Link to="/privacy-policy" className="text-link hover:underline">Privacy Policy</Link>{" "}
                    <span className="text-destructive">*</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Creating account..." : "Register"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/submission/login" className="text-link hover:underline font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionRegister;
