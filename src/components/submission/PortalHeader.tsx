import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Menu, X, LogOut, Home, FilePlus, LayoutDashboard } from "lucide-react";

interface PortalHeaderProps {
  showLogout?: boolean;
  onLogout?: () => void;
  userName?: string;
  showBackLink?: boolean;
}

const PortalHeader = ({ showLogout, onLogout, userName, showBackLink = true }: PortalHeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-header text-header-foreground py-4 relative z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <div>
            <span className="text-lg font-bold font-heading block">ODU</span>
            <span className="text-xs opacity-80">Submission Portal</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          {showBackLink && (
            <Link to="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
              ← Main site
            </Link>
          )}
          {showLogout && userName && (
            <>
              <Link to="/submission/dashboard" className="text-sm font-medium hover:opacity-80 transition-opacity">
                My submissions
              </Link>
              <span className="text-sm opacity-80">Hi, {userName}</span>
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
          {!showLogout && showBackLink && (
            <Link to="/submission/login" className="text-sm opacity-80 hover:opacity-100 transition-opacity">
              Log in
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="sm:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-header text-header-foreground border-t border-primary-foreground/20 animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 text-sm py-2.5 hover:opacity-80"
              onClick={() => setMobileOpen(false)}
            >
              <Home className="h-4 w-4 opacity-60" />
              Main site
            </Link>
            {showLogout && (
              <>
                <Link
                  to="/submission/dashboard"
                  className="flex items-center gap-3 text-sm py-2.5 hover:opacity-80"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4 opacity-60" />
                  My submissions
                </Link>
                <Link
                  to="/submission/new"
                  className="flex items-center gap-3 text-sm py-2.5 hover:opacity-80"
                  onClick={() => setMobileOpen(false)}
                >
                  <FilePlus className="h-4 w-4 opacity-60" />
                  Submit new manuscript
                </Link>
              </>
            )}
            <div className="border-t border-primary-foreground/20 pt-3 mt-2">
              {showLogout && userName ? (
                <div className="space-y-2">
                  <p className="text-xs opacity-60">Signed in as {userName}</p>
                  <button
                    onClick={() => { onLogout?.(); setMobileOpen(false); }}
                    className="flex items-center gap-2 text-sm py-2 hover:opacity-80"
                  >
                    <LogOut className="h-4 w-4 opacity-60" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Link to="/submission/login" className="text-sm hover:opacity-80" onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                  <Link to="/submission/register" className="text-sm hover:opacity-80" onClick={() => setMobileOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PortalHeader;
