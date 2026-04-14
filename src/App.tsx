import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/SearchPage";
import SubjectPage from "./pages/SubjectPage";
import BrowseJournals from "./pages/BrowseJournals";
import OpenAccess from "./pages/OpenAccess";
import OpenJournals from "./pages/OpenJournals";
import OpenSelect from "./pages/OpenSelect";
import PublishPage from "./pages/PublishPage";
import WhyPublish from "./pages/WhyPublish";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AboutPage from "./pages/AboutPage";
import AuthorGuidelines from "./pages/AuthorGuidelines";
import SubmitArticle from "./pages/SubmitArticle";
import BrowseIssues from "./pages/BrowseIssues";
import SubscribePage from "./pages/SubscribePage";
import EditorialBoard from "./pages/EditorialBoard";
import LibrariansPage from "./pages/LibrariansPage";
import SocietiesPage from "./pages/SocietiesPage";
import ManuscriptDashboard from "./pages/manuscript/ManuscriptDashboard";
import { ManuscriptSubmissions, ManuscriptUnderReview, ManuscriptAccepted, ManuscriptRejected, ManuscriptPublished } from "./pages/manuscript/ManuscriptStatusPages";
import ManuscriptReviewers from "./pages/manuscript/ManuscriptReviewers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBulkUpload from "./pages/admin/AdminBulkUpload";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";
import EditorialPoliciesPage from "./pages/EditorialPoliciesPage";
import SubmissionLogin from "./pages/submission/SubmissionLogin";
import SubmissionRegister from "./pages/submission/SubmissionRegister";
import SubmissionPending from "./pages/submission/SubmissionPending";
import SubmissionDashboard from "./pages/submission/SubmissionDashboard";
import SubmissionNew from "./pages/submission/SubmissionNew";
import SubmissionForgotPassword from "./pages/submission/SubmissionForgotPassword";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ArchivePage from "./pages/ArchivePage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContactPage from "./pages/ContactPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/subjects/:slug" element={<SubjectPage />} />
            <Route path="/browse-journals" element={<BrowseJournals />} />
            <Route path="/open-access" element={<OpenAccess />} />
            <Route path="/open-journals" element={<OpenJournals />} />
            <Route path="/open-select" element={<OpenSelect />} />
            <Route path="/open-access-articles" element={<BrowseIssues />} />
            <Route path="/publish" element={<PublishPage />} />
            <Route path="/why-publish" element={<WhyPublish />} />
            <Route path="/publish-guide" element={<PublishPage />} />
            <Route path="/calls-for-papers" element={<PublishPage />} />
            <Route path="/journal-suggester" element={<BrowseJournals />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/author-guidelines" element={<AuthorGuidelines />} />
            <Route path="/publication-ethics" element={<AuthorGuidelines />} />
            <Route path="/submit" element={<SubmitArticle />} />
            <Route path="/submit/continue" element={<LoginPage />} />
            <Route path="/current-issue" element={<BrowseIssues />} />
            <Route path="/all-issues" element={<BrowseIssues />} />
            <Route path="/most-read" element={<BrowseIssues />} />
            <Route path="/most-cited" element={<BrowseIssues />} />
            <Route path="/subscribe" element={<SubscribePage />} />
            <Route path="/editorial-board" element={<EditorialBoard />} />
            <Route path="/librarians" element={<LibrariansPage />} />
            <Route path="/societies" element={<SocietiesPage />} />
            <Route path="/alerts" element={<SubscribePage />} />
            <Route path="/rss" element={<SubscribePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/citation-search" element={<SearchPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/accessibility" element={<AboutPage />} />
            <Route path="/editorial-policies" element={<EditorialPoliciesPage />} />
            <Route path="/manuscript-center" element={<ManuscriptDashboard />} />
            <Route path="/manuscript-center/submissions" element={<ManuscriptSubmissions />} />
            <Route path="/manuscript-center/under-review" element={<ManuscriptUnderReview />} />
            <Route path="/manuscript-center/accepted" element={<ManuscriptAccepted />} />
            <Route path="/manuscript-center/rejected" element={<ManuscriptRejected />} />
            <Route path="/manuscript-center/published" element={<ManuscriptPublished />} />
            <Route path="/manuscript-center/reviewers" element={<ManuscriptReviewers />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/bulk-upload" element={<AdminBulkUpload />} />
            <Route path="/submission/login" element={<SubmissionLogin />} />
            <Route path="/submission/register" element={<SubmissionRegister />} />
            <Route path="/submission/pending" element={<SubmissionPending />} />
            <Route path="/submission/dashboard" element={<SubmissionDashboard />} />
            <Route path="/submission/new" element={<SubmissionNew />} />
            <Route path="/submission/forgot-password" element={<SubmissionForgotPassword />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/article/:id" element={<ArticleDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
