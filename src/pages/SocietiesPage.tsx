import JournalLayout from "@/components/JournalLayout";
import { Link } from "react-router-dom";
import { Handshake, Globe, TrendingUp, Users, BookOpen, Award } from "lucide-react";

const benefits = [
  { icon: Globe, title: "Global Distribution", desc: "Reach researchers worldwide through our extensive publishing and distribution network." },
  { icon: TrendingUp, title: "Growing Impact", desc: "We help society journals increase their visibility, readership, and citation metrics." },
  { icon: Users, title: "Member Benefits", desc: "Exclusive access options and discounts for society members." },
  { icon: BookOpen, title: "Publishing Expertise", desc: "Full-service publishing including copyediting, typesetting, and online hosting." },
  { icon: Award, title: "Quality Standards", desc: "Rigorous peer review processes and commitment to publication ethics." },
  { icon: Handshake, title: "Partnership Model", desc: "Collaborative approach that respects society values and editorial independence." },
];

const SocietiesPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Resources for Societies", active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">Resources for Societies</h1>
          <p className="mt-2 text-foreground/80 max-w-2xl">
            Collaborative publishing, global reach. Partner with us to advance your society's publishing mission.
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

        <div className="mt-10 bg-muted rounded-lg p-8 text-center">
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">Interested in partnering with us?</h2>
          <p className="text-sm text-muted-foreground mb-6">Contact our society partnerships team to discuss how we can work together.</p>
          <Link to="/about" className="bg-primary text-primary-foreground px-6 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
            Get in touch
          </Link>
        </div>
      </section>
    </JournalLayout>
  );
};

export default SocietiesPage;
