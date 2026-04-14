import JournalLayout from "@/components/JournalLayout";
import { Link } from "react-router-dom";
import { Unlock } from "lucide-react";

const openJournals = [
  { name: "ODU Open Studies", subject: "Area Studies", slug: "odu-open" },
  { name: "West African Open Health", subject: "Health and Social Care", slug: "wa-open-health" },
  { name: "Open Environmental Sciences Africa", subject: "Environment & Agriculture", slug: "oesa" },
  { name: "African Digital Innovation", subject: "Computer Science", slug: "adi" },
  { name: "Open Education Research Africa", subject: "Education", slug: "oera" },
  { name: "West African Open Economics", subject: "Economics", slug: "waoe" },
];

const OpenJournals = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Open Access", href: "/open-access" },
        { label: "Open Journals", active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Open Access Journals</h1>
          <p className="mt-2 text-foreground/80 max-w-2xl">
            Browse our fully open access journals. All articles are freely available to read, download, and share.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="space-y-3">
          {openJournals.map((j) => (
            <Link
              key={j.slug}
              to="/"
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-card group"
            >
              <div className="flex items-center gap-3">
                <Unlock className="h-5 w-5 text-secondary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{j.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{j.subject}</p>
                </div>
              </div>
              <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded font-semibold">Open Access</span>
            </Link>
          ))}
        </div>
      </section>
    </JournalLayout>
  );
};

export default OpenJournals;
