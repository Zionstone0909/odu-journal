import { useState } from "react";
import JournalLayout from "@/components/JournalLayout";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Building, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { COUNTRIES } from "@/lib/countries";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [institution, setInstitution] = useState("");
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [marketingOptOut, setMarketingOptOut] = useState(false);
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
      marketing_opt_out: marketingOptOut,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      navigate("/");
    }
  };

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Register", active: true },
      ]}
    >
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8">
            <UserPlus className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Create an account</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Register to submit articles, save preferences, and receive alerts
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-destructive">*</span> fields are required
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  First name <span className="text-destructive">*</span>
                </label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  className="w-full px-3 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Email */}
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
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="you@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Institution */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Institution / Affiliation <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="University or organization"
                />
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Country / Region <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                >
                  <option value="">Select a Country/Region</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* State / Province */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                County / State / Province <span className="text-destructive">*</span>
              </label>
              <input
                value={stateProvince}
                onChange={(e) => setStateProvince(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Password */}
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
                  className="w-full pl-10 pr-4 py-2.5 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Info text */}
            <div className="bg-muted/50 rounded p-3 text-xs text-muted-foreground space-y-2">
              <p>
                We use the details you share here to create an account for you.
              </p>
              <p>
                We would also like to use your e-mail address to send you offers and information
                about related products and services. This can include tips and resources on how to
                get published, and offers to access a wider range of content that we think will be
                of interest to you.
              </p>
              <p>
                You may opt out of receiving these messages at any time by clicking unsubscribe.
                You can find more information in our{" "}
                <Link to="/privacy-policy" className="text-link hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            {/* Marketing opt-out */}
            <div>
              <label className="flex items-start gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={marketingOptOut}
                  onChange={(e) => setMarketingOptOut(e.target.checked)}
                  className="rounded border-border mt-0.5"
                />
                <span>
                  If you do not want to receive resources and offers from us, please tick the box.
                </span>
              </label>
            </div>

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="rounded border-border mt-0.5"
                />
                <span>
                  I agree to{" "}
                  <Link to="/terms" className="text-link hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  <span className="text-destructive">*</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-link hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </section>
    </JournalLayout>
  );
};

export default RegisterPage;
