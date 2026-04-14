import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const OpenAccessPromo = () => {
  return (
    <section className="py-10 bg-primary/5 rounded-lg px-6 my-8">
      <Link to="/open-access" className="text-xl font-heading font-bold text-primary hover:underline">
        ODU open access journals and publishing
      </Link>
      <p className="text-sm text-muted-foreground mt-2 max-w-xl">
        Explore our growing portfolio of fully open access journals and learn about our open access publishing options.
      </p>
      <Link to="/open-access" className="inline-flex items-center gap-1.5 text-sm text-link font-medium hover:underline mt-3">
        Learn more <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </section>
  );
};

export default OpenAccessPromo;
