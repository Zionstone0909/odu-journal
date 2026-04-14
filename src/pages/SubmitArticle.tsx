import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import { ExternalLink, Upload } from "lucide-react";

const SubmitArticle = () => {
  return (
    <JournalLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-foreground">Submit an Article</h1>

            <div className="bg-muted rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <Upload className="h-8 w-8 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="text-lg font-heading font-bold text-foreground mb-2">Online Submission Portal</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Submit your manuscript through our secure online portal. You can also check the status of existing submissions.
                  </p>
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
                    Go to submission site <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold text-foreground">Before You Submit</h2>
              <div className="space-y-3">
                {[
                  { title: "Read the Author Guidelines", desc: "Ensure your manuscript meets our formatting and style requirements.", link: "/author-guidelines" },
                  { title: "Check the Aims and Scope", desc: "Verify that your research falls within the journal's subject areas.", link: "/about" },
                  { title: "Prepare Your Files", desc: "Main manuscript (.docx), figures, tables, and supplementary materials." },
                  { title: "Write a Cover Letter", desc: "Address the editor and briefly explain the significance of your work." },
                ].map((item, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-card">
                    <h3 className="font-heading font-bold text-sm text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 mt-6">
              <h2 className="text-xl font-heading font-bold text-foreground mb-4">Continue a Submission</h2>
              <p className="text-sm text-muted-foreground mb-4">Already started a submission? Log in to continue where you left off.</p>
              <button className="border-2 border-foreground text-foreground px-5 py-2.5 rounded text-sm font-semibold hover:bg-foreground hover:text-background transition-colors">
                Log in to continue
              </button>
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

export default SubmitArticle;
