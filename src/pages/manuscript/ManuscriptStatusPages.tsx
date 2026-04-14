import ManuscriptList from "./ManuscriptList";

export const ManuscriptSubmissions = () => (
  <ManuscriptList title="All Submissions" description="View all submitted manuscripts" />
);

export const ManuscriptUnderReview = () => (
  <ManuscriptList filterStatus="under_review" title="Under Review" description="Manuscripts currently being reviewed" />
);

export const ManuscriptAccepted = () => (
  <ManuscriptList filterStatus="accepted" title="Accepted" description="Manuscripts accepted for publication" />
);

export const ManuscriptRejected = () => (
  <ManuscriptList filterStatus="rejected" title="Rejected" description="Manuscripts that were not accepted" />
);

export const ManuscriptPublished = () => (
  <ManuscriptList filterStatus="published" title="Published" description="Articles that have been published" />
);
