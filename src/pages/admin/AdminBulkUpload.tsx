import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  FileText,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

const subjectAreas = [
  "Area Studies",
  "Arts",
  "Communication Studies",
  "Economics & Finance",
  "Education",
  "Geography",
  "Humanities",
  "Language & Literature",
  "Law",
  "Social Sciences",
  "Science & Technology",
];

interface JournalEntry {
  id: string;
  title: string;
  description: string;
  authors: string;
  articleType: string;
  accessType: string;
  category: string;
  customCategory: string;
  isLocked: boolean;
  priceCents: string;
  coverImage: File | null;
  coverImagePreview: string | null;
  pdfFile: File | null;
  keywords: string;
  volume: string;
  issue: string;
  doi: string;
  publishedDate: string;
  journalId: string;
  fullTextHtml: string;
  status: "idle" | "uploading" | "done" | "error";
  errorMsg?: string;
}

const blankEntry = (): JournalEntry => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  authors: "",
  articleType: "Research Article",
  accessType: "Open Access",
  category: "",
  customCategory: "",
  isLocked: false,
  priceCents: "",
  coverImage: null,
  coverImagePreview: null,
  pdfFile: null,
  keywords: "",
  volume: "",
  issue: "",
  doi: "",
  publishedDate: "",
  journalId: "",
  fullTextHtml: "",
  status: "idle",
});

const articleTypes = [
  "Research Article",
  "Review Article",
  "Short Communication",
  "Case Study",
  "Essay",
  "Book Review",
  "Commentary",
  "Letter to the Editor",
  "Archive Volume",
  "Book",
];

const AdminBulkUpload = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([blankEntry()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch journals for the dropdown
  const { data: journals = [] } = useQuery({
    queryKey: ["journals-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("journals").select("id, title").order("title");
      if (error) throw error;
      return data;
    },
  });

  const isAdmin = !loading && user && role === "admin";

  if (loading) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access denied. Admin only.</p>
      </div>
    );
  }

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const removeEntry = (id: string) => {
    if (entries.length === 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCoverImage = (id: string, file: File | null) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    updateEntry(id, { coverImage: file, coverImagePreview: preview });
  };

  const handlePdfFile = (id: string, file: File | null) => {
    if (!file) return;
    updateEntry(id, { pdfFile: file });
  };

  const uploadFile = async (
    file: File,
    folder: string
  ): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${user!.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("manuscripts")
      .upload(path, file);
    if (error) return null;
    const { data } = supabase.storage.from("manuscripts").getPublicUrl(path);
    return data.publicUrl;
  };

  const duplicateEntry = (entry: JournalEntry) => {
    const newEntry = {
      ...blankEntry(),
      articleType: entry.articleType,
      accessType: entry.accessType,
      category: entry.category,
      customCategory: entry.customCategory,
      isLocked: entry.isLocked,
      priceCents: entry.priceCents,
      journalId: entry.journalId,
    };
    setEntries((prev) => [...prev, newEntry]);
  };

  const handleBulkSubmit = async () => {
    const valid = entries.filter((e) => e.title.trim() && e.authors.trim());
    if (valid.length === 0) {
      toast({
        title: "No valid entries",
        description: "Each entry needs at least a title and authors.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setProgress(0);

    let completed = 0;
    for (const entry of valid) {
      updateEntry(entry.id, { status: "uploading" });

      try {
        let pdfUrl: string | null = null;
        let coverUrl: string | null = null;

        if (entry.pdfFile) {
          pdfUrl = await uploadFile(entry.pdfFile, "pdfs");
        }
        if (entry.coverImage) {
          coverUrl = await uploadFile(entry.coverImage, "covers");
        }

        const categoryValue = entry.category === "Custom"
          ? entry.customCategory.trim() || "General"
          : entry.category || "General";

        const { error } = await supabase.from("articles").insert({
          title: entry.title,
          authors: entry.authors,
          abstract: entry.description,
          article_type: entry.articleType,
          access_type: entry.isLocked ? "Paid" : entry.accessType,
          category: categoryValue,
          is_locked: entry.isLocked,
          price_cents: entry.isLocked && entry.priceCents ? parseInt(entry.priceCents) : 0,
          pdf_url: pdfUrl,
          cover_image_url: coverUrl,
          keywords: entry.keywords
            ? entry.keywords.split(",").map((k) => k.trim())
            : null,
          volume: entry.volume ? parseInt(entry.volume) : null,
          issue: entry.issue ? parseInt(entry.issue) : null,
          doi: entry.doi.trim() || null,
          published_date: entry.publishedDate || new Date().toISOString(),
          journal_id: entry.journalId || null,
          full_text_html: entry.fullTextHtml.trim() || null,
          submitted_by: user!.id,
          status: "published",
        } as any);

        if (error) throw error;
        updateEntry(entry.id, { status: "done" });
      } catch (err: any) {
        updateEntry(entry.id, {
          status: "error",
          errorMsg: err?.message || "Upload failed",
        });
      }

      completed++;
      setProgress(Math.round((completed / valid.length) * 100));
    }

    setIsSubmitting(false);
    const doneCount = entries.filter((e) => e.status === "done").length;
    toast({
      title: `${doneCount} of ${valid.length} articles published`,
      description:
        doneCount === valid.length
          ? "All articles are live!"
          : "Some uploads had errors. Check details below.",
    });
  };

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <SiteHeader />
      <SidebarProvider>
        <div className="flex flex-1 w-full">
          <AdminSidebar activeTab="articles" onTabChange={() => navigate("/admin")} />
          <main className="flex-1 p-6 md:p-10 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Admin
              </Link>

              <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-heading font-bold text-foreground">
                    Bulk Journal / Archive Upload
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload multiple journals, books, or archive volumes. All entries auto-publish immediately — no approval needed.
                  </p>
                </div>
                <Button
                  onClick={() => setEntries((prev) => [...prev, blankEntry()])}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Another
                </Button>
              </div>

              {isSubmitting && (
                <div className="mb-6">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Publishing... {progress}%
                  </p>
                </div>
              )}

              <div className="space-y-6">
                {entries.map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={`relative bg-card border rounded-xl p-6 shadow-sm transition-all ${
                      entry.status === "done"
                        ? "border-green-500/50 bg-green-50/30"
                        : entry.status === "error"
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border"
                    }`}
                  >
                    {/* Status badges */}
                    {entry.status === "done" && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-green-600 text-xs font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Published
                      </div>
                    )}
                    {entry.status === "uploading" && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-primary text-xs font-medium">
                        <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                      </div>
                    )}
                    {entry.status === "error" && (
                      <div className="absolute top-4 right-4 text-destructive text-xs font-medium">
                        ✗ {entry.errorMsg}
                      </div>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">
                        Entry #{idx + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        {entry.status === "idle" && (
                          <button
                            onClick={() => duplicateEntry(entry)}
                            className="text-xs text-primary hover:underline"
                            title="Duplicate this entry's settings"
                          >
                            Duplicate
                          </button>
                        )}
                        {entries.length > 1 && entry.status === "idle" && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Cover Image */}
                      <div className="md:row-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Cover Image
                        </label>
                        {entry.coverImagePreview ? (
                          <div className="relative group">
                            <img
                              src={entry.coverImagePreview}
                              alt="Cover preview"
                              className="w-full h-48 object-cover rounded-lg border border-border"
                            />
                            <button
                              onClick={() =>
                                updateEntry(entry.id, {
                                  coverImage: null,
                                  coverImagePreview: null,
                                })
                              }
                              className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">
                              Click to upload cover
                            </span>
                            <span className="text-xs text-muted-foreground/60">
                              JPG, PNG, WebP
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleCoverImage(
                                  entry.id,
                                  e.target.files?.[0] || null
                                )
                              }
                              disabled={entry.status !== "idle"}
                            />
                          </label>
                        )}
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Title <span className="text-destructive">*</span>
                        </label>
                        <Input
                          value={entry.title}
                          onChange={(e) =>
                            updateEntry(entry.id, { title: e.target.value })
                          }
                          placeholder="e.g. ODU: A Journal of West African Studies Vol. 12"
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* Authors */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Authors <span className="text-destructive">*</span>
                        </label>
                        <Input
                          value={entry.authors}
                          onChange={(e) =>
                            updateEntry(entry.id, { authors: e.target.value })
                          }
                          placeholder="e.g. J. Doe, A. Smith"
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* Description / Abstract */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Description / Abstract
                        </label>
                        <Textarea
                          value={entry.description}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              description: e.target.value,
                            })
                          }
                          placeholder="Brief description of the journal issue or book..."
                          rows={3}
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* Article Type */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Article Type
                        </label>
                        <select
                          value={entry.articleType}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              articleType: e.target.value,
                            })
                          }
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          disabled={entry.status !== "idle"}
                        >
                          {articleTypes.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Access Type */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Access Type
                        </label>
                        <select
                          value={entry.isLocked ? "Paid" : entry.accessType}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "Paid") {
                              updateEntry(entry.id, { isLocked: true, accessType: "Paid" });
                            } else {
                              updateEntry(entry.id, { isLocked: false, accessType: val, priceCents: "" });
                            }
                          }}
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          disabled={entry.status !== "idle"}
                        >
                          <option value="Open Access">Open Access</option>
                          <option value="Subscription">Subscription</option>
                          <option value="Paid">Paid (Locked)</option>
                        </select>
                      </div>

                      {/* Price (when locked) */}
                      {entry.isLocked && (
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Price (₦)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            value={entry.priceCents}
                            onChange={(e) =>
                              updateEntry(entry.id, { priceCents: e.target.value })
                            }
                            placeholder="e.g. 1500 (in kobo)"
                            disabled={entry.status !== "idle"}
                          />
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Amount in kobo (e.g. 150000 = ₦1,500)
                          </p>
                        </div>
                      )}

                      {/* Journal */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Journal
                        </label>
                        <select
                          value={entry.journalId}
                          onChange={(e) =>
                            updateEntry(entry.id, { journalId: e.target.value })
                          }
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          disabled={entry.status !== "idle"}
                        >
                          <option value="">— Select journal (optional) —</option>
                          {journals.map((j: any) => (
                            <option key={j.id} value={j.id}>{j.title}</option>
                          ))}
                        </select>
                      </div>

                      {/* DOI */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          DOI
                        </label>
                        <Input
                          value={entry.doi}
                          onChange={(e) =>
                            updateEntry(entry.id, { doi: e.target.value })
                          }
                          placeholder="e.g. 10.1234/odu.v12.2024"
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* Published Date */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Published Date
                        </label>
                        <Input
                          type="date"
                          value={entry.publishedDate}
                          onChange={(e) =>
                            updateEntry(entry.id, { publishedDate: e.target.value })
                          }
                          disabled={entry.status !== "idle"}
                        />
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Leave blank for today's date
                        </p>
                      </div>

                      {/* Category / Section */}
                      <div className={entry.category === "Custom" ? "md:col-span-1" : ""}>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Category / Section
                        </label>
                        <select
                          value={entry.category}
                          onChange={(e) =>
                            updateEntry(entry.id, {
                              category: e.target.value,
                              customCategory: e.target.value !== "Custom" ? "" : entry.customCategory,
                            })
                          }
                          className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          disabled={entry.status !== "idle"}
                        >
                          <option value="">Select a category</option>
                          {subjectAreas.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                          <option value="Custom">Custom category...</option>
                        </select>
                      </div>

                      {entry.category === "Custom" && (
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Custom Category
                          </label>
                          <Input
                            value={entry.customCategory}
                            onChange={(e) =>
                              updateEntry(entry.id, { customCategory: e.target.value })
                            }
                            placeholder="Enter custom category name"
                            disabled={entry.status !== "idle"}
                          />
                        </div>
                      )}

                      {/* Volume & Issue */}
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Volume
                          </label>
                          <Input
                            type="number"
                            value={entry.volume}
                            onChange={(e) =>
                              updateEntry(entry.id, { volume: e.target.value })
                            }
                            placeholder="e.g. 12"
                            disabled={entry.status !== "idle"}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-foreground mb-1.5">
                            Issue
                          </label>
                          <Input
                            type="number"
                            value={entry.issue}
                            onChange={(e) =>
                              updateEntry(entry.id, { issue: e.target.value })
                            }
                            placeholder="e.g. 1"
                            disabled={entry.status !== "idle"}
                          />
                        </div>
                      </div>

                      {/* Keywords */}
                      <div>
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Keywords
                        </label>
                        <Input
                          value={entry.keywords}
                          onChange={(e) =>
                            updateEntry(entry.id, { keywords: e.target.value })
                          }
                          placeholder="e.g. history, culture, Africa"
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* Full Text / HTML Content */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          Full Text / HTML Content (optional)
                        </label>
                        <Textarea
                          value={entry.fullTextHtml}
                          onChange={(e) =>
                            updateEntry(entry.id, { fullTextHtml: e.target.value })
                          }
                          placeholder="Paste full article text or HTML content here..."
                          rows={4}
                          disabled={entry.status !== "idle"}
                        />
                      </div>

                      {/* PDF Upload */}
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-foreground mb-1.5">
                          PDF File
                        </label>
                        {entry.pdfFile ? (
                          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                            <FileText className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-sm text-foreground truncate flex-1">
                              {entry.pdfFile.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {(entry.pdfFile.size / 1024 / 1024).toFixed(1)} MB
                            </span>
                            {entry.status === "idle" && (
                              <button
                                onClick={() =>
                                  updateEntry(entry.id, { pdfFile: null })
                                }
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <label className="flex items-center gap-3 p-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors">
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload PDF
                            </span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) =>
                                handlePdfFile(
                                  entry.id,
                                  e.target.files?.[0] || null
                                )
                              }
                              disabled={entry.status !== "idle"}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mt-8 mb-12 flex-wrap">
                <Button
                  onClick={handleBulkSubmit}
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none md:px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Publish All ({entries.filter((e) => e.status === "idle" && e.title.trim()).length})
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEntries((prev) => [...prev, blankEntry()])}
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Entry
                </Button>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
      <SiteFooter />
    </div>
  );
};

export default AdminBulkUpload;
