import JournalLayout from "@/components/JournalLayout";
import { Link } from "react-router-dom";
import { BookOpen, Database, Users, Shield, BarChart3, Globe } from "lucide-react";

const resources = [
  { icon: Database, title: "Access Solutions", desc: "Flexible access models including institutional subscriptions, consortia deals, and pay-per-view options." },
  { icon: BarChart3, title: "Usage Statistics", desc: "COUNTER-compliant usage reports to help you understand and demonstrate the value of your investment." },
  { icon: Shield, title: "Authentication", desc: "Support for IP authentication, Shibboleth, OpenAthens, and other access management systems." },
  { icon: BookOpen, title: "Discovery & Access", desc: "Content available through major discovery services and link resolvers." },
  { icon: Globe, title: "Open Access", desc: "Growing portfolio of fully open access journals with transparent pricing." },
  { icon: Users, title: "Dedicated Support", desc: "Library account managers ready to help with any questions or issues." },
];

const LibrariansPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Resources for Librarians", active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Resources for Librarians</h1>
          <p className="mt-2 text-foreground/80 max-w-2xl">
            Connect with world-class resources. We provide librarians with the tools and support needed to serve their communities.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((r) => (
            <div key={r.title} className="border border-border rounded-lg p-6 bg-card">
              <r.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-bold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/subscribe" className="bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
            Contact us about institutional access
          </Link>
        </div>
      </section>
    </JournalLayout>
  );
};

export default LibrariansPage;
