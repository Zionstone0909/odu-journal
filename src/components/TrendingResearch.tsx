import { FileText, Lock, Unlock } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const trendingArticles = [
  {
    type: "Research Article",
    title: "Language Shift and Maintenance in Urban Yoruba Communities: A Sociolinguistic Analysis",
    authors: "Adeyemi, O. & Balogun, T.",
    date: "8 Feb 2026",
    is_locked: false,
    access: "Open Access",
  },
  {
    type: "Research Article",
    title: "Postcolonial Governance Structures in Francophone West Africa: Continuity and Change",
    authors: "Diallo, M. & Konaté, S.",
    date: "15 Feb 2026",
    is_locked: true,
    access: "Paid",
    price_cents: 1500,
  },
  {
    type: "Review Article",
    title: "Traditional Medicine Practices Among the Igbo: A Contemporary Analysis of Efficacy and Integration",
    authors: "Okafor, C.N.",
    date: "2 Mar 2026",
    is_locked: false,
    access: "Free Access",
  },
  {
    type: "Research Article",
    title: "Fully 3D-Printed Agricultural Tools: Innovation in West African Smallholder Farming",
    authors: "Traoré, A. & Mensah, K.",
    date: "16 Feb 2026",
    is_locked: true,
    access: "Paid",
    price_cents: 1200,
  },
];

const TrendingResearch = () => {
  const { user } = useAuth();

  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Trending research</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trendingArticles.map((article, i) => (
          <article key={i} className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-secondary uppercase">{article.type}</span>
                  {article.is_locked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                      <Lock className="h-3 w-3" /> Paid
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                      article.access === "Open Access"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      <Unlock className="h-3 w-3" /> {article.access}
                    </span>
                  )}
                </div>
                <h3 className="font-heading font-bold text-sm text-foreground mt-1 hover:text-primary cursor-pointer transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-2">{article.authors}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Published online: {article.date}</span>
                </div>
                {article.is_locked && (
                  <div className="mt-2">
                    {user ? (
                      <button className="inline-flex items-center gap-1 bg-cta text-cta-foreground px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                        <Lock className="h-3 w-3" />
                        Purchase — ₦{((article.price_cents || 0) / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                      </button>
                    ) : (
                      <Link to="/login" className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                        <Lock className="h-3 w-3" />
                        Login to download
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrendingResearch;
