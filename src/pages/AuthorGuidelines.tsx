import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";

const AuthorGuidelines = () => {
  return (
    <JournalLayout>
      <SEOHead title="Author Guidelines" description="Instructions for authors submitting to ODU: A Journal of West African Studies – formatting, referencing, and submission requirements." path="/author-guidelines" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Author Guidelines" }]} />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-foreground">Author Guidelines</h1>

            <div className="prose prose-sm max-w-none text-foreground/90 space-y-4">
              <h2 className="text-xl font-heading font-bold text-foreground">Manuscript Preparation</h2>
              <p>Authors should prepare their manuscripts according to the following guidelines:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Manuscripts should be submitted in Microsoft Word format (.docx)</li>
                <li>Use 12-point Times New Roman font, double-spaced</li>
                <li>Maximum length: 8,000 words including references</li>
                <li>Include an abstract of 150-250 words</li>
                <li>Provide 4-6 keywords</li>
                <li>Follow APA 7th edition citation style</li>
              </ul>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Submission Process</h2>
              <p>All manuscripts should be submitted electronically through our online submission portal. Authors must create an account or log in to submit.</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Create an account or log in</li>
                <li>Select "New Submission"</li>
                <li>Choose the appropriate article type</li>
                <li>Upload your manuscript and supplementary files</li>
                <li>Enter metadata (title, authors, abstract, keywords)</li>
                <li>Submit for review</li>
              </ol>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Article Types</h2>
              <p>The journal accepts the following types of contributions:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Original Research Articles:</strong> Full-length papers presenting original research findings</li>
                <li><strong>Review Articles:</strong> Comprehensive reviews of current literature on a specific topic</li>
                <li><strong>Short Communications:</strong> Brief reports of significant findings (max 3,000 words)</li>
                <li><strong>Book Reviews:</strong> Critical reviews of recently published books (max 2,000 words)</li>
                <li><strong>Commentary:</strong> Opinion pieces on current issues in West African studies</li>
              </ul>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Ethics and Policies</h2>
              <p>All submissions must be original work not previously published or under consideration elsewhere. Authors must disclose any conflicts of interest and adhere to our publication ethics standards.</p>

              <h2 className="text-xl font-heading font-bold text-foreground mt-8">Copyright</h2>
              <p>Authors retain copyright of their work. By submitting, authors grant the journal the right to publish and distribute the article.</p>
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

export default AuthorGuidelines;
