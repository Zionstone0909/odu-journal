import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const SiteFooter = () => {
  return (
    <footer className="bg-header text-header-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
          {/* Information for */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Information for</h4>
            <ul className="space-y-2.5 text-xs opacity-80">
              <li><Link to="/author-guidelines" className="hover:opacity-100 transition-opacity">Authors</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">R&D professionals</Link></li>
              <li><Link to="/editorial-board" className="hover:opacity-100 transition-opacity">Editors</Link></li>
              <li><Link to="/librarians" className="hover:opacity-100 transition-opacity">Librarians</Link></li>
              <li><Link to="/societies" className="hover:opacity-100 transition-opacity">Societies</Link></li>
            </ul>
          </div>

          {/* Open access */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Open access</h4>
            <ul className="space-y-2.5 text-xs opacity-80">
              <li><Link to="/open-access" className="hover:opacity-100 transition-opacity">Overview</Link></li>
              <li><Link to="/open-journals" className="hover:opacity-100 transition-opacity">Open journals</Link></li>
              <li><Link to="/open-select" className="hover:opacity-100 transition-opacity">Open Select</Link></li>
              <li><a href="https://press.oauife.edu.ng/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity">Obafemi Awolowo University Press</a></li>
              
            </ul>
          </div>

          {/* Opportunities */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Opportunities</h4>
            <ul className="space-y-2.5 text-xs opacity-80">
              <li><Link to="/publish" className="hover:opacity-100 transition-opacity">Publish with us</Link></li>
              <li><Link to="/open-access" className="hover:opacity-100 transition-opacity">Open access publishing</Link></li>
              <li><Link to="/subscribe" className="hover:opacity-100 transition-opacity">Subscribe</Link></li>
              <li><Link to="/author-guidelines" className="hover:opacity-100 transition-opacity">Author guidelines</Link></li>
            </ul>
          </div>

          {/* Help and information */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Help and information</h4>
            <ul className="space-y-2.5 text-xs opacity-80">
              <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact us</Link></li>
              <li><Link to="/about" className="hover:opacity-100 transition-opacity">About</Link></li>
              <li><Link to="/editorial-board" className="hover:opacity-100 transition-opacity">Editorial Board</Link></li>
              <li><Link to="/browse-journals" className="hover:opacity-100 transition-opacity">All journals</Link></li>
            </ul>
          </div>

          {/* Keep up to date */}
          <div>
            <h4 className="font-heading font-bold text-sm mb-4">Keep up to date</h4>
            <p className="text-xs opacity-80 mb-4">Register to receive personalised research and resources by email</p>
            <Link
              to="/register"
              className="inline-block bg-cta text-cta-foreground px-4 py-2 rounded text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Sign me up
            </Link>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Linkedin className="h-4 w-4" /></a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-60">
          <p>© 2026 Pathfinder Leadership and Development Hub. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" className="hover:opacity-100">Privacy policy</Link>
            <Link to="/terms" className="hover:opacity-100">Terms & conditions</Link>
            <Link to="/accessibility" className="hover:opacity-100">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
