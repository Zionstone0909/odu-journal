import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BrowseJournals = () => {
  const [filter, setFilter] = useState("");

  const { data: journals = [], isLoading } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journals").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  const filtered = journals.filter((j: any) =>
    j.title.toLowerCase().includes(filter.toLowerCase()) ||
    j.subject_category.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "All Journals", active: true },
      ]}
    >
      <SEOHead title="Browse Journals" description="Explore peer-reviewed journals published by Obafemi Awolowo University Press." path="/browse-journals" breadcrumbs={[{ label: "Home", href: "/" }, { label: "All Journals" }]} />
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Browse All Journals</h1>
          <p className="mt-2 text-foreground/80">Explore our collection of peer-reviewed journals</p>
          <div className="mt-5 max-w-lg relative">
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter journals by name or subject..."
              className="w-full pl-4 pr-10 py-2.5 rounded border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading journals...</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">{filtered.length} journals found</p>
            <div className="space-y-3">
              {filtered.map((journal: any) => (
                <Link
                  key={journal.id}
                  to="/"
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-card group"
                >
                  <div>
                    <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{journal.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{journal.subject_category}</p>
                    {journal.description && <p className="text-xs text-muted-foreground mt-0.5">{journal.description}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {journal.issn && <span className="text-xs text-muted-foreground">ISSN: {journal.issn}</span>}
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Peer-reviewed</span>
                  </div>
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No journals found.</p>
              )}
            </div>
          </>
        )}
      </section>
    </JournalLayout>
  );
};

export default BrowseJournals;
