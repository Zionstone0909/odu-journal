import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";
import { Search } from "lucide-react";
import { useState } from "react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Search", active: true },
      ]}
    >
      <SEOHead title="Search" description="Search articles, journals, and authors in ODU: A Journal of West African Studies." path="/search" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-center mb-6">Search</h1>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter keywords, authors, DOI, ORCID, etc"
                  className="w-full pl-4 pr-10 py-3 rounded text-foreground bg-card text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <button className="bg-cta text-cta-foreground px-6 py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-heading font-bold mb-6">Advanced Search</h2>
        <div className="max-w-2xl space-y-4">
          <div className="flex gap-4">
            {["All", "Articles", "Journals", "Authors"].map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type.toLowerCase())}
                className={`px-4 py-2 text-sm rounded font-medium transition-colors ${
                  searchType === type.toLowerCase()
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Title</label>
              <input className="w-full px-3 py-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Author</label>
              <input className="w-full px-3 py-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">DOI</label>
              <input className="w-full px-3 py-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date from</label>
                <input type="date" className="w-full px-3 py-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date to</label>
                <input type="date" className="w-full px-3 py-2 border border-border rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
              Search
            </button>
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default SearchPage;
