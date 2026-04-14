import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ManuscriptSidebar } from "@/components/manuscript/ManuscriptSidebar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface ManuscriptLayoutProps {
  children: React.ReactNode;
}

const ManuscriptLayout = ({ children }: ManuscriptLayoutProps) => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || (role !== "editor" && role !== "admin"))) {
      navigate("/login");
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || (role !== "editor" && role !== "admin")) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <SidebarProvider>
        <div className="flex-1 flex w-full">
          <ManuscriptSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-12 flex items-center border-b border-border px-4 bg-card">
              <SidebarTrigger className="mr-3" />
              <h1 className="text-sm font-heading font-bold text-foreground">Manuscript Center</h1>
            </header>
            <main className="flex-1 p-6 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
      <SiteFooter />
    </div>
  );
};

export default ManuscriptLayout;
