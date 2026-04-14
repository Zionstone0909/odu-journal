import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={800}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="container mx-auto px-4 py-16 text-center relative z-10">
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
          Search peer-reviewed journals and articles
        </h1>

        {/* Search Bar */}
        <div className="mt-8 flex items-center gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter keywords, authors, DOI, etc"
              className="w-full pl-4 pr-10 py-3 rounded border border-white/30 bg-white/10 backdrop-blur text-white placeholder:text-white/60 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
          </div>
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>

        <div className="mt-2 flex gap-4 justify-center">
          <Link to="/search" className="text-sm text-white/80 hover:text-white hover:underline">Advanced search</Link>
        </div>

        <p className="mt-6 text-lg text-white/80">
          5,552,000+ articles | 2,500+ journals
        </p>

        <Link
          to="/browse-journals"
          className="inline-flex items-center gap-2 mt-4 border-2 border-white text-white px-6 py-2.5 rounded text-sm font-semibold hover:bg-white hover:text-black transition-colors"
        >
          <Search className="h-4 w-4" />
          Find a journal
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;
