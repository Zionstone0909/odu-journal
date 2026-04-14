import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Calendar, FileText, Lock, Unlock } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { useAuth } from "@/contexts/AuthContext";

const fallbackArticles = [
  { title: "Language Shift and Maintenance in Urban Yoruba Communities", authors: "Adeyemi, O. & Balogun, T.", date: "March 2026", type: "Research Article", doi: "10.xxxx/odu.2026.001", is_locked: false, access_type: "Open Access" },
  { title: "Postcolonial Governance Structures in Francophone West Africa", authors: "Diallo, M. & Konaté, S.", date: "March 2026", type: "Research Article", doi: "10.xxxx/odu.2026.002", is_locked: true, access_type: "Paid", price_cents: 1500 },
  { title: "Traditional Medicine Practices Among the Igbo: A Contemporary Analysis", authors: "Okafor, C.N.", date: "March 2026", type: "Review Article", doi: "10.xxxx/odu.2026.003", is_locked: true, access_type: "Paid", price_cents: 1200 },
  { title: "Impact of Climate Change on Agricultural Practices in the Sahel Region", authors: "Traoré, A. & Mensah, K.", date: "March 2026", type: "Research Article", doi: "10.xxxx/odu.2026.004", is_locked: false, access_type: "Open Access" },
  { title: "Music as Political Resistance in Ghanaian History", authors: "Asante, K.B.", date: "March 2026", type: "Short Communication", doi: "10.xxxx/odu.2026.005", is_locked: true, access_type: "Paid", price_cents: 999 },
];

const BrowseIssues = () => {
  const { data: dbArticles } = useArticles();
  const { user } = useAuth();

  return (
    <JournalLayout>
      <SEOHead title="Current Issue" description="Browse the current issue of ODU: A Journal of West African Studies – latest research articles and reviews." path="/current-issue" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Current Issue" }]} />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Current Issue</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Volume 5, Issue 1 — March 2026</span>
              </div>
            </div>

            <div className="space-y-4">
              {(dbArticles && dbArticles.length > 0 ? dbArticles : []).map((article) => (
                <article key={article.id || article.title} className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-secondary uppercase">{article.article_type}</span>
                        {article.is_locked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                            <Lock className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                            <Unlock className="h-3 w-3" /> Open Access
                          </span>
                        )}
                      </div>
                      <Link to={`/article/${article.id}`}>
                        <h3 className="font-heading font-bold text-foreground mt-1 hover:text-primary cursor-pointer transition-colors">
                          {article.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">{article.authors}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Published: {article.published_date ? new Date(article.published_date).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : ""}</span>
                        {article.doi && <span>DOI: {article.doi}</span>}
                      </div>
                      {article.is_locked && (
                        <div className="mt-3">
                          {user ? (
                            <Link to={`/article/${article.id}`} className="inline-flex items-center gap-1.5 bg-cta text-cta-foreground px-4 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                              <Lock className="h-3 w-3" />
                              Purchase — ${((article.price_cents || 0) / 100).toFixed(2)}
                            </Link>
                          ) : (
                            <Link to="/login" className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-1.5 rounded text-xs font-semibold hover:opacity-90 transition-opacity">
                              <Lock className="h-3 w-3" />
                              Login to purchase
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
              {(!dbArticles || dbArticles.length === 0) && fallbackArticles.map((article, i) => (
                <article key={i} className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-secondary uppercase">{article.type}</span>
                        {article.is_locked ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                            <Lock className="h-3 w-3" /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-secondary/10 text-secondary">
                            <Unlock className="h-3 w-3" /> Open Access
                          </span>
                        )}
                      </div>
                      <h3 className="font-heading font-bold text-foreground mt-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{article.authors}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Published: {article.date}</span>
                        <span>DOI: {article.doi}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">All Issues</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  "Vol 5, Issue 1 (2026)", "Vol 4, Issue 2 (2025)", "Vol 4, Issue 1 (2025)",
                  "Vol 3, Issue 2 (2024)", "Vol 3, Issue 1 (2024)", "Vol 2, Issue 2 (2023)",
                  "Vol 2, Issue 1 (2023)", "Vol 1, Issue 2 (2022)", "Vol 1, Issue 1 (2022)",
                ].map((issue) => (
                  <Link key={issue} to="#" className="p-3 border border-border rounded text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                    {issue}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <JournalSidebar />
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default BrowseIssues;
