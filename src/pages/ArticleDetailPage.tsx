import { useParams, Link } from "react-router-dom";
import JournalLayout from "@/components/JournalLayout";
import JournalOverview from "@/components/JournalOverview";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";
import { useArticleDetail } from "@/hooks/useArticleDetail";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText, Lock, Unlock, Download, BookOpen, BarChart3, Quote,
  Heart, Share2, ExternalLink, Users, Calendar, Hash
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { article, authors, citations, metrics, keywords, versions, isLoading, error } = useArticleDetail(id);
  const { user, hasPurchased } = useAuth();
  const [purchased, setPurchased] = useState(false);
  const isArchiveVolume = article?.article_type === "Archive Volume" || article?.article_type === "Book";
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  useEffect(() => {
    if (user && id) {
      hasPurchased(id).then(setPurchased);
      supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("article_id", id)
        .maybeSingle()
        .then(({ data }) => setIsFavorite(!!data));
    }
  }, [user, id]);

  const toggleFavorite = async () => {
    if (!user || !id) return;
    setLoadingFav(true);
    if (isFavorite) {
      await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("article_id", id);
      setIsFavorite(false);
      toast.success("Removed from favorites");
    } else {
      await supabase.from("user_favorites").insert({ user_id: user.id, article_id: id });
      setIsFavorite(true);
      toast.success("Added to favorites");
    }
    setLoadingFav(false);
  };

  const handlePurchaseClick = () => {
    if (!user || !id || !article) return;
    setShowPaymentDialog(true);
  };

  const handleConfirmPayment = async () => {
    if (!user || !id || !article) return;
    setConfirmingPayment(true);
    const { error } = await supabase.from("article_purchases").insert({
      user_id: user.id,
      article_id: id,
      amount_cents: article.price_cents || 0,
    });
    if (error) {
      toast.error("Failed to record purchase. Please try again.");
    } else {
      setPurchased(true);
      setShowPaymentDialog(false);
      toast.success("Payment confirmed! You now have full access.");
    }
    setConfirmingPayment(false);
  };

  const formatPrice = (cents: number) => {
    return `₦${(cents / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <JournalLayout>
        <div className="container mx-auto px-4 py-10 space-y-6">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
        </div>
      </JournalLayout>
    );
  }

  if (error || !article) {
    return (
      <JournalLayout>
        <div className="container mx-auto px-4 py-20 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Article Not Found</h1>
          <p className="text-muted-foreground mt-2">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/current-issue" className="inline-block mt-4 text-primary font-semibold hover:underline">
            ← Browse Current Issue
          </Link>
        </div>
      </JournalLayout>
    );
  }

  const canAccess = !article.is_locked || purchased || article.access_type === "Open Access";
  const citationCount = citations.length;
  const publishedDate = article.published_date
    ? new Date(article.published_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "Not published";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: article.title,
    author: authors.map((a) => ({ "@type": "Person", name: a.full_name })),
    datePublished: article.published_date || undefined,
    publisher: { "@type": "Organization", name: "Obafemi Awolowo University Press" },
    isPartOf: { "@type": "Periodical", name: "ODU: A Journal of West African Studies" },
    ...(article.doi && { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: article.doi } }),
    ...(article.abstract && { description: article.abstract }),
    ...(keywords.length > 0 && { keywords: keywords.map(k => k.keyword).join(", ") }),
  };

  return (
    <JournalLayout>
      <SEOHead
        title={article.title}
        description={article.abstract?.slice(0, 155) || `Read "${article.title}" in ODU: A Journal of West African Studies.`}
        path={`/article/${id}`}
        type="article"
        article={{
          authors: authors.map(a => a.full_name),
          publishedTime: article.published_date || undefined,
          section: article.category || undefined,
          tags: keywords.map(k => k.keyword),
          doi: article.doi || undefined,
        }}
        jsonLd={articleJsonLd}
        breadcrumbs={isArchiveVolume ? [{ label: "Home", href: "/" }, { label: "Archive", href: "/archive" }, { label: article.title }] : [{ label: "Home", href: "/" }, { label: "Current Issue", href: "/current-issue" }, { label: article.title }]}
      />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-6 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/current-issue" className="hover:text-primary">Current Issue</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article type & access badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="uppercase text-xs">{article.article_type}</Badge>
              {article.is_locked ? (
                <Badge variant="destructive" className="gap-1"><Lock className="h-3 w-3" /> Paid Access</Badge>
              ) : (
                <Badge className="bg-secondary text-secondary-foreground gap-1"><Unlock className="h-3 w-3" /> Open Access</Badge>
              )}
              {article.status === "published" && (
                <Badge variant="outline">Published</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">
              {article.title}
            </h1>

            {/* Authors */}
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
              <div>
                {authors.length > 0 ? (
                  <div className="flex flex-wrap gap-x-1 text-sm">
                    {authors.map((a, i) => (
                      <span key={a.id}>
                        <span className="text-primary font-medium hover:underline cursor-pointer">{a.full_name}</span>
                        {a.orcid_id && (
                          <a href={`https://orcid.org/${a.orcid_id}`} target="_blank" rel="noopener noreferrer" className="inline-block ml-0.5">
                            <img src="https://orcid.org/sites/default/files/images/orcid_16x16.png" alt="ORCID" className="inline h-3 w-3" />
                          </a>
                        )}
                        {a.is_corresponding && <sup className="text-xs text-muted-foreground">*</sup>}
                        {i < authors.length - 1 && <span className="text-muted-foreground">,</span>}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-foreground">{article.authors}</p>
                )}
                {authors.some(a => a.affiliation) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {[...new Set(authors.filter(a => a.affiliation).map(a => a.affiliation))].join("; ")}
                  </p>
                )}
              </div>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-y border-border py-3">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {publishedDate}</span>
              {article.volume && <span>Volume {article.volume}{article.issue ? `, Issue ${article.issue}` : ""}</span>}
              {article.doi && (
                <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                  <Hash className="h-3.5 w-3.5" /> {article.doi}
                </a>
              )}
              <span className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> {citationCount} citation{citationCount !== 1 ? "s" : ""}</span>
              {metrics && <span>{metrics.views} views · {metrics.downloads} downloads</span>}
            </div>

            {/* Keywords */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map(k => (
                  <Link key={k.id} to={`/search?q=${encodeURIComponent(k.keyword)}`}
                    className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                    {k.keyword}
                  </Link>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {canAccess && article.pdf_url && (
                <Button asChild size="sm" className="gap-1.5">
                  <a href={article.pdf_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                </Button>
              )}
              {!canAccess && article.is_locked && (
                user ? (
                  <Button size="sm" onClick={handlePurchaseClick} className="gap-1.5 bg-cta text-cta-foreground hover:opacity-90">
                    <Lock className="h-4 w-4" /> Purchase — {formatPrice(article.price_cents || 0)}
                  </Button>
                ) : (
                  <Button asChild size="sm" variant="default" className="gap-1.5">
                    <Link to="/login"><Lock className="h-4 w-4" /> Login to Purchase</Link>
                  </Button>
                )
              )}
              {user && (
                <Button variant="outline" size="sm" onClick={toggleFavorite} disabled={loadingFav}
                  className={`gap-1.5 ${isFavorite ? "text-destructive border-destructive" : ""}`}>
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1.5"
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>

            {/* Archive journal overview */}
            {isArchiveVolume && (
              <div className="rounded-lg border border-border bg-card p-6">
                <JournalOverview />
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="abstract" className="mt-6">
              <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                <TabsTrigger value="abstract" className="text-xs">Abstract</TabsTrigger>
                {canAccess && <TabsTrigger value="fulltext" className="text-xs">Full Text</TabsTrigger>}
                <TabsTrigger value="references" className="text-xs">References ({citationCount})</TabsTrigger>
                <TabsTrigger value="metrics" className="text-xs">Metrics</TabsTrigger>
                {versions.length > 0 && <TabsTrigger value="versions" className="text-xs">Versions</TabsTrigger>}
              </TabsList>

              <TabsContent value="abstract" className="mt-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  {article.abstract ? (
                    <p className="leading-relaxed">{article.abstract}</p>
                  ) : (
                    <p className="text-muted-foreground italic">No abstract available.</p>
                  )}
                </div>
              </TabsContent>

              {canAccess && (
                <TabsContent value="fulltext" className="mt-4">
                  {article.full_text_html ? (
                    <div className="prose prose-sm max-w-none text-foreground"
                      dangerouslySetInnerHTML={{ __html: article.full_text_html }} />
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">Full text is only available as PDF.</p>
                      {article.pdf_url && (
                        <Button asChild size="sm" className="mt-3 gap-1.5">
                          <a href={article.pdf_url} target="_blank"><Download className="h-4 w-4" /> Download PDF</a>
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              )}

              <TabsContent value="references" className="mt-4">
                {citations.length > 0 ? (
                  <ol className="space-y-3 list-decimal list-inside">
                    {citations.map((c) => (
                      <li key={c.id} className="text-sm text-foreground">
                        <span className="font-medium">{c.cited_authors}</span>
                        {c.cited_year && <span> ({c.cited_year})</span>}
                        {". "}
                        <span className="italic">{c.cited_title}</span>
                        {c.cited_journal && <span>. {c.cited_journal}</span>}
                        {c.cited_doi && (
                          <a href={`https://doi.org/${c.cited_doi}`} target="_blank" rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline inline-flex items-center gap-0.5 text-xs">
                            <ExternalLink className="h-3 w-3" /> DOI
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground text-sm italic">No references listed.</p>
                )}
              </TabsContent>

              <TabsContent value="metrics" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Views" value={metrics?.views ?? 0} icon={BarChart3} />
                  <MetricCard label="Downloads" value={metrics?.downloads ?? 0} icon={Download} />
                  <MetricCard label="Citations" value={citationCount} icon={Quote} />
                  <MetricCard label="Altmetric" value={metrics?.altmetric_score ?? 0} icon={BarChart3} />
                </div>
              </TabsContent>

              {versions.length > 0 && (
                <TabsContent value="versions" className="mt-4">
                  <div className="space-y-3">
                    {versions.map(v => (
                      <div key={v.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="capitalize mb-1">{v.version_type}</Badge>
                          <p className="text-sm text-foreground font-medium">Version {v.version_number}</p>
                          {v.notes && <p className="text-xs text-muted-foreground mt-1">{v.notes}</p>}
                          <p className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</p>
                        </div>
                        {v.pdf_url && (
                          <Button asChild variant="outline" size="sm">
                            <a href={v.pdf_url} target="_blank"><Download className="h-4 w-4" /></a>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <JournalSidebar />

            {/* Access info card */}
            <div className="border border-border rounded-lg p-5 bg-card space-y-4">
              <h3 className="text-sm font-heading font-bold text-foreground">Access</h3>
              {canAccess ? (
                <div className="flex items-center gap-2 text-sm text-secondary">
                  <Unlock className="h-4 w-4" /> You have full access
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <Lock className="h-4 w-4" /> Restricted content
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Purchase this article or log in via your institution to gain access.
                  </p>
                  {user ? (
                    <Button size="sm" onClick={handlePurchaseClick} className="w-full gap-1.5 bg-cta text-cta-foreground">
                      <Lock className="h-4 w-4" /> Purchase — {formatPrice(article.price_cents || 0)}
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button asChild size="sm" className="w-full">
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full">
                        <Link to="/register">Create account</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Citation export */}
            <div className="border border-border rounded-lg p-5 bg-card space-y-3">
              <h3 className="text-sm font-heading font-bold text-foreground">Cite this article</h3>
              <div className="bg-muted rounded p-3 text-xs text-foreground font-mono leading-relaxed">
                {article.authors} ({publishedDate}). "{article.title}."
                {article.doi && ` DOI: ${article.doi}`}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs flex-1"
                  onClick={() => {
                    const bibtex = `@article{${article.id},\n  title={${article.title}},\n  author={${article.authors}},\n  year={${article.published_date ? new Date(article.published_date).getFullYear() : ""}},\n  doi={${article.doi || ""}}\n}`;
                    navigator.clipboard.writeText(bibtex);
                    toast.success("BibTeX copied!");
                  }}>
                  BibTeX
                </Button>
                <Button variant="outline" size="sm" className="text-xs flex-1"
                  onClick={() => {
                    const ris = `TY  - JOUR\nTI  - ${article.title}\nAU  - ${article.authors}\nPY  - ${article.published_date ? new Date(article.published_date).getFullYear() : ""}\nDO  - ${article.doi || ""}\nER  -`;
                    navigator.clipboard.writeText(ris);
                    toast.success("RIS copied!");
                  }}>
                  RIS
                </Button>
              </div>
            </div>

            {/* Related info */}
            <div className="border border-border rounded-lg p-5 bg-card space-y-3">
              <h3 className="text-sm font-heading font-bold text-foreground">Article Information</h3>
              <dl className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium text-foreground">{article.article_type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="font-medium text-foreground">{publishedDate}</dd>
                </div>
                {article.volume && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Volume / Issue</dt>
                    <dd className="font-medium text-foreground">{article.volume}{article.issue ? ` / ${article.issue}` : ""}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Access</dt>
                  <dd className="font-medium text-foreground">{article.access_type}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {/* Bank Transfer Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Transfer the amount below to our bank account, then click "I've Made Payment" to unlock the article.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-bold text-foreground">Bank Transfer Details</h4>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Account Name</dt>
                  <dd className="font-semibold text-foreground">ODU: A Journal of West African Studies</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-semibold text-foreground">First Bank</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Account Number</dt>
                  <dd className="font-semibold text-foreground font-mono">2048194325</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-bold text-foreground text-lg">{formatPrice(article?.price_cents || 0)}</dd>
                </div>
              </dl>
            </div>
            <p className="text-xs text-muted-foreground">
              Use your email (<span className="font-medium">{user?.email}</span>) as the transfer reference/narration so we can verify your payment.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPaymentDialog(false)}
                disabled={confirmingPayment}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-cta text-cta-foreground"
                onClick={handleConfirmPayment}
                disabled={confirmingPayment}
              >
                {confirmingPayment ? "Processing..." : "I've Made Payment"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </JournalLayout>
  );
};

const MetricCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
  <div className="border border-border rounded-lg p-4 text-center bg-card">
    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
    <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default ArticleDetailPage;
