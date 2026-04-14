import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useArticleDetail = (articleId: string | undefined) => {
  const articleQuery = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) throw new Error("No article ID");
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", articleId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!articleId,
  });

  const authorsQuery = useQuery({
    queryKey: ["article-authors", articleId],
    queryFn: async () => {
      if (!articleId) return [];
      const { data, error } = await supabase
        .from("article_authors")
        .select("*")
        .eq("article_id", articleId)
        .order("author_order");
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!articleId,
  });

  const citationsQuery = useQuery({
    queryKey: ["article-citations", articleId],
    queryFn: async () => {
      if (!articleId) return [];
      const { data, error } = await supabase
        .from("citations")
        .select("*")
        .eq("citing_article_id", articleId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!articleId,
  });

  const metricsQuery = useQuery({
    queryKey: ["article-metrics", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      const { data, error } = await supabase
        .from("article_metrics")
        .select("*")
        .eq("article_id", articleId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!articleId,
  });

  const keywordsQuery = useQuery({
    queryKey: ["article-keywords", articleId],
    queryFn: async () => {
      if (!articleId) return [];
      const { data, error } = await supabase
        .from("article_keywords")
        .select("*")
        .eq("article_id", articleId);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!articleId,
  });

  const versionsQuery = useQuery({
    queryKey: ["article-versions", articleId],
    queryFn: async () => {
      if (!articleId) return [];
      const { data, error } = await supabase
        .from("article_versions")
        .select("*")
        .eq("article_id", articleId)
        .order("version_number", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!articleId,
  });

  return {
    article: articleQuery.data,
    authors: authorsQuery.data ?? [],
    citations: citationsQuery.data ?? [],
    metrics: metricsQuery.data,
    keywords: keywordsQuery.data ?? [],
    versions: versionsQuery.data ?? [],
    isLoading: articleQuery.isLoading,
    error: articleQuery.error,
  };
};
