import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://academic-gemstone-clone.lovable.app";

const staticPages = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/about", changefreq: "monthly", priority: "0.8" },
  { loc: "/browse-journals", changefreq: "weekly", priority: "0.9" },
  { loc: "/search", changefreq: "weekly", priority: "0.8" },
  { loc: "/archive", changefreq: "monthly", priority: "0.8" },
  { loc: "/current-issue", changefreq: "weekly", priority: "0.9" },
  { loc: "/all-issues", changefreq: "monthly", priority: "0.7" },
  { loc: "/most-read", changefreq: "weekly", priority: "0.7" },
  { loc: "/most-cited", changefreq: "weekly", priority: "0.7" },
  { loc: "/open-access", changefreq: "monthly", priority: "0.7" },
  { loc: "/publish", changefreq: "monthly", priority: "0.7" },
  { loc: "/why-publish", changefreq: "monthly", priority: "0.6" },
  { loc: "/author-guidelines", changefreq: "monthly", priority: "0.8" },
  { loc: "/editorial-board", changefreq: "monthly", priority: "0.7" },
  { loc: "/editorial-policies", changefreq: "monthly", priority: "0.6" },
  { loc: "/subscribe", changefreq: "monthly", priority: "0.5" },
  { loc: "/librarians", changefreq: "monthly", priority: "0.5" },
  { loc: "/societies", changefreq: "monthly", priority: "0.5" },
  { loc: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { loc: "/terms", changefreq: "yearly", priority: "0.3" },
  { loc: "/submit", changefreq: "monthly", priority: "0.7" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published articles
    const { data: articles, error } = await supabase
      .from("articles")
      .select("id, published_date, title")
      .eq("status", "published")
      .not("published_date", "is", null)
      .order("published_date", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
    }

    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic article pages
    if (articles) {
      for (const article of articles) {
        const lastmod = article.published_date
          ? new Date(article.published_date).toISOString().split("T")[0]
          : now;
        xml += `  <url>\n`;
        xml += `    <loc>${SITE_URL}/article/${article.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Sitemap error:", err);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
