import { Link } from "react-router-dom";
import { BookOpen, Mail, Globe, Newspaper, CalendarDays, Languages } from "lucide-react";

const promos = [
  {
    icon: Languages,
    title: "English language editing",
    desc: "Publication-focused editing that helps make your manuscript ready for initial submission.",
    link: "/author-guidelines",
  },
  {
    icon: Mail,
    title: "Keep up to date",
    desc: "Register to receive personalised research and resources by email.",
    link: "/register",
  },
  {
    icon: BookOpen,
    title: "Explore our books",
    desc: "Discover books and ebooks from Obafemi Awolowo University Press.",
    link: "/browse-journals",
  },
  {
    icon: Globe,
    title: "Learn more about ODU eBooks",
    desc: "Discover what's changed and how we're working to better serve you and your library's needs.",
    link: "/librarians",
  },
  {
    icon: Newspaper,
    title: "Research Insights: Expert advice to get you published",
    desc: "Free monthly publishing guidance with easy-to-follow guides and expert tips.",
    link: "/publish",
  },
  {
    icon: CalendarDays,
    title: "Register for upcoming events",
    desc: "5M+ articles accessible to 18M+ subscribers across 6500 institutions.",
    link: "/about",
  },
];

const PromoCards = () => {
  return (
    <section className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo) => (
          <Link
            key={promo.title}
            to={promo.link}
            className="border border-border rounded-lg p-5 bg-card hover:shadow-md transition-shadow group"
          >
            <promo.icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-heading font-bold text-sm text-foreground group-hover:text-primary transition-colors">
              {promo.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5">{promo.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PromoCards;
