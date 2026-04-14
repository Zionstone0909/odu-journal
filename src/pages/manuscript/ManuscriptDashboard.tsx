import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ManuscriptLayout from "@/components/manuscript/ManuscriptLayout";
import { Inbox, Clock, CheckCircle, XCircle, FileText } from "lucide-react";

const statCards = [
  { label: "Submitted", status: "submitted", icon: Inbox, color: "text-blue-600 bg-blue-50" },
  { label: "Under Review", status: "under_review", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { label: "Accepted", status: "accepted", icon: CheckCircle, color: "text-green-600 bg-green-50" },
  { label: "Rejected", status: "rejected", icon: XCircle, color: "text-destructive bg-destructive/10" },
  { label: "Published", status: "published", icon: FileText, color: "text-primary bg-primary/10" },
];

const ManuscriptDashboard = () => {
  const { data: articles = [] } = useQuery({
    queryKey: ["manuscript-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const countByStatus = (status: string) =>
    articles.filter((a: any) => a.status === status).length;

  const recentArticles = articles.slice(0, 5);

  return (
    <ManuscriptLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">Overview of all manuscript submissions</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <div key={card.status} className="border border-border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{countByStatus(card.status)}</p>
                  <p className="text-xs text-muted-foreground">{card.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent submissions */}
        <div>
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">Recent Submissions</h3>
          {recentArticles.length === 0 ? (
            <div className="border border-border rounded-lg p-8 bg-card text-center">
              <Inbox className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Authors</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentArticles.map((article: any) => (
                    <tr key={article.id} className="hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">{article.title}</td>
                      <td className="py-3 px-4 text-muted-foreground">{article.authors}</td>
                      <td className="py-3 px-4 text-muted-foreground">{article.article_type}</td>
                      <td className="py-3 px-4">
                        <StatusBadge status={article.status} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {article.submitted_at
                          ? new Date(article.submitted_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ManuscriptLayout>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    submitted: "bg-blue-50 text-blue-700",
    under_review: "bg-amber-50 text-amber-700",
    accepted: "bg-green-50 text-green-700",
    rejected: "bg-destructive/10 text-destructive",
    published: "bg-primary/10 text-primary",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold capitalize ${styles[status] || "bg-muted text-muted-foreground"}`}>
      {status.replace("_", " ")}
    </span>
  );
};

export default ManuscriptDashboard;
