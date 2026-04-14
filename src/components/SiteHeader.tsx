import { useState, useRef, useEffect } from "react";
import { Search, User, ChevronDown, X, Menu, LogOut, Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import odoLogo from "@/assets/odo-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const subjects = [
  {
    category: "Social Sciences & Humanities",
    items: [
      { label: "Area Studies", slug: "area-studies" },
      { label: "Arts", slug: "arts" },
      { label: "Communication Studies", slug: "communication-studies" },
      { label: "Economics, Finance, Business & Industry", slug: "economics-finance-business-industry" },
      { label: "Education", slug: "education" },
      { label: "Geography", slug: "geography" },
      { label: "Humanities", slug: "humanities" },
      { label: "Language & Literature", slug: "language-and-literature" },
      { label: "Law", slug: "law" },
      { label: "Museum and Heritage Studies", slug: "museum-and-heritage-studies" },
      { label: "Politics & International Relations", slug: "politics-and-international-relations" },
      { label: "Social Sciences", slug: "social-sciences" },
      { label: "Sports and Leisure", slug: "sports-and-leisure" },
      { label: "Tourism, Hospitality and Events", slug: "tourism-hospitality-and-events" },
    ],
  },
  {
    category: "Physical Sciences & Engineering",
    items: [
      { label: "Computer Science", slug: "computer-science" },
      { label: "Engineering & Technology", slug: "engineering-and-technology" },
      { label: "Food Science & Technology", slug: "food-science-and-technology" },
      { label: "Information Science", slug: "information-science" },
      { label: "Mathematics & Statistics", slug: "mathematics-and-statistics" },
      { label: "Physical Sciences", slug: "physical-sciences" },
    ],
  },
  {
    category: "Medicine, Health & Life Sciences",
    items: [
      { label: "Behavioral Sciences", slug: "behavioral-sciences" },
      { label: "Bioscience", slug: "bioscience" },
      { label: "Health and Social Care", slug: "health-and-social-care" },
      { label: "Medicine, Dentistry, Nursing & Allied Health", slug: "medicine-dentistry-nursing" },
    ],
  },
  {
    category: "Earth & Environmental Sciences",
    items: [
      { label: "Built Environment", slug: "built-environment" },
      { label: "Earth Sciences", slug: "earth-sciences" },
      { label: "Environment & Agriculture", slug: "environment-and-agriculture" },
      { label: "Environment and Sustainability", slug: "environment-and-sustainability" },
      { label: "Global Development", slug: "global-development" },
      { label: "Urban Studies", slug: "urban-studies" },
    ],
  },
];

const publishLinks = [
  { label: "Why publish with us?", path: "/why-publish" },
  { label: "Find a journal", path: "/browse-journals" },
  { label: "Search calls for papers", path: "/calls-for-papers" },
  { label: "Journal Suggester", path: "/journal-suggester" },
  { label: "Step-by-step guide", path: "/publish-guide" },
  { label: "Open access publishing", path: "/open-access" },
];

const SiteHeader = () => {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["unread-notifications", user?.id],
    enabled: !!user,
    refetchInterval: 30000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("is_read", false);
      if (error) throw error;
      return count || 0;
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <header className="bg-header text-header-foreground relative z-[60]" ref={menuRef}>
      <div className="container mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={odoLogo} alt="ODU: A Journal of West African Studies" className="h-20 w-auto" />
          <div className="leading-tight">
            <span className="text-lg font-bold font-heading block">ODU</span>
            <span className="text-xs opacity-80">A Journal of West African Studies</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => toggleMenu("journals")}
            className={`flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity ${openMenu === "journals" ? "opacity-80" : ""}`}
          >
            Journals <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "journals" ? "rotate-180" : ""}`} />
          </button>
          <button
            onClick={() => toggleMenu("search")}
            className={`flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity ${openMenu === "search" ? "opacity-80" : ""}`}
          >
            Search {openMenu === "search" ? <X className="h-3.5 w-3.5" /> : <Search className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => toggleMenu("publish")}
            className={`flex items-center gap-1 text-sm font-medium hover:opacity-80 transition-opacity ${openMenu === "publish" ? "opacity-80" : ""}`}
          >
            Publish <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openMenu === "publish" ? "rotate-180" : ""}`} />
          </button>
        </nav>

        {/* Auth + Mobile */}
        <div className="flex items-center gap-4 text-sm">
          <ThemeToggle />
          {user ? (
            <>
              {(role === "editor" || role === "admin") && (
                <Link to="/manuscript-center" className="hidden md:inline text-xs font-semibold hover:opacity-80 transition-opacity">
                  Manuscript Center
                </Link>
              )}
              {role === "admin" && (
                <Link to="/admin" className="hidden md:inline text-xs font-semibold hover:opacity-80 transition-opacity">
                  Admin
                </Link>
              )}
              <Link to="/notifications" className="hidden md:flex items-center relative hover:opacity-80 transition-opacity">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
              <span className="hidden md:inline text-xs opacity-80">
                {role && <span className="uppercase font-bold mr-1">{role}</span>}
                {user.email}
              </span>
              <button onClick={() => { signOut(); navigate("/"); }} className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                <User className="h-4 w-4" />
                Login
              </Link>
              <span className="hidden md:inline opacity-40">|</span>
              <Link to="/register" className="hidden md:block hover:opacity-80 transition-opacity">
                Register
              </Link>
            </>
          )}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ===== JOURNALS MEGA MENU ===== */}
      {openMenu === "journals" && (
        <div className="absolute left-0 right-0 bg-card text-foreground shadow-xl border-t border-border z-[60] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-heading font-bold">Browse by subject</h3>
              </div>
              <button onClick={() => setOpenMenu(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((group) => (
                <div key={group.category}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    {group.category}
                  </h4>
                  <ul className="space-y-1.5">
                    {group.items.map((item) => (
                      <li key={item.slug}>
                        <Link
                          to={`/subjects/${item.slug}`}
                          onClick={() => setOpenMenu(null)}
                          className="text-sm text-link hover:underline"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-6">
              <Link to="/browse-journals" onClick={() => setOpenMenu(null)} className="text-sm text-link hover:underline font-medium">
                Browse all journals A-Z
              </Link>
              <Link to="/open-journals" onClick={() => setOpenMenu(null)} className="text-sm text-link hover:underline font-medium">
                Open access journals
              </Link>
              <Link to="/open-select" onClick={() => setOpenMenu(null)} className="text-sm text-link hover:underline font-medium">
                Open Select (hybrid) journals
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== SEARCH OVERLAY ===== */}
      {openMenu === "search" && (
        <div className="absolute left-0 right-0 bg-primary text-primary-foreground shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-xl font-heading font-bold mb-4 text-center">Search</h3>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter keywords, authors, DOI, etc"
                    className="w-full pl-4 pr-10 py-3 rounded text-foreground bg-card border-none text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Link
                  to={`/search?q=${encodeURIComponent(searchQuery)}`}
                  onClick={() => setOpenMenu(null)}
                  className="bg-cta text-cta-foreground px-6 py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Search
                </Link>
              </div>
              <div className="mt-3 flex gap-4 justify-center">
                <Link to="/search" onClick={() => setOpenMenu(null)} className="text-sm opacity-80 hover:opacity-100 hover:underline">
                  Advanced search
                </Link>
                <Link to="/citation-search" onClick={() => setOpenMenu(null)} className="text-sm opacity-80 hover:opacity-100 hover:underline">
                  Citation search
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PUBLISH DROPDOWN ===== */}
      {openMenu === "publish" && (
        <div className="absolute left-0 right-0 bg-card text-foreground shadow-xl border-t border-border z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-heading font-bold">Publish</h3>
              <button onClick={() => setOpenMenu(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul className="space-y-2.5">
                {publishLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      onClick={() => setOpenMenu(null)}
                      className="text-sm text-link hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="bg-muted rounded-lg p-5">
                <h4 className="font-heading font-bold text-sm mb-2">We're here to help</h4>
                <p className="text-sm text-muted-foreground">
                  Find guidance on{" "}
                  <Link to="/author-guidelines" onClick={() => setOpenMenu(null)} className="text-link hover:underline font-medium">
                    Author Services
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MOBILE MENU ===== */}
      {mobileOpen && (
        <div className="md:hidden bg-header text-header-foreground border-t border-primary-foreground/20 animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            <Link to="/browse-journals" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Journals</Link>
            <Link to="/search" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Search</Link>
            <Link to="/publish" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Publish</Link>
            <Link to="/why-publish" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Why publish with us?</Link>
            <Link to="/open-access" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Open Access</Link>
            <Link to="/contact" className="block text-sm py-2 hover:opacity-80" onClick={() => setMobileOpen(false)}>Contact</Link>
            <div className="border-t border-primary-foreground/20 pt-3 mt-2 space-y-2">
              {user ? (
                <>
                  <Link to="/notifications" className="block text-sm py-1 hover:opacity-80" onClick={() => setMobileOpen(false)}>
                    Notifications {unreadCount > 0 && <span className="ml-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full px-1.5 py-0.5">{unreadCount}</span>}
                  </Link>
                  {(role === "editor" || role === "admin") && (
                    <Link to="/manuscript-center" className="block text-sm py-1 hover:opacity-80" onClick={() => setMobileOpen(false)}>Manuscript Center</Link>
                  )}
                  {role === "admin" && (
                    <Link to="/admin" className="block text-sm py-1 hover:opacity-80" onClick={() => setMobileOpen(false)}>Admin</Link>
                  )}
                  <span className="block text-xs opacity-80 py-1">{role && <span className="uppercase font-bold mr-1">{role}</span>}{user.email}</span>
                  <button onClick={() => { signOut(); setMobileOpen(false); navigate("/"); }} className="text-sm hover:opacity-80 text-left py-1">Logout</button>
                </>
              ) : (
                <div className="flex gap-4">
                  <Link to="/login" className="text-sm hover:opacity-80" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="text-sm hover:opacity-80" onClick={() => setMobileOpen(false)}>Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
