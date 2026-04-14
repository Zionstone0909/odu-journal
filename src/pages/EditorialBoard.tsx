import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";

const EditorialBoard = () => {
  const boardMembers = [
    { role: "Editor-in-Chief", name: "Professor A. T. Akande" },
    { role: "Editor", name: "Professor G. O. Ajibade" },
    { role: "Editor", name: "Professor A. K. Makinde" },
    { role: "Desk/Managing Editor", name: "Dr. K. O. Ogunfolabi" },
  ];

  const advisoryBoard = [
    { name: "Professor Gbenga Fasiku" },
    { name: "Prof. F. A. Omidire" },
    { name: "Prof. S. E. O. Abiodun" },
    { name: "Professor K. A. Atilade" },
    { name: "Prof. S. B. Amusa" },
    { name: "Dr. S. T. Ogundipe" },
    { name: "Dr. O. O. Oyebode" },
    { name: "Dr. Kolawole Adeniyi" },
    { name: "Dr. I. S. Alimi", note: "Secretary" },
    { name: "Dr. T. A. Osunniran" },
    { name: "Dr. B. A. Bakare" },
    { name: "Dr. O. I. Olalere" },
    { name: "Dr. A. A. Ajiboro" },
  ];

  return (
    <JournalLayout>
      <SEOHead title="Editorial Board" description="Meet the editorial board of ODU: A Journal of West African Studies – editors, reviewers, and advisory members." path="/editorial-board" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Editorial Board" }]} />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">Editorial Board</h1>

            <div className="space-y-4">
              {boardMembers.map((member, i) => (
                <div key={i} className="border border-border rounded-lg p-4 bg-card">
                  <span className="text-xs font-bold text-secondary uppercase">{member.role}</span>
                  <h3 className="font-heading font-bold text-foreground mt-1">{member.name}</h3>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Advisory Editorial Board</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {advisoryBoard.map((member, i) => (
                  <div key={i} className="border border-border rounded-lg p-4 bg-card flex items-center gap-2">
                    <h3 className="font-heading font-bold text-foreground text-sm">{member.name}</h3>
                    {member.note && <span className="text-xs text-muted-foreground italic">({member.note})</span>}
                  </div>
                ))}
              </div>
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

export default EditorialBoard;
