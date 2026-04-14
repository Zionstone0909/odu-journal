import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";
import { CheckCircle } from "lucide-react";

const OpenAccess = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Open Access", active: true },
      ]}
    >
      <SEOHead title="Open Access" description="Open access publishing options at ODU: A Journal of West African Studies – making research freely available worldwide." path="/open-access" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Open Access" }]} />
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Open Access Publishing</h1>
          <p className="mt-3 text-foreground/80 max-w-2xl">
            Making research freely available to everyone. Learn about our open access options and how to publish your work openly.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">Full Open Access Journals</h2>
            <p className="text-sm text-muted-foreground mb-4">All articles published in these journals are immediately and permanently free to read, download, and share.</p>
            <ul className="space-y-2">
              {["No subscription required", "CC-BY license", "Immediate public access", "Higher visibility and citations"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <h2 className="text-xl font-heading font-bold text-foreground mb-4">Open Select (Hybrid)</h2>
            <p className="text-sm text-muted-foreground mb-4">Choose to publish your article as open access in a subscription journal, making it freely available alongside traditional articles.</p>
            <ul className="space-y-2">
              {["Available in most journals", "Article-level open access", "Author choice", "Compliant with funder mandates"].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-secondary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default OpenAccess;
