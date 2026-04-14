import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";
import AddVolumeDialog from "@/components/archive/AddVolumeDialog";
import { Link } from "react-router-dom";
import { BookOpen, Download, ExternalLink, Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import oduCover from "@/assets/odu-cover.jpg";

const DRIVE_FOLDER = "https://drive.google.com/drive/folders/1YEDa_aHgLXcjdh526CImaMKYtN4o0EKi";

const legacyVolumes = [
  { number: "Vol. 1", date: "April 1969", label: "ODU Vol. 1", href: "/archive/ODU_No_1_April_1969.pdf" },
  { number: "Vol. 2", date: "Jan 1966", label: "ODU Vol. 2", href: DRIVE_FOLDER },
  { number: "Vol. 3", date: "April 1970", label: "ODU Vol. 3", href: DRIVE_FOLDER },
  { number: "Vol. 4", date: "Oct 1970", label: "ODU Vol. 4", href: DRIVE_FOLDER },
  { number: "Vol. 7", date: "April 1972", label: "ODU Vol. 7", href: "/archive/ODU_No_7_April_1972.pdf" },
  { number: "Vol. 8", date: "Oct 1972", label: "ODU Vol. 8", href: "/archive/ODU_No_8_Oct_1972.pdf" },
  { number: "Vol. 13", date: "Jan 1976", label: "ODU Vol. 13", href: "/archive/ODU_No_13_Jan_1976.pdf" },
  { number: "Vol. 14", date: "Jul 1976", label: "ODU Vol. 14", href: DRIVE_FOLDER },
  { number: "Vol. 15", date: "Jul 1977", label: "ODU Vol. 15", href: DRIVE_FOLDER },
  { number: "Vol. 16", date: "Jul 1977", label: "ODU Vol. 16", href: DRIVE_FOLDER },
  { number: "Vol. 17", date: "Jan 1978", label: "ODU Vol. 17", href: DRIVE_FOLDER },
  { number: "Vol. 18", date: "Jul 1978", label: "ODU Vol. 18", href: DRIVE_FOLDER },
  { number: "Vol. 19", date: "Jan–Jul 1979", label: "ODU Vol. 19", href: DRIVE_FOLDER },
  { number: "Vol. 20", date: "Jan–Jul 1980", label: "ODU Vol. 20", href: DRIVE_FOLDER },
  { number: "Vol. 21", date: "Jan–Jul 1981", label: "ODU Vol. 21", href: DRIVE_FOLDER },
  { number: "Vol. 22", date: "Jan–Jul 1982", label: "ODU Vol. 22", href: DRIVE_FOLDER },
  { number: "Vol. 24", date: "Jul 1983", label: "ODU Vol. 24", href: DRIVE_FOLDER },
  { number: "Vol. 25", date: "Jan 1984", label: "ODU Vol. 25", href: DRIVE_FOLDER },
  { number: "Vol. 26", date: "Jul 1984", label: "ODU Vol. 26", href: DRIVE_FOLDER },
  { number: "Vol. 27", date: "Jan 1985", label: "ODU Vol. 27", href: DRIVE_FOLDER },
  { number: "Vol. 28", date: "Jul 1985", label: "ODU Vol. 28", href: DRIVE_FOLDER },
  { number: "Vol. 29", date: "Jan 1986", label: "ODU Vol. 29", href: DRIVE_FOLDER },
  { number: "Vol. 30", date: "Jul 1986", label: "ODU Vol. 30", href: DRIVE_FOLDER },
  { number: "Vol. 33", date: "Jan 1988", label: "ODU Vol. 33", href: DRIVE_FOLDER },
  { number: "Vol. 34", date: "Jul 1988", label: "ODU Vol. 34", href: DRIVE_FOLDER },
  { number: "Vol. 35", date: "Jan 1989", label: "ODU Vol. 35", href: DRIVE_FOLDER },
  { number: "Vol. 37", date: "Jan–Jul 1990", label: "ODU Vol. 37", href: DRIVE_FOLDER },
  { number: "Vol. 38", date: "Jan–Jul 1991", label: "ODU Vol. 38", href: DRIVE_FOLDER },
  { number: "Vol. 39", date: "Jan–Jul 1999", label: "ODU Vol. 39", href: DRIVE_FOLDER },
  { number: "Vol. 40", date: "Jan–Jul 2000", label: "ODU Vol. 40", href: DRIVE_FOLDER },
  { number: "Vol. 41", date: "Jan–Jul 2001", label: "ODU Vol. 41", href: DRIVE_FOLDER },
  { number: "Vol. 42", date: "Aug–Dec 2001", label: "ODU Vol. 42", href: DRIVE_FOLDER },
  { number: "Vol. 43", date: "Jan–Jul 2002", label: "ODU JWAS Vol. 43", href: DRIVE_FOLDER },
];

const ArchivePage = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = role === "admin";

  const { data: dbVolumes = [], isLoading } = useQuery({
    queryKey: ["archive-volumes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, authors, volume, issue, published_date, cover_image_url, pdf_url, article_type, abstract")
        .in("article_type", ["Archive Volume", "Book"])
        .eq("status", "published")
        .order("volume", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive-volumes"] });
      toast({ title: "Volume deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    },
  });

  const dbVolumeNumbers = new Set(dbVolumes.map((v: any) => v.volume).filter(Boolean));
  const filteredLegacy = legacyVolumes.filter((lv) => {
    const volNum = parseInt(lv.number.replace("Vol. ", ""));
    return !dbVolumeNumbers.has(volNum);
  });

  return (
    <JournalLayout>
      <SEOHead title="Archive" description="Browse the complete archive of ODU: A Journal of West African Studies – volumes from 1969 to present." path="/archive" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Archive" }]} />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">
                  Archive — ODU: Journal of West African Studies
                </h1>
                <p className="text-muted-foreground mt-2">
                  Browse all published volumes of ODU (JWAS) from 1966 to present.
                </p>
                <a
                  href={DRIVE_FOLDER}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  View full collection on Google Drive
                </a>
              </div>
              {isAdmin && <AddVolumeDialog />}
            </div>

            {isLoading && (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* DB Volumes */}
            {dbVolumes.length > 0 && (
              <div>
                <h2 className="text-lg font-heading font-bold text-foreground mb-4">Recently Added Volumes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {dbVolumes.map((vol: any) => (
                    <div key={vol.id} className="group relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow">
                      {isAdmin && (
                        <button
                          onClick={() => deleteMutation.mutate(vol.id)}
                          disabled={deleteMutation.isPending}
                          className="absolute top-2 right-2 z-10 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/90"
                          title="Delete volume"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <Link to={`/article/${vol.id}`} className="block">
                        <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                          <img
                            src={vol.cover_image_url || oduCover}
                            alt={`${vol.title} cover`}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                            <span className="text-white text-xs font-bold leading-tight">
                              {vol.volume ? `Vol. ${vol.volume}` : vol.title}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 space-y-1">
                          <p className="text-xs font-heading font-bold text-foreground leading-tight line-clamp-2">
                            {vol.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {vol.published_date ? new Date(vol.published_date).toLocaleDateString("en-US", { year: "numeric", month: "short" }) : ""}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                            <Download className="h-3 w-3" /> View details
                          </span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Legacy Volumes */}
            {filteredLegacy.length > 0 && (
              <div>
                {dbVolumes.length > 0 && (
                  <h2 className="text-lg font-heading font-bold text-foreground mb-4">Historical Volumes</h2>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {filteredLegacy.map((vol) => (
                    <a
                      key={vol.label}
                      href={vol.href || DRIVE_FOLDER}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                        <img
                          src={oduCover}
                          alt={`${vol.label} cover`}
                          loading="lazy"
                          width={512}
                          height={704}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <span className="text-white text-xs font-bold leading-tight">
                            {vol.number}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-xs font-heading font-bold text-foreground leading-tight line-clamp-2">
                          {vol.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{vol.date}</p>
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                          <Download className="h-3 w-3" /> PDF
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center space-y-3">
              <BookOpen className="h-8 w-8 text-primary mx-auto" />
              <h2 className="text-lg font-heading font-bold text-foreground">About the Archive</h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                ODU: Journal of West African Studies has been a leading scholarly publication since 1966, covering diverse topics in African humanities, social sciences, and cultural studies.
              </p>
            </div>
          </div>
          <div>
            <JournalSidebar />
          </div>
        </div>
      </section>
    </JournalLayout>
  );
};

export default ArchivePage;
