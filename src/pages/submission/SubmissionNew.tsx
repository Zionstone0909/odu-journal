import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Info, X, Trash2 } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import PortalHeader from "@/components/submission/PortalHeader";

const articleTypes = [
  "Research Article",
  "Review Article",
  "Short Communication",
  "Case Study",
  "Essay",
  "Book Review",
  "Commentary",
  "Letter to the Editor",
];

const journals = [
  "ODU: A Journal of West African Studies",
  "ODU: Journal of Social Sciences",
  "ODU: Journal of Humanities",
  "ODU: Journal of Education",
  "ODU: Journal of Science & Technology",
];

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

const STEPS = [
  { key: "manuscript", label: "Manuscript" },
  { key: "details", label: "Details" },
  { key: "authors", label: "Authors" },
  { key: "services", label: "Services" },
  { key: "preview", label: "Preview" },
];

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function validateFileName(name: string): string | null {
  if (name.length > 64) return "Filename too long (max 64 characters)";
  if (!/^[a-zA-Z0-9_.\- ]+$/.test(name)) return "Filename contains invalid characters (use alphanumeric, underscores, dashes, dots only)";
  return null;
}

const SubmissionNew = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Pre-step
  const [journal, setJournal] = useState("");
  const [journalSearch, setJournalSearch] = useState("");
  const [guidelinesRead, setGuidelinesRead] = useState(false);
  const [originalMaterial, setOriginalMaterial] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [articleType, setArticleType] = useState("");
  const [preStepDone, setPreStepDone] = useState(false);

  // Step 1: Manuscript
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [specialIssue, setSpecialIssue] = useState<"yes" | "no" | "">("");
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file: File; category: string; error: string | null }>>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<Array<{ file: File; category: string; error: string | null }>>([]);
  const [ethicsConfirmed, setEthicsConfirmed] = useState(false);
  const [aiPolicyConfirmed, setAiPolicyConfirmed] = useState(false);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [acknowledgementsConfirmed, setAcknowledgementsConfirmed] = useState(false);
  const [previouslyPublished, setPreviouslyPublished] = useState<"yes" | "no" | "">("");
  const [dataAvailabilityTerms, setDataAvailabilityTerms] = useState(false);
  const [dataAvailabilityStatement, setDataAvailabilityStatement] = useState(false);
  const [dataDoiUrl, setDataDoiUrl] = useState("");
  const [humanParticipants, setHumanParticipants] = useState<"yes" | "no" | "">("");
  const [manuscriptWordCount, setManuscriptWordCount] = useState("");

  // Step 2: Details (Subject/Keywords/Category)
  const [keywords, setKeywords] = useState("");
  const [subjectArea, setSubjectArea] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // Step 3: Authors
  const [authors, setAuthors] = useState("");
  const [correspondingEmail, setCorrespondingEmail] = useState("");
  const [orcid, setOrcid] = useState("");

  // Step 4: Services
  const [editingService, setEditingService] = useState(false);
  const [artworkService, setArtworkService] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [priceCents, setPriceCents] = useState("");

  const filteredJournals = journalSearch.length >= 3
    ? journals.filter((j) => j.toLowerCase().includes(journalSearch.toLowerCase()))
    : [];

  useEffect(() => {
    if (!loading && !user) {
      navigate("/submission/login");
    }
  }, [user, loading, navigate]);

  const canProceedPreStep = journal && guidelinesRead && originalMaterial && termsAccepted && articleType;

  const validateStep = (step: number): string[] => {
    const errors: string[] = [];
    if (step === 0) {
      if (!title.trim()) errors.push("Manuscript title is required");
      if (!abstract.trim()) errors.push("Abstract is required");
      if (!copyrightConfirmed) errors.push("Copyright confirmation is required");
      if (!ethicsConfirmed) errors.push("Ethics declaration is required");
      if (!aiPolicyConfirmed) errors.push("AI policy confirmation is required");
      if (uploadedFiles.length === 0) errors.push("At least one file is required");
    } else if (step === 1) {
      if (!keywords.trim()) errors.push("Keywords are required");
      if (!subjectArea) errors.push("Subject area is required");
      if (!category) errors.push("Category is required");
      if (category === "Custom" && !customCategory.trim()) errors.push("Custom category name is required");
    } else if (step === 2) {
      if (!authors.trim()) errors.push("Authors are required");
      if (!correspondingEmail.trim()) errors.push("Corresponding author email is required");
    }
    return errors;
  };

  const goToStep = (targetStep: number) => {
    // Allow going back freely
    if (targetStep < currentStep) {
      setStepErrors([]);
      setCurrentStep(targetStep);
      return;
    }
    // Validate current step before going forward
    const errors = validateStep(currentStep);
    if (errors.length > 0) {
      setStepErrors(errors);
      toast({ title: "Please complete required fields", description: errors[0], variant: "destructive" });
      return;
    }
    setStepErrors([]);
    setCurrentStep(targetStep);
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate all steps
    for (let i = 0; i < 4; i++) {
      const errors = validateStep(i);
      if (errors.length > 0) {
        setCurrentStep(i);
        setStepErrors(errors);
        toast({ title: "Incomplete submission", description: errors[0], variant: "destructive" });
        return;
      }
    }

    setSubmitting(true);

    let pdfUrl: string | null = null;
    const manuscriptEntry = uploadedFiles.find(f => f.category === "Manuscript - with author details");

    if (manuscriptEntry) {
      const fileExt = manuscriptEntry.file.name.split(".").pop();
      const filePath = `manuscripts/${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("manuscripts")
        .upload(filePath, manuscriptEntry.file);
      if (uploadError) {
        toast({ title: "Failed to upload manuscript", description: uploadError.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("manuscripts").getPublicUrl(filePath);
      pdfUrl = urlData.publicUrl;
    }

    const isAdmin = role === "admin";
    const articleStatus = isAdmin ? "published" : "submitted";
    const categoryValue = category === "Custom" ? customCategory.trim() || "General" : category || "General";
    const keywordsArray = keywords.split(",").map(k => k.trim()).filter(Boolean);

    const { data: articleData, error } = await supabase.from("articles").insert({
      title,
      authors,
      abstract,
      article_type: articleType,
      category: categoryValue,
      keywords: keywordsArray,
      is_locked: isLocked,
      price_cents: isLocked && priceCents ? parseInt(priceCents) : 0,
      access_type: isLocked ? "Paid" : "Open Access",
      pdf_url: pdfUrl,
      submitted_by: user.id,
      status: articleStatus,
      ...(isAdmin ? { published_date: new Date().toISOString() } : {}),
    } as any).select("id").single();

    if (error) {
      toast({ title: "Submission failed", description: error.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Upload additional files (cover letter, figures, etc.)
    const additionalFiles = uploadedFiles.filter(f => f.category !== "Manuscript - with author details");
    for (const af of additionalFiles) {
      const fileExt = af.file.name.split(".").pop();
      const filePath = `manuscripts/${user.id}/${Date.now()}-${af.category.replace(/\s+/g, '_')}.${fileExt}`;
      await supabase.storage.from("manuscripts").upload(filePath, af.file);
    }

    setSubmitting(false);
    toast({
      title: isAdmin ? "Article published!" : "Manuscript submitted!",
      description: isAdmin
        ? "Your article is now live on the platform."
        : "Your manuscript has been submitted for review.",
    });
    navigate(isAdmin ? "/admin" : "/submission/dashboard");
  };

  const handleSaveDraft = () => {
    toast({ title: "Draft saved", description: "Your progress has been saved locally. You can continue later." });
    // Save to localStorage
    const draft = {
      journal, articleType, title, abstract, keywords, subjectArea, category, customCategory,
      authors, correspondingEmail, orcid, specialIssue, manuscriptWordCount, dataDoiUrl,
      humanParticipants, previouslyPublished, isLocked, priceCents, currentStep, preStepDone,
      copyrightConfirmed, ethicsConfirmed, aiPolicyConfirmed, consentConfirmed,
      acknowledgementsConfirmed, dataAvailabilityTerms, dataAvailabilityStatement,
      editingService, artworkService,
    };
    localStorage.setItem(`submission_draft_${user?.id}`, JSON.stringify(draft));
  };

  // Load draft on mount
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`submission_draft_${user.id}`);
      if (saved) {
        try {
          const draft = JSON.parse(saved);
          if (draft.journal) setJournal(draft.journal);
          if (draft.articleType) setArticleType(draft.articleType);
          if (draft.title) setTitle(draft.title);
          if (draft.abstract) setAbstract(draft.abstract);
          if (draft.keywords) setKeywords(draft.keywords);
          if (draft.subjectArea) setSubjectArea(draft.subjectArea);
          if (draft.category) setCategory(draft.category);
          if (draft.customCategory) setCustomCategory(draft.customCategory);
          if (draft.authors) setAuthors(draft.authors);
          if (draft.correspondingEmail) setCorrespondingEmail(draft.correspondingEmail);
          if (draft.orcid) setOrcid(draft.orcid);
          if (draft.specialIssue) setSpecialIssue(draft.specialIssue);
          if (draft.manuscriptWordCount) setManuscriptWordCount(draft.manuscriptWordCount);
          if (draft.dataDoiUrl) setDataDoiUrl(draft.dataDoiUrl);
          if (draft.humanParticipants) setHumanParticipants(draft.humanParticipants);
          if (draft.previouslyPublished) setPreviouslyPublished(draft.previouslyPublished);
          if (draft.isLocked) setIsLocked(draft.isLocked);
          if (draft.priceCents) setPriceCents(draft.priceCents);
          if (draft.copyrightConfirmed) setCopyrightConfirmed(true);
          if (draft.ethicsConfirmed) setEthicsConfirmed(true);
          if (draft.aiPolicyConfirmed) setAiPolicyConfirmed(true);
          if (draft.consentConfirmed) setConsentConfirmed(true);
          if (draft.acknowledgementsConfirmed) setAcknowledgementsConfirmed(true);
          if (draft.dataAvailabilityTerms) setDataAvailabilityTerms(true);
          if (draft.dataAvailabilityStatement) setDataAvailabilityStatement(true);
          if (draft.editingService) setEditingService(true);
          if (draft.artworkService) setArtworkService(true);
          if (draft.preStepDone) setPreStepDone(true);
          if (typeof draft.currentStep === "number") setCurrentStep(draft.currentStep);
        } catch { /* ignore parse errors */ }
      }
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <PortalHeader showLogout userName={user?.email?.split("@")[0] || "Author"} showBackLink={false} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {!preStepDone ? (
            /* ── Pre-step: Journal selection & agreements ── */
            <div className="bg-card rounded-lg border border-border shadow-sm p-4 sm:p-8">
              <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Submission Creation</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Please complete the following before proceeding to your manuscript details.
              </p>

              <div className="space-y-6">
                {/* Submit to journal */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Submit to <span className="text-destructive">*</span>
                  </label>
                  <p className="text-xs text-muted-foreground mb-2">
                    To search for your preferred journal, type three or more letters
                  </p>
                  <input
                    value={journal || journalSearch}
                    onChange={(e) => { setJournalSearch(e.target.value); if (journal) setJournal(""); }}
                    className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Search for a journal..."
                  />
                  {filteredJournals.length > 0 && !journal && (
                    <ul className="mt-1 border border-border rounded bg-card shadow-sm max-h-40 overflow-y-auto">
                      {filteredJournals.map((j) => (
                        <li key={j} onClick={() => { setJournal(j); setJournalSearch(""); }}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-muted transition-colors">{j}</li>
                      ))}
                    </ul>
                  )}
                  {journal && <p className="text-xs text-primary mt-1 font-medium">Selected: {journal}</p>}
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">Instructions for authors</p>
                      <p className="text-xs text-muted-foreground">
                        Please review the <Link to="/author-guidelines" target="_blank" className="text-link hover:underline font-medium">author guidelines</Link> before proceeding.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={guidelinesRead} onChange={(e) => setGuidelinesRead(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">I have read the author guidelines for this journal</span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={originalMaterial} onChange={(e) => setOriginalMaterial(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                    <div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Original material</span>
                      <p className="text-xs text-muted-foreground mt-0.5">I have only submitted this article to this journal and it has not been published anywhere else</p>
                    </div>
                  </label>

                  <div className="border border-border rounded-lg p-4 bg-muted/30">
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">By submitting your article or content for publication you acknowledge and agree on behalf of yourself and all co-authors that, if it is accepted for publication:</p>
                    <ul className="space-y-2 text-xs text-muted-foreground list-disc pl-4">
                      <li>ODU's publishing terms, including on how you can share the article or content, will apply and take precedence over any other terms;</li>
                      <li>You or any co-author have not previously assigned or licensed rights to any other third party that would conflict with any rights to be granted in the publishing terms;</li>
                      <li>You and all co-authors are willing and able to proceed with publication.</li>
                    </ul>
                    <label className="flex items-start gap-3 cursor-pointer group mt-4 pt-3 border-t border-border">
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">I agree to the publishing terms above <span className="text-destructive">*</span></span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Select an article type <span className="text-destructive">*</span></label>
                  <p className="text-xs text-muted-foreground mb-2">The type of articles accepted by this journal are listed in the dropdown</p>
                  <select value={articleType} onChange={(e) => setArticleType(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select an article type</option>
                    {articleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="button" disabled={!canProceedPreStep} onClick={() => setPreStepDone(true)}
                    className="bg-primary text-primary-foreground px-8 py-2.5 rounded text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                    Start
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ── Step tabs ── */}
              <div className="flex items-center border-b border-border mb-6 bg-card rounded-t-lg overflow-x-auto">
                {STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => goToStep(i)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      currentStep === i
                        ? "border-primary text-primary bg-primary/5"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${
                      currentStep === i ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="bg-card rounded-lg border border-border shadow-sm p-4 sm:p-8">
                <p className="text-xs text-muted-foreground mb-4">
                  Submitting to <strong className="text-foreground">{journal}</strong> as a <strong className="text-foreground">{articleType}</strong>
                </p>

                {/* Validation errors */}
                {stepErrors.length > 0 && (
                  <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-sm font-medium text-destructive mb-2">Please fix the following:</p>
                    <ul className="text-sm text-destructive space-y-1 list-disc pl-4">
                      {stepErrors.map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                )}

                {/* ── Step 1: Manuscript ── */}
                {currentStep === 0 && (
                  <div className="space-y-8">

                    {/* Data Availability */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-4">Data Availability</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        This journal has a share upon reasonable request data policy, and authors are required to include a Data Availability Statement in their manuscript.
                      </p>
                      <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={dataAvailabilityTerms} onChange={(e) => setDataAvailabilityTerms(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">I confirm I understand the terms of the <a href="/editorial-policies" target="_blank" className="text-link hover:underline font-medium">share upon reasonable request data policy</a></span>
                        </label>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={dataAvailabilityStatement} onChange={(e) => setDataAvailabilityStatement(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">I confirm I have included a <a href="/author-guidelines" target="_blank" className="text-link hover:underline font-medium">Data Availability Statement</a> in my manuscript</span>
                        </label>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm text-muted-foreground mb-3">
                          If applicable, please provide the DOI or other location of your data. If you are sharing on request please add 'N/A'.
                        </p>
                        <div className="relative">
                          <input value={dataDoiUrl} onChange={(e) => setDataDoiUrl(e.target.value.slice(0, 100))}
                            className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="Enter a DOI or URL at which your data is deposited." />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{dataDoiUrl.length} / 100</span>
                        </div>
                      </div>
                    </div>

                    {/* Copyright */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-4">Copyright <span className="text-destructive">*</span></h2>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={copyrightConfirmed} onChange={(e) => setCopyrightConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">Confirm that you have seen, read and understood the publisher guidelines on <a href="/editorial-policies" target="_blank" className="text-link hover:underline font-medium">copyright and author rights</a>.</span>
                      </label>
                    </div>

                    {/* File Upload */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-4">File Upload <span className="text-destructive">*</span></h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Files <strong className="text-foreground">required</strong> for submission are listed below.
                      </p>

                      <div className="bg-muted/50 rounded p-3 mb-4 text-sm text-foreground space-y-1">
                        <p>Manuscript - with author details</p>
                        <p>Cover Letter</p>
                      </div>

                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <p className="text-sm text-foreground">
                          To maximize the impact of your research, editing services such as artwork preparation or manuscript formatting are available.
                        </p>
                      </div>

                      {uploadedFiles.length > 0 && (
                        <div className="mb-4 space-y-2">
                          {uploadedFiles.map((uf, i) => (
                            <div key={i} className="flex items-center justify-between bg-muted/50 rounded p-3 border border-border">
                              <div>
                                <p className="text-sm font-medium text-foreground">{uf.file.name}</p>
                                <p className="text-xs text-primary">{uf.category}</p>
                              </div>
                              <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          const files = Array.from(e.dataTransfer.files);
                          if (files.length > 0) {
                            setPendingFiles(files.map(f => ({ file: f, category: "", error: validateFileName(f.name) })));
                            setShowUploadModal(true);
                          }
                        }}
                      >
                        <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-foreground mb-1">Drag your research article and supporting files here</p>
                        <p className="text-xs text-muted-foreground mb-3">OR</p>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (files.length > 0) {
                              setPendingFiles(files.map(f => ({ file: f, category: "", error: validateFileName(f.name) })));
                              setShowUploadModal(true);
                            }
                            e.target.value = "";
                          }}
                          className="hidden"
                          id="main-upload"
                        />
                        <label htmlFor="main-upload" className="inline-block px-6 py-2.5 bg-foreground text-background rounded text-sm font-semibold cursor-pointer hover:opacity-90 transition-opacity">Choose files</label>
                      </div>

                      {!uploadedFiles.some(f => f.category === "Manuscript - with author details") && (
                        <p className="text-xs text-destructive mt-3">Please upload "Manuscript - with author details"</p>
                      )}
                    </div>

                    {/* Upload Files Modal */}
                    {showUploadModal && (
                      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                        <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-3xl max-h-[80vh] overflow-auto">
                          <div className="flex items-center justify-between p-6 border-b border-border">
                            <h3 className="text-lg font-heading font-bold text-foreground">Upload Files</h3>
                            <button type="button" onClick={() => { setShowUploadModal(false); setPendingFiles([]); }} className="text-muted-foreground hover:text-foreground transition-colors">
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                            <div className="flex-1 space-y-4">
                              {pendingFiles.map((pf, i) => (
                                <div key={i} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-foreground truncate max-w-[300px]">{pf.file.name}</p>
                                    <button type="button" onClick={() => setPendingFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive transition-colors">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                  <select
                                    value={pf.category}
                                    onChange={(e) => setPendingFiles(prev => prev.map((p, idx) => idx === i ? { ...p, category: e.target.value } : p))}
                                    className="w-full px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                                  >
                                    <option value="">Select a file category</option>
                                    <option>Manuscript - with author details</option>
                                    <option>Cover Letter</option>
                                    <option>Figure</option>
                                    <option>Table</option>
                                    <option>Supplementary Material</option>
                                    <option>Author Bio</option>
                                    <option>Manuscript - anonymous</option>
                                  </select>
                                  {pf.error && <p className="text-xs text-destructive">{pf.error}</p>}
                                </div>
                              ))}
                            </div>
                            <div className="w-full sm:w-56 shrink-0 bg-muted/50 rounded-lg p-4 border border-border">
                              <h4 className="text-sm font-bold text-foreground mb-3">File Upload Guidelines</h4>
                              <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
                                <li>File categories required for submission are marked with an asterisk.</li>
                                <li>The maximum size for a single file is 128 MB.</li>
                                <li>Filenames must use alphanumeric characters or underscores only (max 64 characters).</li>
                              </ol>
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 p-6 border-t border-border">
                            <button type="button" onClick={() => { setShowUploadModal(false); setPendingFiles([]); }}
                              className="px-5 py-2 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Cancel</button>
                            <button
                              type="button"
                              disabled={pendingFiles.some(pf => !pf.category || !!pf.error)}
                              onClick={() => {
                                setUploadedFiles(prev => [...prev, ...pendingFiles.filter(pf => pf.category && !pf.error)]);
                                setPendingFiles([]);
                                setShowUploadModal(false);
                              }}
                              className="px-5 py-2 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                              Upload
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Ethics Declarations */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Ethics Declarations <span className="text-destructive">*</span></h2>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={ethicsConfirmed} onChange={(e) => setEthicsConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">I confirm that all the research meets ethical guidelines and adheres to the legal requirements of the study country.</span>
                      </label>

                      <div className="mt-8">
                        <h3 className="text-base font-heading font-bold text-foreground mb-3">Generative Artificial Intelligence (AI) <span className="text-destructive">*</span></h3>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={aiPolicyConfirmed} onChange={(e) => setAiPolicyConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">I have read and agree to comply with the <a href="/editorial-policies" target="_blank" className="text-link hover:underline font-medium">ODU AI Policy</a>. I confirm that if I have used Generative AI tools at any point in the preparation of my manuscript, I have clearly disclosed the use.</span>
                        </label>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-base font-heading font-bold text-foreground mb-3">Human Participants</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          ODU requires authors of research involving human participants to adhere to the ICMJE guidelines, The Belmont Report, or the Declaration of Helsinki, as appropriate.
                        </p>
                        <p className="text-sm text-foreground mb-3">Does your study include human research participants?</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="humanParticipants" checked={humanParticipants === "yes"} onChange={() => setHumanParticipants("yes")} className="h-4 w-4 text-primary" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="humanParticipants" checked={humanParticipants === "no"} onChange={() => setHumanParticipants("no")} className="h-4 w-4 text-primary" />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-base font-heading font-bold text-foreground mb-3">Consent to Publish</h3>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={consentConfirmed} onChange={(e) => setConsentConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">I confirm that any identifiable participants have provided written consent to publish.</span>
                        </label>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-base font-heading font-bold text-foreground mb-3">Acknowledgements</h3>
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input type="checkbox" checked={acknowledgementsConfirmed} onChange={(e) => setAcknowledgementsConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                          <span className="text-sm text-foreground group-hover:text-primary transition-colors">I confirm that anyone listed under Acknowledgements has been informed and approves.</span>
                        </label>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-base font-heading font-bold text-foreground mb-3">Permissions</h3>
                        <p className="text-sm text-foreground mb-3">Are you using material that has been published before?</p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="previouslyPublished" checked={previouslyPublished === "yes"} onChange={() => setPreviouslyPublished("yes")} className="h-4 w-4 text-primary" />
                            <span className="text-sm">Yes</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" name="previouslyPublished" checked={previouslyPublished === "no"} onChange={() => setPreviouslyPublished("no")} className="h-4 w-4 text-primary" />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Manuscript Word Count */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Manuscript Word Count</h2>
                      <div className="relative">
                        <input value={manuscriptWordCount} onChange={(e) => setManuscriptWordCount(e.target.value.slice(0, 25))}
                          className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Please state your manuscript's word count" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{manuscriptWordCount.length} / 25</span>
                      </div>
                    </div>

                    {/* Manuscript Title & Abstract */}
                    <div className="bg-card rounded-lg border border-border p-4 sm:p-8">
                      <h2 className="text-xl font-heading font-bold text-foreground mb-6">Manuscript Details</h2>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Manuscript Title <span className="text-destructive">*</span></label>
                          <input value={title} onChange={(e) => setTitle(e.target.value)} required
                            className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="Enter the full title of your manuscript" />
                          <p className="text-xs text-muted-foreground mt-1">{wordCount(title)} / 50 Words</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Abstract <span className="text-destructive">*</span></label>
                          <textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} required rows={5}
                            className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
                            placeholder="Provide a concise summary of your manuscript" />
                          <p className="text-xs text-muted-foreground mt-1">{wordCount(abstract)} / 100 Words</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Are you submitting for a specific Special Issue?</label>
                          <p className="text-xs text-muted-foreground mb-2">Typically in response to a Call For Papers or Editor invitation</p>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="specialIssue" checked={specialIssue === "yes"} onChange={() => setSpecialIssue("yes")} className="h-4 w-4 text-primary" />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="radio" name="specialIssue" checked={specialIssue === "no"} onChange={() => setSpecialIssue("no")} className="h-4 w-4 text-primary" />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setPreStepDone(false)}
                        className="px-6 py-2.5 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Back</button>
                      <button type="button" onClick={() => goToStep(1)}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity">
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {/* ── Step 2: Details (Subject/Keywords/Category) ── */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-heading font-bold text-foreground">Subject Classification</h2>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Keywords <span className="text-destructive">*</span></label>
                      <input value={keywords} onChange={(e) => setKeywords(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="e.g. migration, identity, West Africa (separate with commas)" />
                      <p className="text-xs text-muted-foreground mt-1">Enter keywords separated by commas to help classify your article</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Subject Area <span className="text-destructive">*</span></label>
                      <select value={subjectArea} onChange={(e) => setSubjectArea(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="">Select a subject area</option>
                        {subjectAreas.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Category / Section <span className="text-destructive">*</span></label>
                      <select value={category} onChange={(e) => { setCategory(e.target.value); if (e.target.value !== "Custom") setCustomCategory(""); }}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30">
                        <option value="">Select a category</option>
                        {subjectAreas.map(s => <option key={s}>{s}</option>)}
                        <option value="Custom">Custom category...</option>
                      </select>
                    </div>
                    {category === "Custom" && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Custom Category <span className="text-destructive">*</span></label>
                        <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}
                          className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                          placeholder="Enter your custom category name" />
                      </div>
                    )}
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => goToStep(0)}
                        className="px-6 py-2.5 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Back</button>
                      <button type="button" onClick={() => goToStep(2)}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity">Next</button>
                    </div>
                  </div>
                )}

                {/* ── Step 3: Authors ── */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-heading font-bold text-foreground">Author Information</h2>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Authors <span className="text-destructive">*</span></label>
                      <input value={authors} onChange={(e) => setAuthors(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="e.g. John Smith, Jane Doe, Robert Johnson" />
                      <p className="text-xs text-muted-foreground mt-1">Separate multiple authors with commas. List in order of contribution.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">Corresponding Author Email <span className="text-destructive">*</span></label>
                      <input type="email" value={correspondingEmail} onChange={(e) => setCorrespondingEmail(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="corresponding.author@university.edu" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">ORCID iD</label>
                      <input value={orcid} onChange={(e) => setOrcid(e.target.value)}
                        className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                        placeholder="https://orcid.org/0000-0000-0000-0000" />
                      <p className="text-xs text-muted-foreground mt-1">Optional. Enter your ORCID identifier if available.</p>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => goToStep(1)}
                        className="px-6 py-2.5 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Back</button>
                      <button type="button" onClick={() => goToStep(3)}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity">Next</button>
                    </div>
                  </div>
                )}

                {/* ── Step 4: Services ── */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-heading font-bold text-foreground">Services & Access</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure editing services and access settings for your article.
                    </p>

                    <div className="border border-border rounded-lg p-5 space-y-4">
                      <h3 className="text-sm font-heading font-semibold text-foreground">Article Access</h3>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input type="checkbox" checked={isLocked} onChange={(e) => { setIsLocked(e.target.checked); if (!e.target.checked) setPriceCents(""); }}
                          className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                        <div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Lock this article (Paid Access)</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Readers will need to pay to download the full article.</p>
                        </div>
                      </label>
                      {isLocked && (
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">Price (₦) <span className="text-destructive">*</span></label>
                          <input type="number" min="0" value={priceCents} onChange={(e) => setPriceCents(e.target.value)}
                            className="w-full px-3 py-2.5 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder="e.g. 150000 (amount in kobo, 150000 = ₦1,500)" />
                          <p className="text-xs text-muted-foreground mt-1">Enter amount in kobo. Payment is via bank transfer.</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-sm font-heading font-semibold text-foreground">Editing Services</h3>
                      <label className="flex items-start gap-3 cursor-pointer group p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <input type="checkbox" checked={editingService} onChange={(e) => setEditingService(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                        <div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Manuscript Formatting Service</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Professional formatting to meet journal specifications</p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                        <input type="checkbox" checked={artworkService} onChange={(e) => setArtworkService(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/30" />
                        <div>
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Artwork Preparation Service</span>
                          <p className="text-xs text-muted-foreground mt-0.5">Professional preparation of figures and illustrations</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => goToStep(2)}
                        className="px-6 py-2.5 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Back</button>
                      <button type="button" onClick={() => goToStep(4)}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity">Next</button>
                    </div>
                  </div>
                )}

                {/* ── Step 5: Preview ── */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-heading font-bold text-foreground">Submission Preview</h2>
                    <p className="text-sm text-muted-foreground">Please review your submission details before final submission.</p>

                    <div className="space-y-4">
                      <PreviewBlock label="Journal & Type" value={`${journal} — ${articleType}`} />
                      <PreviewBlock label="Title" value={title || "—"} />
                      <PreviewBlock label="Abstract" value={abstract || "—"} />
                      <PreviewBlock label="Authors" value={authors || "—"} sub={correspondingEmail ? `Corresponding: ${correspondingEmail}` : undefined} />
                      <PreviewBlock label="Keywords & Subject" value={keywords || "—"} sub={subjectArea ? `Area: ${subjectArea} | Category: ${category === "Custom" ? customCategory : category}` : undefined} />
                      <div className="bg-muted/50 rounded-lg p-4 border border-border">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Files</h4>
                        {uploadedFiles.length > 0 ? (
                          <ul className="text-sm text-foreground space-y-1">
                            {uploadedFiles.map((uf, i) => (
                              <li key={i}>✓ {uf.file.name} <span className="text-xs text-muted-foreground">({uf.category})</span></li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-muted-foreground">— No files uploaded</p>
                        )}
                      </div>
                      <PreviewBlock label="Word Count" value={manuscriptWordCount || "—"} />
                      <PreviewBlock label="Access" value={isLocked ? `Paid Access — ₦${(parseInt(priceCents || "0") / 100).toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "Open Access (Free)"} />
                      <PreviewBlock label="Ethics" value={[
                        ethicsConfirmed ? "✓ Ethics confirmed" : "✗ Ethics not confirmed",
                        aiPolicyConfirmed ? "✓ AI policy confirmed" : "✗ AI policy not confirmed",
                        copyrightConfirmed ? "✓ Copyright confirmed" : "✗ Copyright not confirmed",
                      ].join(" | ")} />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button type="button" onClick={() => goToStep(3)}
                        className="px-6 py-2.5 border border-border rounded text-sm font-medium text-foreground hover:bg-muted transition-colors">Back</button>
                      <button type="button" disabled={submitting} onClick={handleSubmit}
                        className="px-8 py-2.5 bg-primary text-primary-foreground rounded text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                        {submitting ? "Submitting..." : "Submit Manuscript"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save as Draft floating button */}
              <div className="fixed bottom-6 right-6 z-50">
                <button type="button" onClick={handleSaveDraft} className="bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg hover:opacity-90 transition-opacity">
                  Save as Draft
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

const PreviewBlock = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-muted/50 rounded-lg p-4 border border-border">
    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{label}</h4>
    <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

export default SubmissionNew;
