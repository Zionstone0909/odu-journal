import JournalLayout from "@/components/JournalLayout";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicyPage = () => {
  return (
    <JournalLayout
      showJournalNav={false}
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Privacy Policy", active: true },
      ]}
    >
      <SEOHead title="Privacy Policy" description="Privacy policy for ODU: A Journal of West African Studies – how we collect, use, and protect your data." path="/privacy-policy" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm mb-4">Last updated: March 2026</p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit
            our website and use our services. Please read this policy carefully. If you do not agree with the terms of
            this privacy policy, please do not access the site.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Information We Collect</h2>
          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Data</h3>
          <p className="text-muted-foreground leading-relaxed">
            When you register for an account, we collect personally identifiable information such as your:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>First and last name</li>
            <li>Email address</li>
            <li>Institutional affiliation</li>
            <li>Country/region and state/province</li>
            <li>Password (stored securely using encryption)</li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Usage Data</h3>
          <p className="text-muted-foreground leading-relaxed">
            We may also collect information about how you access and use our services, including your IP address,
            browser type, pages visited, time spent on pages, and other diagnostic data.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. How We Use Your Information</h2>
          <p className="text-muted-foreground leading-relaxed">We use the information we collect to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Create and manage your account</li>
            <li>Process article submissions and manage the peer review workflow</li>
            <li>Send you relevant communications about your submissions and account</li>
            <li>Send marketing communications (if you have not opted out)</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Marketing Communications</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may use your email address to send you tips, resources on how to get published, and offers to access
            content we think will be of interest to you. You may opt out of receiving these communications at any time
            by clicking the unsubscribe link in our emails or updating your preferences in your account settings.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Data Sharing and Disclosure</h2>
          <p className="text-muted-foreground leading-relaxed">
            We do not sell your personal information. We may share your information with trusted third-party service
            providers who assist us in operating our website and conducting our business, provided they agree to keep
            this information confidential.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use administrative, technical, and physical security measures to protect your personal information.
            While we strive to use commercially acceptable means to protect your data, no method of transmission over
            the Internet or electronic storage is 100% secure.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed">You have the right to:</p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict certain processing</li>
            <li>Data portability where applicable</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to track activity on our service and hold certain
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">9. Changes to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">10. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us through our website.
          </p>
        </div>
      </section>
    </JournalLayout>
  );
};

export default PrivacyPolicyPage;
