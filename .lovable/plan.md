# Add admin logo settings

## What will be built
- Add a **Settings** item to the management menu.
- Create a settings page where an administrator can upload, preview, replace, or restore the website logo.
- Apply the saved logo automatically in both the main header and footer, while keeping the current logo as a safe fallback.
- Show clear upload progress and validation for supported image files.

## Technical details
- Add a small `site_settings` record in Lovable Cloud for the active logo path, readable by visitors and editable only by administrators.
- Reuse the existing private media storage and protected photo endpoint for the uploaded logo, with administrator-only upload permissions.
- Add a shared site-brand query so the header and footer always use the latest saved logo and refresh immediately after an admin update.
- Preserve the current light-header dark logo treatment and the original-colour logo in the dark menu/footer.
- Verify administrator access, upload/replacement, fallback behavior, and desktop/mobile logo visibility.
