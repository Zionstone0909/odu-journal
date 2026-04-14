import { Mail, Rss, Bell } from "lucide-react";

const JournalSidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Follow */}
      <div className="bg-primary rounded-lg p-5 text-primary-foreground">
        <h3 className="text-lg font-heading font-bold mb-4">Follow this Journal</h3>
        <ul className="space-y-3">
          <li>
            <a href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Mail className="h-4 w-4" /> New content alerts
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Rss className="h-4 w-4" /> RSS feed
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Bell className="h-4 w-4" /> Push notifications
            </a>
          </li>
        </ul>
      </div>

      {/* Journal Info */}
      <div className="bg-muted rounded-lg p-5">
        <h3 className="text-lg font-heading font-bold text-foreground mb-4">Journal Information</h3>
        <dl className="space-y-3 text-sm">
          {[
            ["ISSN (Print)", "2XXX-XXXX"],
            ["ISSN (Online)", "2XXX-XXXY"],
            ["Frequency", "Bi-annual"],
            ["Publisher", "Obafemi Awolowo University Press"],
            ["Indexed in", "Scopus, DOAJ, AJOL"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="font-medium text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
};

export default JournalSidebar;
