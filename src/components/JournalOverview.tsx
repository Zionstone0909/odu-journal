import { useState } from "react";

const tabs = ["Aims and Scope", "Journal Metrics", "Editorial Board", "Author Guidelines"];

const JournalOverview = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section>
      <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Journal Overview</h2>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="py-6 text-sm leading-relaxed text-foreground/90 space-y-4">
        {activeTab === 0 && (
          <>
            <p>
              The purpose of <em className="font-heading font-bold not-italic">ODU: A Journal of West African Studies</em> is to provide a journal of international standing with a unique West African perspective, focusing on interdisciplinary scholarship across the region. The journal contributes to academic discourse on West African languages, cultures, history, politics, education, and social development.
            </p>
            <p>
              The journal seeks to promote the dissemination of ideas, points of view, teaching strategies and research on different aspects of West African societies, providing a forum for discussion on the whole spectrum of cultural, linguistic, and political studies in the region.
            </p>
            <p>
              ODU endorses a multidisciplinary approach and welcomes contributions not only from linguists, historians, and political scientists, but also from educationalists, anthropologists, sociologists, and scholars with a genuine interest in West African studies. All contributions are critically reviewed by at least two reviewers.
            </p>
          </>
        )}
        {activeTab === 1 && (
          <div className="space-y-3">
            <p className="font-semibold">Impact metrics coming soon.</p>
            <p>This journal is currently being indexed and metrics will be available in subsequent updates.</p>
          </div>
        )}
        {activeTab === 2 && (
          <div className="space-y-3">
            <p className="font-semibold">Editor-in-Chief</p>
            <p>Professor A. T. Akande</p>
            <p className="font-semibold mt-4">Editors</p>
            <p>Professor G. O. Ajibade</p>
            <p>Professor A. K. Makinde</p>
            <p className="font-semibold mt-4">Desk/Managing Editor</p>
            <p>Dr. K. O. Ogunfolabi</p>
          </div>
        )}
        {activeTab === 3 && (
          <div className="space-y-3">
            <p>Manuscripts should be submitted electronically through the online submission portal. Authors are encouraged to follow the journal's formatting guidelines available on the submission site.</p>
            <p>All submissions must be original, unpublished work not under consideration elsewhere.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default JournalOverview;
