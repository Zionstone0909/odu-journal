import JournalLayout from "@/components/JournalLayout";
import HeroBanner from "@/components/HeroBanner";
import SubjectGrid from "@/components/SubjectGrid";
import SupportSection from "@/components/SupportSection";
import OpenAccessPromo from "@/components/OpenAccessPromo";
import TrendingResearch from "@/components/TrendingResearch";
import PromoCards from "@/components/PromoCards";
import SEOHead from "@/components/SEOHead";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ODU: A Journal of West African Studies",
  url: "https://academic-gemstone-clone.lovable.app",
  publisher: {
    "@type": "Organization",
    name: "Obafemi Awolowo University Press",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://academic-gemstone-clone.lovable.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Obafemi Awolowo University Press",
  url: "https://academic-gemstone-clone.lovable.app",
  logo: "https://academic-gemstone-clone.lovable.app/favicon.png",
};

const Index = () => {
  return (
    <JournalLayout showJournalNav={true} breadcrumbItems={[
      { label: "Home", href: "/" },
      { label: "All Journals", href: "/browse-journals" },
      { label: "African Studies", href: "/subjects/area-studies" },
      { label: "ODU", active: true },
    ]}>
      <SEOHead
        path="/"
        description="ODU: A Journal of West African Studies – peer-reviewed, interdisciplinary scholarship on West Africa published by Obafemi Awolowo University Press."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "All Journals", href: "/browse-journals" }, { label: "African Studies", href: "/subjects/area-studies" }, { label: "ODU" }]}
        jsonLd={[websiteJsonLd, orgJsonLd]}
      />
      <HeroBanner />
      <div className="container mx-auto px-4">
        <SubjectGrid />
        <SupportSection />
        <OpenAccessPromo />
        <TrendingResearch />
        <PromoCards />
      </div>
    </JournalLayout>
  );
};

export default Index;
