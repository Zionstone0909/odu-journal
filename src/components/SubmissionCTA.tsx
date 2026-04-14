import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const SubmissionCTA = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h3 className="text-lg font-bold font-heading text-foreground">Ready to submit?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Start a new submission or continue a submission in progress
        </p>
      </div>
      <Link
        to="/submission/login"
        className="flex items-center gap-2 border-2 border-foreground text-foreground px-5 py-2.5 rounded text-sm font-semibold hover:bg-foreground hover:text-background transition-colors whitespace-nowrap"
      >
        Go to submission site
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default SubmissionCTA;
