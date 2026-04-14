import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";

const AboutPage = () => {
  return (
    <JournalLayout>
      <SEOHead
        title="About"
        description="About ODU: A Journal of West African Studies – history, aims, scope, and editorial mission of this peer-reviewed interdisciplinary journal."
        path="/about"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }]}
      />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-foreground">About ODU: A Journal of West African Studies</h1>

            <div className="prose prose-sm max-w-none text-foreground/90 space-y-4">
              <p>
                <em className="font-heading font-bold not-italic">ODU: A Journal of West African Studies</em> is a peer-reviewed, bi-annual academic journal dedicated to advancing knowledge and understanding of West African societies, cultures, languages, and political systems.
              </p>
              <p>
                Founded with the mission to provide a platform of international standing for interdisciplinary scholarship, the journal publishes original research articles, review papers, and critical essays that contribute to academic discourse on West Africa.
              </p>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">History</h2>
              <p>
                Established by Obafemi Awolowo University Press, the journal has grown to become a leading publication in West African studies, attracting contributions from scholars worldwide. It is indexed in Scopus, DOAJ, and AJOL.
              </p>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Aims and Scope</h2>
              <p>
                The journal covers a broad spectrum of topics including but not limited to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>West African languages and linguistics</li>
                <li>Cultural studies and anthropology</li>
                <li>History and political science</li>
                <li>Sociolinguistics and education</li>
                <li>Economic development</li>
                <li>Environmental studies</li>
                <li>Gender studies in West Africa</li>
                <li>Migration and diaspora studies</li>
              </ul>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Peer Review Process</h2>
              <p>
                All submissions undergo a rigorous double-blind peer review process. Each manuscript is evaluated by at least two independent reviewers with expertise in the relevant field. The review process typically takes 8-12 weeks.
              </p>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Contact</h2>
              <p>
                For editorial inquiries, please contact: <a href="mailto:editor@odujournal.org" className="text-link hover:underline">editor@odujournal.org</a>
              </p>
            </div>
          </div>
          <div>
            <JournalSidebar />
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default AboutPage;
