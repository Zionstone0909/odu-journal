import { Link } from "react-router-dom";

const subjects = [
  { label: "Area Studies", slug: "area-studies" },
  { label: "Arts", slug: "arts" },
  { label: "Behavioral Sciences", slug: "behavioral-sciences" },
  { label: "Bioscience", slug: "bioscience" },
  { label: "Built Environment", slug: "built-environment" },
  { label: "Communication Studies", slug: "communication-studies" },
  { label: "Computer Science", slug: "computer-science" },
  { label: "Earth Sciences", slug: "earth-sciences" },
  { label: "Economics, Finance, Business & Industry", slug: "economics-finance-business-industry" },
  { label: "Education", slug: "education" },
  { label: "Engineering & Technology", slug: "engineering-and-technology" },
  { label: "Environment & Agriculture", slug: "environment-and-agriculture" },
  { label: "Environment and Sustainability", slug: "environment-and-sustainability" },
  { label: "Food Science & Technology", slug: "food-science-and-technology" },
  { label: "Geography", slug: "geography" },
  { label: "Global Development", slug: "global-development" },
  { label: "Health and Social Care", slug: "health-and-social-care" },
  { label: "Humanities", slug: "humanities" },
  { label: "Information Science", slug: "information-science" },
  { label: "Language & Literature", slug: "language-and-literature" },
  { label: "Law", slug: "law" },
  { label: "Mathematics, Statistics & Data Science", slug: "mathematics-and-statistics" },
  { label: "Medicine, Dentistry, Nursing & Allied Health", slug: "medicine-dentistry-nursing" },
  { label: "Museum and Heritage Studies", slug: "museum-and-heritage-studies" },
  { label: "Physical Sciences", slug: "physical-sciences" },
  { label: "Politics & International Relations", slug: "politics-and-international-relations" },
  { label: "Social Sciences", slug: "social-sciences" },
  { label: "Sports and Leisure", slug: "sports-and-leisure" },
  { label: "Tourism, Hospitality and Events", slug: "tourism-hospitality-and-events" },
  { label: "Urban Studies", slug: "urban-studies" },
];

const SubjectGrid = () => {
  return (
    <section className="py-12">
      <h2 className="text-2xl font-heading font-bold text-foreground mb-2 text-center">
        Explore journals and articles by subject
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto mb-8">
        Search and explore the millions of quality, peer-reviewed journal articles published under the Obafemi Awolowo University Press imprints.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-2">
        {subjects.map((s) => (
          <Link
            key={s.slug}
            to={`/subjects/${s.slug}`}
            className="text-sm text-link hover:underline py-1"
          >
            {s.label}
          </Link>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link
          to="/browse-journals"
          className="inline-flex items-center gap-2 border-2 border-foreground text-foreground px-6 py-2.5 rounded text-sm font-semibold hover:bg-foreground hover:text-background transition-colors"
        >
          Journals A - Z
        </Link>
      </div>
    </section>
  );
};

export default SubjectGrid;
