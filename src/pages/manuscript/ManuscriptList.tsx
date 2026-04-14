import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ManuscriptLayout from "@/components/manuscript/ManuscriptLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";

interface ManuscriptListProps {
  filterStatus?: string;
  title: string;
  description: string;
}

const ManuscriptList = ({ filterStatus, title, description }: ManuscriptListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editorNotes, setEditorNotes] = useState("");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["manuscript-articles", filterStatus],
    queryFn: async () => {
      let query = supabase.from("articles").select("*").order("submitted_at", { ascending: false });
      if (filterStatus) query = query.eq("status", filterStatus);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Record<string, any> }) => {
      const { error } = await supabase.from("articles").update(updates as any).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manuscript-articles"] });
      toast({ title: "Article updated" });
      setExpandedId(null);
    },
    onError: (err: any) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const handleStatusChange = (id: string, newStatus: string, decision?: string) => {
    const updates: Record<string, any> = {
      status: newStatus,
      editor_id: user?.id,
      editor_notes: editorNotes || null,
    };
    if (decision) {
      updates.decision = decision;
      updates.decided_at = new Date().toISOString();
    }
    if (newStatus === "under_review") {
      updates.reviewed_at = null;
    }
    updateMutation.mutate({ id, updates });
  };

  return (
    <ManuscriptLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : articles.length === 0 ? (
          <div className="border border-border rounded-lg p-8 bg-card text-center">
            <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No articles found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article: any) => (
              <div key={article.id} className="border border-border rounded-lg bg-card overflow-hidden">
                <button
                  onClick={() => {
                    setExpandedId(expandedId === article.id ? null : article.id);
                    setEditorNotes(article.editor_notes || "");
                  }}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-secondary uppercase">{article.article_type}</span>
                      <StatusBadge status={article.status} />
                    </div>
                    <h3 className="font-heading font-bold text-foreground mt-1 truncate">{article.title}</h3>
                    <p className="text-sm text-muted-foreground">{article.authors}</p>
                  </div>
                  {expandedId === article.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {expandedId === article.id && (
                  <div className="border-t border-border p-4 space-y-4 bg-muted/30">
                    {/* Article details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-foreground">DOI:</span>{" "}
                        <span className="text-muted-foreground">{article.doi || "Not assigned"}</span>
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Submitted:</span>{" "}
                        <span className="text-muted-foreground">
                          {article.submitted_at ? new Date(article.submitted_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                      {article.decision && (
                        <div>
                          <span className="font-medium text-foreground">Decision:</span>{" "}
                          <span className="text-muted-foreground capitalize">{article.decision}</span>
                        </div>
                      )}
                    </div>

                    {article.abstract && (
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-1">Abstract</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{article.abstract}</p>
                      </div>
                    )}

                    {/* Editor notes */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Editor Notes</label>
                      <textarea
                        value={editorNotes}
                        onChange={(e) => setEditorNotes(e.target.value)}
                        className="w-full border border-border rounded p-3 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px]"
                        placeholder="Add notes about this manuscript..."
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {article.status === "submitted" && (
                        <button
                          onClick={() => handleStatusChange(article.id, "under_review")}
                          className="px-4 py-2 bg-amber-600 text-white rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Send for Review
                        </button>
                      )}
                      {(article.status === "submitted" || article.status === "under_review") && (
                        <>
                          <button
                            onClick={() => handleStatusChange(article.id, "accepted", "accepted")}
                            className="px-4 py-2 bg-green-600 text-white rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusChange(article.id, "rejected", "rejected")}
                            className="px-4 py-2 bg-destructive text-destructive-foreground rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {article.status === "accepted" && (
                        <button
                          onClick={() => handleStatusChange(article.id, "published")}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded text-xs font-semibold hover:opacity-90 transition-opacity"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => {
                          updateMutation.mutate({
                            id: article.id,
                            updates: { editor_notes: editorNotes, editor_id: user?.id },
                          });
                        }}
                        className="px-4 py-2 border border-border rounded text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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

export default ManuscriptList;
