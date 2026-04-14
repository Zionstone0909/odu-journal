import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
};
