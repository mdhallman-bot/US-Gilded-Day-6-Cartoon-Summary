# Unit 2 Day 6 — Who Has Power?

November 4, 2026 · U.S. History · six-source Gilded Age review.

## Deployment package

The lesson package is maintained as `index.html`, `Code.gs`, and six images in `assets/` (tweed.jpg, protectors.jpg, pullman.jpg, carnegie.png, stranger.jpg, safety.jpg). Publish these exact paths at the repository root. All six original images are now committed and verified against the teacher-uploaded files. GitHub Pages may require a fresh reload to show them.

## Saving

`index.html` is configured to use the teacher's Day 6 Google Apps Script Web App. The backend writes only to `DAY6_STATES_2026_11_04` in the existing spreadsheet, with a separately configured `SHEET_ID`. No shared secret is used. Students must use non-identifying aliases. The UI distinguishes local saving from cloud verification and supports JSON backup/restore.

## Pre-class checklist

1. Confirm all six asset URLs resolve and the image zoom/return controls operate.
2. Enter the existing Google Sheet ID in the deployed `Code.gs` and verify that the Web App is deployed as **Execute as me / Anyone**.
3. Use a throwaway alias to test cloud save and resumption across two devices; do not send test responses to an existing student's record.
4. Check complete and long responses in both assignment PDF and emergency print/PDF.
5. Verify the student alias and completion percentage in the exported PDF.

The review day's formative asks students to classify six images and individually synthesize two visual sources around power. Original source descriptions distinguish newspaper illustration from cartoon and identify the biased portrayal in the immigration cartoon.

## App Script version warning

If the read-only diagnostic `/exec?action=load&alias=TEST99` returns `Set SHEET_ID in Code.gs first.`, the deployed `/exec` is still using the older Apps Script version. This repository's corrected `Code.gs` reads the `SHEET_ID` Script Property, but **updating this GitHub repository does not redeploy Google Apps Script**. In Apps Script select **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. Edit the *existing* deployment to retain the endpoint configured in `index.html`. If a new deployment is created instead, the URL in `index.html` must be updated to its new `/exec` link.
