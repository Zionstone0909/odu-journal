import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

const defaultItems: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "All Journals", href: "/browse-journals" },
  { label: "African Studies", href: "/subjects/area-studies" },
  { label: "ODU", active: true },
];

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
}

const Breadcrumbs = ({ items = defaultItems }: BreadcrumbsProps) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className="bg-muted border-b border-border">
      <div className="container mx-auto px-4 py-2">
        <ol className="flex items-center gap-1 text-sm text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3" />}
              {item.active ? (
                <span className="text-foreground font-medium">{item.label}</span>
              ) : (
                <Link to={item.href || "#"} className="text-link hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;
