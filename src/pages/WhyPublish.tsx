import JournalLayout from "@/components/JournalLayout";
import { Link } from "react-router-dom";
import { CheckCircle, Globe, Users, Zap, Award, BookOpen } from "lucide-react";

const benefits = [
  { icon: Globe, title: "Global Reach", desc: "Your research reaches readers in over 190 countries through our extensive distribution network." },
  { icon: Users, title: "Expert Peer Review", desc: "Rigorous peer review ensures the quality and impact of every published article." },
  { icon: Zap, title: "Fast Publication", desc: "Streamlined submission and review processes to get your research published quickly." },
  { icon: Award, title: "High Impact", desc: "Our journals are indexed in major databases including Scopus, Web of Science, and PubMed." },
  { icon: BookOpen, title: "Open Access Options", desc: "Choose from fully open access or hybrid open access publishing models." },
  { icon: CheckCircle, title: "Author Support", desc: "Dedicated editorial support from submission through to publication." },
];

const WhyPublish = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Why publish with us?", active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Why publish with us?</h1>
          <p className="mt-2 text-foreground/80 max-w-2xl">
            We're committed to helping researchers share their discoveries with the world. Here's why thousands of authors choose to publish with us.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="border border-border rounded-lg p-6 bg-card">
              <b.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-heading font-bold text-foreground mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-primary rounded-lg p-8 text-primary-foreground text-center">
          <h2 className="text-2xl font-heading font-bold mb-3">Ready to get started?</h2>
          <p className="text-sm opacity-90 mb-6 max-w-lg mx-auto">
            Find the right journal for your research and begin your submission today.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/browse-journals" className="bg-cta text-cta-foreground px-6 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
              Find a journal
            </Link>
            <Link to="/author-guidelines" className="border-2 border-primary-foreground text-primary-foreground px-6 py-2.5 rounded text-sm font-semibold hover:bg-primary-foreground hover:text-primary transition-colors">
              Author guidelines
            </Link>
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default WhyPublish;
