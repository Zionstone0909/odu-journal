import { Helmet } from "react-helmet-async";

const SITE_URL = "https://academic-gemstone-clone.lovable.app";
const DEFAULT_TITLE = "ODU: A Journal of West African Studies";
const DEFAULT_DESC = "ODU: A Journal of West African Studies – peer-reviewed, interdisciplinary scholarship on West Africa published by Obafemi Awolowo University Press.";
const DEFAULT_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4b356560-c835-4f08-b237-e830527d01dd/id-preview-5aa52a80--b842c51a-66c2-4e7f-b04c-7a588405dc92.lovable.app-1774429846583.png";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SEOHeadProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  article?: {
    authors?: string[];
    publishedTime?: string;
    section?: string;
    tags?: string[];
    doi?: string;
  };
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: BreadcrumbItem[];
}

const SEOHead = ({
  title,
  description = DEFAULT_DESC,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  article,
  noindex = false,
  jsonLd,
  breadcrumbs,
}: SEOHeadProps) => {
  const fullTitle = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const canonicalUrl = `${SITE_URL}${path}`;

  // Build BreadcrumbList JSON-LD
  const breadcrumbJsonLd = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  } : null;

  // Merge all JSON-LD
  const allJsonLd = [
    ...(jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []),
    ...(breadcrumbJsonLd ? [breadcrumbJsonLd] : []),
  ];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={DEFAULT_TITLE} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Article-specific */}
      {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} />}
      {article?.section && <meta property="article:section" content={article.section} />}
      {article?.authors?.map((author, i) => (
        <meta key={i} property="article:author" content={author} />
      ))}
      {article?.tags?.map((tag, i) => (
        <meta key={`tag-${i}`} property="article:tag" content={tag} />
      ))}

      {/* Scholarly metadata for AI/academic search */}
      {article?.doi && <meta name="citation_doi" content={article.doi} />}
      {article?.authors?.map((a, i) => (
        <meta key={`ca-${i}`} name="citation_author" content={a} />
      ))}
      {article?.publishedTime && <meta name="citation_publication_date" content={article.publishedTime} />}
      <meta name="citation_journal_title" content="ODU: A Journal of West African Studies" />
      <meta name="citation_publisher" content="Obafemi Awolowo University Press" />

      {/* JSON-LD */}
      {allJsonLd.length > 0 && allJsonLd.map((ld, i) => (
        <script key={`jsonld-${i}`} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
