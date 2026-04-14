

## Plan: Add Delete and Upload for Archive Volumes from the Site

### What the user wants
- Admin can **delete** archive volumes directly from the archive page (or admin dashboard)
- Admin can **upload** new archive volumes from the archive page itself (not just from /admin/bulk-upload)
- The archive page should serve as the primary management interface for volumes

### Changes

**1. Update `src/pages/ArchivePage.tsx`**
- Add admin detection (check `useAuth()` for admin role)
- For admins, show a **delete button** (trash icon) on each DB volume card and each legacy volume card
- Add an **"Add Volume" button** at the top (visible only to admins) that opens a modal/inline form
- The upload form includes: title, authors, volume number, date, cover image, PDF file, article type (defaulting to "Archive Volume")
- On submit, upload files to storage, insert into `articles` table with `status: "published"` and `article_type: "Archive Volume"`
- On delete, call `supabase.from("articles").delete().eq("id", id)` and invalidate the query
- Legacy volumes (hardcoded) won't be deletable from DB but can be hidden — add a note or simply skip delete for those

**2. Update `src/pages/admin/AdminDashboard.tsx` (articles tab)**
- Add a filter/badge to distinguish "Archive Volume" and "Book" types in the articles table so admin can also manage them from the dashboard (already has delete functionality)

### Technical details

- Use `useAuth()` to get `user` and `role` — only show admin controls when `role === "admin"`
- Use `useMutation` for delete with `queryClient.invalidateQueries(["archive-volumes"])` 
- Upload form uses the same storage pattern as `AdminBulkUpload` (upload to `manuscripts` bucket under `covers/` and `pdfs/` folders)
- Modal built with existing `Dialog` component from `src/components/ui/dialog.tsx`
- Form fields: Title, Authors, Volume #, Published Date, Cover Image (file), PDF (file)
- Default `article_type` to "Archive Volume", `status` to "published"

### Files to modify
1. **`src/pages/ArchivePage.tsx`** — Add admin upload form (dialog), delete buttons on volume cards, auth check
2. **`src/pages/admin/AdminDashboard.tsx`** — Minor: add article_type column to articles table for visibility (optional improvement)

