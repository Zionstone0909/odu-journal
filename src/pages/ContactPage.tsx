import { useState } from "react";
import JournalLayout from "@/components/JournalLayout";
import JournalSidebar from "@/components/JournalSidebar";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, MapPin, Clock } from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_inquiries").insert({
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    });
    setLoading(false);
    if (error) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({ title: "Message sent", description: "We'll get back to you soon." });
    }
  };

  return (
    <JournalLayout>
      <SEOHead
        title="Contact"
        description="Get in touch with the ODU editorial team. Submit your questions, feedback, or inquiries about ODU: A Journal of West African Studies."
        path="/contact"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-heading font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground leading-relaxed">
              Have a question about submissions, subscriptions, or the journal? The editorial team is here to help. Fill out the form below and we'll respond as soon as possible.
            </p>

            {submitted ? (
              <div className="rounded-md border border-border bg-muted/50 p-8 text-center space-y-3">
                <Mail className="mx-auto h-10 w-10 text-primary" />
                <h2 className="text-xl font-heading font-semibold text-foreground">Thank you for your message</h2>
                <p className="text-muted-foreground">We have received your inquiry and will respond within 2–3 business days.</p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ full_name: "", email: "", subject: "", message: "" }); }}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 border border-border rounded-md p-6 bg-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your full name" maxLength={100} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" maxLength={255} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="e.g. Submission inquiry" maxLength={200} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Write your message here…" rows={6} maxLength={2000} required />
                </div>
                <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {loading ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <JournalSidebar />
            <div className="rounded-md border border-border bg-card p-5 space-y-4">
              <h3 className="font-heading font-semibold text-foreground">Editorial Office</h3>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Obafemi Awolowo University Press, Ile-Ife, Osun State, Nigeria</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>odu.journal@oauife.edu.ng</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Response time: 2–3 business days</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </JournalLayout>
  );
};

export default ContactPage;
