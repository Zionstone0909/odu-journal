import { useState, useRef, useEffect } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

type SubMenuItem = { label: string; path: string; external?: boolean };

type NavItem = {
  label: string;
  path?: string;
  subItems?: SubMenuItem[];
  customDropdown?: boolean;
};

const navItems: NavItem[] = [
  {
    label: "Submit an article",
    customDropdown: true,
    subItems: [],
  },
  {
    label: "About this journal",
    path: "/about",
  },
  {
    label: "Browse all articles & issues",
    subItems: [
      { label: "Current issue", path: "/current-issue" },
      { label: "All issues", path: "/all-issues" },
      { label: "Most read articles", path: "/most-read" },
      { label: "Most cited articles", path: "/most-cited" },
      { label: "Open access articles", path: "/open-access-articles" },
    ],
  },
  {
    label: "Follow this journal",
    subItems: [
      { label: "New content alerts", path: "/alerts" },
      { label: "RSS feed", path: "/rss" },
      { label: "Push notifications", path: "/notifications" },
    ],
  },
  {
    label: "Buy a subscription",
    path: "/subscribe",
  },
  {
    label: "Contact",
    path: "/contact",
  },
];

const SubmitDropdown = ({ onClose }: { onClose: () => void }) => (
  <div className="absolute top-full left-0 bg-card border border-border rounded-b-md shadow-lg min-w-[280px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
    <div className="p-5">
      <h4 className="font-heading font-bold text-foreground text-sm mb-1.5">Ready to submit?</h4>
      <p className="text-xs text-muted-foreground leading-relaxed mb-4">
        Start a new submission or continue a submission in progress
      </p>
      <Link
        to="/submission/login"
        onClick={onClose}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Go to submission site
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
    <div className="border-t border-border">
      <ul className="py-2">
        <li>
          <Link to="/author-guidelines" onClick={onClose} className="block px-5 py-2.5 text-sm text-link hover:bg-muted hover:text-primary transition-colors">
            Instructions for authors
          </Link>
        </li>
        <li>
          <Link to="/editorial-policies" onClick={onClose} className="flex items-center gap-1.5 px-5 py-2.5 text-sm text-link hover:bg-muted hover:text-primary transition-colors">
            Editorial policies
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

const JournalNav = () => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-[50]" ref={navRef}>
      <div className="container mx-auto px-4">
        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-0 flex-wrap">
          {navItems.map((item, index) => (
            <li key={item.label} className="relative">
              {item.customDropdown ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className={`flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      openDropdown === index ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === index ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === index && <SubmitDropdown onClose={() => setOpenDropdown(null)} />}
                </>
              ) : item.subItems ? (
                <>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className={`flex items-center gap-1 px-4 py-3.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      openDropdown === index ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${openDropdown === index ? "rotate-180" : ""}`} />
                  </button>
                  {openDropdown === index && (
                    <div className="absolute top-full left-0 bg-card border border-border rounded-b-md shadow-lg min-w-[220px] z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <ul className="py-2">
                        {item.subItems.map((sub) => (
                          <li key={sub.path}>
                            <Link
                              to={sub.path}
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                            >
                              {sub.label}
                              {sub.external && <ExternalLink className="h-3 w-3" />}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path!}
                  className="flex items-center gap-1 px-4 py-3.5 text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile: show nav items as horizontal scrollable strip */}
        <div className="lg:hidden overflow-x-auto scrollbar-hide">
          <ul className="flex items-center gap-0 min-w-max">
            {navItems.map((item, index) => (
              <li key={item.label}>
                {item.subItems || item.customDropdown ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                    className={`flex items-center gap-1 px-3 py-3 text-xs font-medium transition-colors whitespace-nowrap ${
                      openDropdown === index ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {item.label}
                    <ChevronDown className={`h-3 w-3 transition-transform ${openDropdown === index ? "rotate-180" : ""}`} />
                  </button>
                ) : (
                  <Link to={item.path!} className="block px-3 py-3 text-xs font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile dropdown rendered outside the overflow container */}
      {openDropdown !== null && navItems[openDropdown] && (
        <div className="lg:hidden border-t border-border bg-card shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
          {navItems[openDropdown].customDropdown ? (
            <div className="px-4 py-4 space-y-3">
              <h4 className="font-heading font-bold text-foreground text-sm">Ready to submit?</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start a new submission or continue a submission in progress
              </p>
              <Link
                to="/submission/login"
                onClick={() => setOpenDropdown(null)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Go to submission site
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <div className="border-t border-border pt-3 space-y-2">
                <Link to="/author-guidelines" onClick={() => setOpenDropdown(null)} className="block text-sm text-link hover:underline">
                  Instructions for authors
                </Link>
                <Link to="/editorial-policies" onClick={() => setOpenDropdown(null)} className="block text-sm text-link hover:underline">
                  Editorial policies
                </Link>
              </div>
            </div>
          ) : navItems[openDropdown].subItems ? (
            <ul className="py-2">
              {navItems[openDropdown].subItems!.map((sub) => (
                <li key={sub.path}>
                  <Link to={sub.path} onClick={() => setOpenDropdown(null)} className="block px-4 py-2.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
                    {sub.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}
    </nav>
  );
};

export default JournalNav;
