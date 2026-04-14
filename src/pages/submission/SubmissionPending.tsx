import { Link } from "react-router-dom";
import { Clock, FileText, CheckCircle, Mail } from "lucide-react";
import PortalHeader from "@/components/submission/PortalHeader";

const SubmissionPending = () => {
  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader />

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md text-center">
          <div className="bg-card rounded-lg border border-border shadow-sm p-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
              Registration Submitted
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Your account has been created and is now pending admin approval. You will receive an email
              notification once your account has been approved.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left space-y-3">
              <h3 className="text-sm font-semibold text-foreground">What happens next?</h3>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">Please verify your email address by clicking the link sent to your inbox</p>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">An administrator will review and approve your account</p>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">You'll be notified via email once approved</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to="/submission/login"
                className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Go to login
              </Link>
              <Link
                to="/"
                className="w-full border border-border text-foreground py-2.5 rounded text-sm font-medium hover:bg-muted transition-colors text-center"
              >
                Return to main site
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmissionPending;
