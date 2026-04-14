import JournalLayout from "@/components/JournalLayout";
import { Link } from "react-router-dom";
import { Unlock } from "lucide-react";

const hybridJournals = [
  { name: "ODU: A Journal of West African Studies", subject: "Area Studies", slug: "odu-journal" },
  { name: "African Affairs Review", subject: "Area Studies", slug: "african-affairs" },
  { name: "West African Linguistics Quarterly", subject: "Language & Literature", slug: "wa-linguistics" },
  { name: "Nigerian Political Science Review", subject: "Politics & International Relations", slug: "npsr" },
  { name: "Tropical Agriculture & Food Science", subject: "Food Science & Technology", slug: "tafs" },
];

const OpenSelect = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Open Access", href: "/open-access" },
        { label: "Open Select", active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Open Select (Hybrid) Journals</h1>
          <p className="mt-2 text-foreground/80 max-w-2xl">
            Open Select journals allow authors to choose to publish their article open access, making it freely available to everyone immediately upon publication.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="bg-muted rounded-lg p-6 mb-8">
          <h2 className="font-heading font-bold text-foreground mb-2">How Open Select works</h2>
          <p className="text-sm text-muted-foreground">
            Authors publishing in an Open Select journal can choose to make their individual article openly accessible by paying an article publishing charge (APC). Non-open access articles remain available through subscription.
          </p>
        </div>

        <div className="space-y-3">
          {hybridJournals.map((j) => (
            <Link
              key={j.slug}
              to="/"
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow bg-card group"
            >
              <div className="flex items-center gap-3">
                <Unlock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors">{j.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{j.subject}</p>
                </div>
              </div>
              <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded font-semibold">Hybrid</span>
            </Link>
          ))}
        </div>
      </section>
    </JournalLayout>
  );
};

export default OpenSelect;
