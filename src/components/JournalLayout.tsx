import SiteHeader from "@/components/SiteHeader";
import Breadcrumbs from "@/components/Breadcrumbs";
import JournalNav from "@/components/JournalNav";
import SiteFooter from "@/components/SiteFooter";

interface JournalLayoutProps {
  children: React.ReactNode;
  showJournalNav?: boolean;
  breadcrumbItems?: { label: string; href?: string; active?: boolean }[];
}

const JournalLayout = ({ children, showJournalNav = true, breadcrumbItems }: JournalLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <Breadcrumbs items={breadcrumbItems} />
      {showJournalNav && <JournalNav />}
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
};

export default JournalLayout;
