import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { ShieldCheck, Users, FileSearch, AlertTriangle, BookOpen, Scale } from "lucide-react";

const EditorialPoliciesPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Editorial Policies", active: true },
      ]}
    >
      <SEOHead title="Editorial Policies" description="Editorial policies of ODU: A Journal of West African Studies – peer review, ethics, plagiarism, and data sharing guidelines." path="/editorial-policies" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Editorial Policies" }]} />
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Editorial Policies</h1>
          <p className="text-muted-foreground mb-10 leading-relaxed">
            Our editorial policies ensure the highest standards of integrity, transparency, and rigour in the
            publication process. All authors, reviewers, and editors are expected to adhere to these guidelines.
          </p>

          {/* Quick nav */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { icon: ShieldCheck, label: "Publication Ethics", anchor: "#publication-ethics" },
              { icon: Users, label: "Peer Review Policy", anchor: "#peer-review" },
              { icon: FileSearch, label: "Plagiarism Guidelines", anchor: "#plagiarism" },
              { icon: AlertTriangle, label: "Misconduct & Corrections", anchor: "#misconduct" },
              { icon: BookOpen, label: "Open Access Policy", anchor: "#open-access" },
              { icon: Scale, label: "Conflicts of Interest", anchor: "#conflicts" },
            ].map(({ icon: Icon, label, anchor }) => (
              <a
                key={anchor}
                href={anchor}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors group"
              >
                <Icon className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {label}
                </span>
              </a>
            ))}
          </div>

          <div className="space-y-12">
            {/* Publication Ethics */}
            <section id="publication-ethics">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Publication Ethics</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to upholding the highest standards of publication ethics and follow the guidelines
                  established by the{" "}
                  <span className="text-link font-medium">
                    Committee on Publication Ethics (COPE)
                  </span>
                  . All parties involved in the publication process — authors, editors, reviewers, and publishers —
                  are expected to adhere to these ethical standards.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Author Responsibilities</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li>Authors must ensure that their work is entirely original and properly cite or quote the work of others</li>
                  <li>Authors should not submit the same manuscript to more than one journal simultaneously</li>
                  <li>Authors must disclose any financial or personal relationships that could influence their work</li>
                  <li>All authors listed must have made a significant contribution to the research</li>
                  <li>Authors should provide raw data related to their manuscript for editorial review upon request</li>
                  <li>If errors are discovered after publication, authors are obligated to notify the editor promptly</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Editor Responsibilities</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li>Editors must evaluate manuscripts based solely on their academic merit and relevance</li>
                  <li>Editors should not disclose any information about a submitted manuscript to anyone other than the corresponding author, reviewers, and the editorial board</li>
                  <li>Editors must ensure fair and unbiased peer review processes</li>
                  <li>Editors should recuse themselves from handling manuscripts where a conflict of interest exists</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Reviewer Responsibilities</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li>Reviewers must treat the manuscript as confidential and not share it with others</li>
                  <li>Reviews should be conducted objectively with constructive feedback</li>
                  <li>Reviewers should alert the editor to any substantial similarity between the manuscript and any published paper</li>
                  <li>Reviewers should decline to review manuscripts in which they have a conflict of interest</li>
                </ul>
              </div>
            </section>

            {/* Peer Review Policy */}
            <section id="peer-review" className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Peer Review Policy</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  All submitted manuscripts undergo a rigorous peer review process to ensure the quality, validity,
                  and significance of published research.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Review Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
                  {[
                    { step: "1", title: "Initial Screening", desc: "The editor conducts a preliminary review to assess scope, quality, and adherence to guidelines." },
                    { step: "2", title: "Peer Review", desc: "The manuscript is sent to at least two independent expert reviewers for evaluation." },
                    { step: "3", title: "Decision", desc: "Based on reviewer feedback, the editor makes a decision: accept, revise, or reject." },
                    { step: "4", title: "Publication", desc: "Accepted manuscripts proceed through copyediting, typesetting, and final publication." },
                  ].map((item) => (
                    <div key={item.step} className="text-center p-4 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                        {item.step}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Review Type</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We operate a <strong className="text-foreground">single-blind peer review</strong> process, where the
                  identities of the reviewers are concealed from the authors. This allows reviewers to provide candid
                  and unbiased assessments of the work.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Timelines</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li>Initial editorial decision: within 2 weeks of submission</li>
                  <li>Peer review: typically 4–6 weeks</li>
                  <li>Author revisions: 4 weeks from decision date</li>
                  <li>Final decision after revision: within 2 weeks</li>
                  <li>Publication after acceptance: 4–8 weeks</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Appeals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Authors who wish to appeal an editorial decision may do so by contacting the editor-in-chief with
                  a detailed explanation of their reasons for the appeal. Appeals are considered on a case-by-case basis
                  and may involve additional peer review.
                </p>
              </div>
            </section>

            {/* Plagiarism Guidelines */}
            <section id="plagiarism" className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <FileSearch className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Plagiarism Guidelines</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Plagiarism in any form is unacceptable and constitutes a serious violation of publication ethics.
                  We use plagiarism detection software to screen all submitted manuscripts.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Definition of Plagiarism</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Plagiarism includes but is not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li><strong className="text-foreground">Direct plagiarism:</strong> copying text verbatim from another source without attribution</li>
                  <li><strong className="text-foreground">Self-plagiarism:</strong> reusing substantial portions of one's own previously published work without proper citation</li>
                  <li><strong className="text-foreground">Mosaic plagiarism:</strong> paraphrasing or rearranging text from multiple sources without proper attribution</li>
                  <li><strong className="text-foreground">Idea plagiarism:</strong> presenting someone else's original ideas, theories, or hypotheses as one's own</li>
                  <li><strong className="text-foreground">Image/data plagiarism:</strong> using figures, tables, or datasets from other publications without permission and acknowledgement</li>
                </ul>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Detection and Prevention</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All manuscripts are screened for originality upon submission. Manuscripts with a similarity index
                  above 20% (excluding references and quotations) will be flagged for further review. Authors are
                  strongly encouraged to use plagiarism detection tools before submitting their manuscripts.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Consequences</h3>
                <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If plagiarism is detected at any stage — before or after publication — the following actions may be taken:
                  </p>
                  <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1.5 mt-2">
                    <li>Immediate rejection of the manuscript</li>
                    <li>Retraction of the published article with a public notice</li>
                    <li>Notification to the author's institution</li>
                    <li>A ban on future submissions from the author(s) for a specified period</li>
                    <li>Reporting to relevant professional bodies (e.g., COPE)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Misconduct & Corrections */}
            <section id="misconduct" className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Misconduct & Corrections</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We take allegations of research misconduct very seriously. Research misconduct includes fabrication,
                  falsification, and plagiarism, as well as other practices that deviate from commonly accepted standards.
                </p>

                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">Corrections and Retractions</h3>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li><strong className="text-foreground">Erratum:</strong> issued to correct errors made by the journal during production</li>
                  <li><strong className="text-foreground">Corrigendum:</strong> issued to correct errors made by the author(s) that affect the integrity of the work</li>
                  <li><strong className="text-foreground">Retraction:</strong> issued when the findings are unreliable due to misconduct or honest error, or when the work constitutes plagiarism or breaches ethical guidelines</li>
                  <li><strong className="text-foreground">Expression of Concern:</strong> issued when there is inconclusive evidence of misconduct but the allegations warrant alerting readers</li>
                </ul>
              </div>
            </section>

            {/* Open Access Policy */}
            <section id="open-access" className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Open Access Policy</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We support open access publishing to maximise the dissemination and impact of research. Authors
                  may choose to publish their articles as open access, making them freely available to all readers
                  immediately upon publication.
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1.5">
                  <li>Open access articles are published under a Creative Commons licence (CC BY or CC BY-NC)</li>
                  <li>An article publishing charge (APC) applies for open access publication</li>
                  <li>Fee waivers and discounts are available for authors from low- and middle-income countries</li>
                  <li>Authors retain copyright of their work</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  For more information, visit our{" "}
                  <Link to="/open-access" className="text-link hover:underline font-medium">
                    Open Access page
                  </Link>
                  .
                </p>
              </div>
            </section>

            {/* Conflicts of Interest */}
            <section id="conflicts" className="pt-4 border-t border-border">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-heading font-bold text-foreground">Conflicts of Interest</h2>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  All authors are required to disclose any potential conflicts of interest that could be perceived
                  as influencing the content of their manuscript. This includes financial relationships, personal
                  relationships, academic competition, and intellectual interests.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Editors and reviewers are also required to declare any conflicts of interest and must recuse
                  themselves from handling a manuscript if a conflict exists. Undisclosed conflicts of interest
                  discovered after publication may result in corrections, retractions, or other appropriate actions.
                </p>
              </div>
            </section>
          </div>

          {/* Contact */}
          <div className="mt-12 p-6 bg-muted/50 rounded-lg border border-border">
            <h3 className="font-heading font-bold text-foreground mb-2">Questions about our policies?</h3>
            <p className="text-sm text-muted-foreground">
              If you have questions about any of our editorial policies, please contact the editorial office or
              visit our{" "}
              <Link to="/author-guidelines" className="text-link hover:underline font-medium">
                Instructions for Authors
              </Link>{" "}
              page for submission-related guidance.
            </p>
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default EditorialPoliciesPage;
