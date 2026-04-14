import JournalLayout from "@/components/JournalLayout";
import { Link, useParams } from "react-router-dom";

const subjectData: Record<string, { title: string; description: string; journals: { name: string; slug: string }[] }> = {
  "area-studies": {
    title: "Area Studies",
    description: "Explore journals covering regional studies across Africa, Asia, the Americas, Europe, and the Middle East.",
    journals: [
      { name: "ODU: A Journal of West African Studies", slug: "odu-journal" },
      { name: "African Affairs Review", slug: "african-affairs" },
      { name: "West African Linguistics Quarterly", slug: "wa-linguistics" },
      { name: "Journal of Saharan Studies", slug: "saharan-studies" },
    ],
  },
};

const defaultSubject = {
  title: "Subject Area",
  description: "Explore peer-reviewed journals and articles in this subject area.",
  journals: [
    { name: "ODU: A Journal of West African Studies", slug: "odu-journal" },
    { name: "Sample Journal of Studies", slug: "sample-journal" },
  ],
};

const SubjectPage = () => {
  const { slug } = useParams();
  const subject = subjectData[slug || ""] || { ...defaultSubject, title: (slug || "").replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) };

  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Subjects", href: "/browse-journals" },
        { label: subject.title, active: true },
      ]}
    >
      <section className="bg-hero py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground">{subject.title}</h1>
          <p className="mt-3 text-foreground/80 max-w-2xl">{subject.description}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-heading font-bold mb-6">Journals in {subject.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subject.journals.map((journal) => (
            <Link
              key={journal.slug}
              to="/"
              className="block p-5 border border-border rounded-lg hover:shadow-md transition-shadow bg-card"
            >
              <h3 className="font-heading font-bold text-foreground">{journal.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">Peer-reviewed journal</p>
            </Link>
          ))}
        </div>
      </section>
    </JournalLayout>
  );
};

export default SubjectPage;
