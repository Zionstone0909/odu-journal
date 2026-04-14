import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";

const TermsPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Terms & Conditions", active: true },
      ]}
    >
      <SEOHead title="Terms & Conditions" description="Terms and conditions for using ODU: A Journal of West African Studies website and services." path="/terms" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Terms & Conditions</h1>
          <p className="text-muted-foreground text-sm mb-4">Last updated: March 2026</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            By accessing and using this website and its services, you accept and agree to be bound by these Terms &
            Conditions. If you do not agree to these terms, you must not use our services.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. User Accounts</h2>
          <p className="text-muted-foreground leading-relaxed">
            When you create an account, you must provide accurate and complete information. You are responsible for
            maintaining the confidentiality of your account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorised use of your account.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed">
            All content published on this platform, including articles, abstracts, metadata, and editorial content, is
            protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create
            derivative works from any content without prior written permission from the rights holder.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Article Submission</h2>
          <p className="text-muted-foreground leading-relaxed">By submitting an article, you warrant that:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>The work is original and has not been published elsewhere</li>
            <li>You have the right to submit the work and grant the necessary licences</li>
            <li>The work does not infringe upon any existing copyright or other rights</li>
            <li>All co-authors have agreed to the submission</li>
            <li>The work complies with applicable ethical standards and guidelines</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Peer Review</h2>
          <p className="text-muted-foreground leading-relaxed">
            Submitted manuscripts undergo peer review at the discretion of the editorial board. We reserve the right to
            accept, reject, or request revisions to any submission. Editorial decisions are final.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Access and Subscriptions</h2>
          <p className="text-muted-foreground leading-relaxed">
            Access to certain content may require a subscription or individual purchase. Subscription terms, pricing,
            and access rights are subject to change. Refunds are handled in accordance with our refund policy.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Acceptable Use</h2>
          <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorised access to any part of the service</li>
            <li>Use automated tools to scrape or download content in bulk</li>
            <li>Share your account credentials with third parties</li>
            <li>Upload malicious content or interfere with the service</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed">
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, or
            consequential damages arising from your use of or inability to use the service. Our total liability shall
            not exceed the amount paid by you, if any, for accessing the service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">9. Termination</h2>
          <p className="text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate your account at any time if you breach these terms. Upon
            termination, your right to access the service will cease immediately.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">10. Changes to Terms</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may revise these Terms & Conditions at any time. Changes will be effective when posted on this page.
            Your continued use of the service after any changes constitutes acceptance of the revised terms.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">11. Governing Law</h2>
          <p className="text-muted-foreground leading-relaxed">
            These terms shall be governed by and construed in accordance with applicable laws. Any disputes arising
            from these terms shall be subject to the exclusive jurisdiction of the relevant courts.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">12. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms & Conditions, please contact us through our website.
          </p>
        </div>
      </section>
    </JournalLayout>
  );
};

export default TermsPage;
