import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import { CheckCircle } from "lucide-react";

const SubscribePage = () => {
  return (
    <JournalLayout>
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl font-heading font-bold text-foreground">Subscribe</h1>
            <p className="text-foreground/80">
              Subscribe to ODU: A Journal of West African Studies to receive the latest research and stay connected with the academic community.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border-2 border-border rounded-lg p-6 bg-card">
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">Individual</h3>
                <p className="text-2xl font-bold text-primary mb-4">$120<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                <ul className="space-y-2 mb-6">
                  {["Print & online access", "2 issues per year", "Archive access", "Email alerts"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-secondary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">Subscribe</button>
              </div>

              <div className="border-2 border-primary rounded-lg p-6 bg-card relative">
                <span className="absolute -top-3 left-4 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">Recommended</span>
                <h3 className="font-heading font-bold text-lg text-foreground mb-1">Institutional</h3>
                <p className="text-2xl font-bold text-primary mb-4">$450<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                <ul className="space-y-2 mb-6">
                  {["Unlimited online access", "IP-based authentication", "COUNTER-compliant stats", "MARC records", "Multi-site license"].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-secondary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-primary text-primary-foreground py-2.5 rounded text-sm font-semibold hover:opacity-90 transition-opacity">Request a Quote</button>
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

export default SubscribePage;
