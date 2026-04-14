import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

const AddVolumeDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [volume, setVolume] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [abstract, setAbstract] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle(""); setAuthors(""); setVolume(""); setPublishedDate("");
    setAbstract(""); setCoverFile(null); setPdfFile(null);
  };

  const uploadMutation = useMutation({
    mutationFn: async () => {
      let coverUrl: string | null = null;
      let pdfUrl: string | null = null;
      const ts = Date.now();

      if (coverFile) {
        const ext = coverFile.name.split(".").pop();
        const path = `covers/${ts}_${coverFile.name}`;
        const { error } = await supabase.storage.from("manuscripts").upload(path, coverFile);
        if (error) throw error;
        const { data: pub } = supabase.storage.from("manuscripts").getPublicUrl(path);
        coverUrl = pub.publicUrl;
      }

      if (pdfFile) {
        const path = `pdfs/${ts}_${pdfFile.name}`;
        const { error } = await supabase.storage.from("manuscripts").upload(path, pdfFile);
        if (error) throw error;
        const { data: pub } = supabase.storage.from("manuscripts").getPublicUrl(path);
        pdfUrl = pub.publicUrl;
      }

      const { error } = await supabase.from("articles").insert({
        title: title || `ODU Vol. ${volume}`,
        authors: authors || "ODU Editorial Board",
        volume: volume ? parseInt(volume) : null,
        published_date: publishedDate || null,
        abstract: abstract || null,
        cover_image_url: coverUrl,
        pdf_url: pdfUrl,
        article_type: "Archive Volume",
        status: "published",
        access_type: "Open Access",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archive-volumes"] });
      toast({ title: "Volume added", description: "The archive volume has been published." });
      resetForm();
      setOpen(false);
    },
    onError: (err: any) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Volume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Archive Volume</DialogTitle>
          <DialogDescription>Upload a new volume with cover image and PDF.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <Label>Title</Label>
            <Input placeholder="e.g. ODU Vol. 44" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Authors</Label>
            <Input placeholder="e.g. ODU Editorial Board" value={authors} onChange={e => setAuthors(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Volume #</Label>
              <Input type="number" placeholder="44" value={volume} onChange={e => setVolume(e.target.value)} />
            </div>
            <div>
              <Label>Published Date</Label>
              <Input type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Abstract / Description</Label>
            <Textarea placeholder="Optional description…" value={abstract} onChange={e => setAbstract(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Cover Image</Label>
            <Input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} />
          </div>
          <div>
            <Label>PDF File</Label>
            <Input type="file" accept=".pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
          </div>
          <Button
            className="w-full"
            disabled={uploadMutation.isPending}
            onClick={() => uploadMutation.mutate()}
          >
            {uploadMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading…</> : "Publish Volume"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddVolumeDialog;
