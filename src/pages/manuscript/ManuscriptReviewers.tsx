import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ManuscriptLayout from "@/components/manuscript/ManuscriptLayout";
import { Users } from "lucide-react";

const ManuscriptReviewers = () => {
  const { data: reviewers = [], isLoading } = useQuery({
    queryKey: ["reviewers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("role", "reviewer");
      if (error) throw error;

      if (data.length === 0) return [];

      const userIds = data.map((r: any) => r.user_id);
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email, institution")
        .in("id", userIds);
      if (pErr) throw pErr;
      return profiles || [];
    },
  });

  return (
    <ManuscriptLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Reviewers</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage peer reviewers</p>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : reviewers.length === 0 ? (
          <div className="border border-border rounded-lg p-8 bg-card text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No reviewers registered yet</p>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Institution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reviewers.map((r: any) => (
                  <tr key={r.id} className="hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 text-foreground font-medium">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{r.email}</td>
                    <td className="py-3 px-4 text-muted-foreground">{r.institution || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ManuscriptLayout>
  );
};

export default ManuscriptReviewers;
