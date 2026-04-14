import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";
import { BookOpen, Search, FileText, Globe, Lightbulb, Users } from "lucide-react";
import { Link } from "react-router-dom";

const publishSteps = [
  { icon: Lightbulb, title: "Prepare your manuscript", desc: "Follow our author guidelines and format your paper according to the journal's requirements." },
  { icon: Search, title: "Find the right journal", desc: "Use our journal suggester tool to find the best match for your research." },
  { icon: FileText, title: "Submit your paper", desc: "Submit through our online submission portal. Track your paper's progress at any time." },
  { icon: Users, title: "Peer review", desc: "Your paper will be reviewed by at least two expert reviewers in the field." },
  { icon: BookOpen, title: "Publication", desc: "Once accepted, your article will be published and indexed in major databases." },
  { icon: Globe, title: "Global reach", desc: "Your research reaches scholars, institutions, and readers worldwide." },
];

const PublishPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Publish", active: true },
      ]}
    >
      <SEOHead title="Publish with Us" description="How to publish your research in ODU: A Journal of West African Studies – submission steps, peer review process, and publication timeline." path="/publish" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Publish" }]} />
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Why Publish With Us?</h1>
          <p className="mt-3 text-foreground/80 max-w-2xl">
            Join thousands of researchers who trust us to publish their work. We offer rigorous peer review, global visibility, and dedicated author support.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-8">How to publish: step by step</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishSteps.map((step, i) => (
            <div key={i} className="border border-border rounded-lg p-6 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs font-bold text-muted-foreground uppercase">Step {i + 1}</span>
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-primary rounded-lg p-8 text-primary-foreground text-center">
          <h3 className="text-xl font-heading font-bold mb-3">Ready to submit?</h3>
          <p className="text-sm opacity-80 mb-5">Start your submission journey today</p>
          <Link to="/submit" className="inline-block bg-cta text-cta-foreground px-6 py-3 rounded font-semibold text-sm hover:opacity-90 transition-opacity">
            Submit an Article
          </Link>
        </div>
      </section>
    </JournalLayout>
  );
};

export default PublishPage;
