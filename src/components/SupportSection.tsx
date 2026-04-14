import { BookOpen, Users, PenTool, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const cards = [
  {
    icon: BookOpen,
    title: "Librarians",
    desc: "Connect with our world-class resources.",
    link: "/librarians",
    linkText: "Resources for librarians",
  },
  {
    icon: PenTool,
    title: "Authors",
    desc: "Publish your research. Enhance your career.",
    link: "/author-guidelines",
    linkText: "Resources for authors",
  },
  {
    icon: Users,
    title: "Editors",
    desc: "Essential guidance and support for editors.",
    link: "/editorial-board",
    linkText: "Resources for editors",
  },
  {
    icon: Building2,
    title: "Societies",
    desc: "Collaborative publishing, global reach.",
    link: "/societies",
    linkText: "Resources for societies",
  },
];

const SupportSection = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2 text-center">
        Learn how we support you
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
            <card.icon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="font-heading font-bold text-foreground mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
            <Link to={card.link} className="text-sm text-link font-medium hover:underline">
              {card.linkText}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SupportSection;
