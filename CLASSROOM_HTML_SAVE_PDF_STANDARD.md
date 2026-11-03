# Classroom HTML — Save, Resume, PDF and Deployment Standard (v1.2)

**Applies to:** U.S. History, Personal Finance, and other student-facing GitHub Pages assignments. **Priority:** student work survives > visual polish. **Reference implementations:** U.S. History Unit 2 Day 3 (strong saving conventions), Day 5 (known save/export regressions), and Day 6 (confirmed endpoint mismatch). This document is a release contract, not permission to modify an existing live lesson.

## Teacher–assistant handoff: fixed sequence

1. **Teacher provides an EXISTING Google Spreadsheet ID** (the ID between `/d/` and `/edit`), lesson title, and target assignment. **Assistant confirms the lesson namespace and tab name** and produces a complete `Code.gs` file. The canonical configuration is **Apps Script Project Settings → Script properties → `SHEET_ID`**, never a hardcoded ID and never an assistant-created spreadsheet unless explicitly requested.
2. **Teacher pastes `Code.gs` in a NEW Apps Script project**, adds `SHEET_ID` to Script Properties, authorizes it, and deploys one Web App (**execute as Me; access Anyone** only if school policy permits). Teacher supplies the *exact* `/exec` URL.
3. **Assistant copies the exact supplied deployment URL into the student HTML**. The assistant verifies equality character-for-character between the teacher-provided URL and the URL in the committed `index.html`. Never use an older URL, guess an endpoint, or silently create a second deployment. A new version of the same deployment keeps its URL.
4. **Teacher provides the GitHub repository URL**. Assistant confirms its owner and repository, uploads `index.html`, all images/assets at their expected relative paths, and any required supporting files. No broken asset references; never claim upload unless the repository tree has been checked.
5. **Assistant verifies/read-audits the published GitHub HTML** (not just the local copy), exact endpoint and asset paths. Teacher runs the brief live end-to-end test below. Only then mark ready for students.

**Do not** create another saving architecture per lesson. Copy the frozen, currently verified baseline and change only the lesson ID, tab name, response field IDs, content, and the teacher's Web App URL. Backend and front-end must use the **same contract version**. Any save-layer change requires its own regression test before deployment.

## Canonical save contract

- Each lesson has a unique immutable `lessonId`, storage namespace, and spreadsheet tab. Student aliases must be normalized consistently (trim/uppercase) and must not contain student names or school IDs.
- Each response control has a **stable unique field ID**. Every input/select/textarea/radio/slider and the final written synthesis must appear in the state schema, saved record, completion calculation, restore, and PDF.
- **Require alias and load attempt before enabling editing.** Never initialize blank fields over recovered data. Do not start a new-device save before the existing cloud state has been loaded or a deliberate offline branch is identified.
- **Local save is immediate** on every meaningful change. Cloud autosave is debounced, serialized, and survives/retries pending work without silently discarding it on reload. Retain local data until actual cloud confirmation.
- **Cloud acknowledgement is factual, not optimistic.** A `no-cors` fetch resolving does NOT prove saving. Use the frozen baseline's real acknowledgement and/or read-after-write verification of the exact saved snapshot. Status must distinguish `Saved on this device`, `Saving to cloud`, `Cloud verified`, `Cloud unavailable`, and `Conflict`.
- Save uses a revision number, stable request ID for retries, and lock/concurrency handling. Reject stale writes and never silently overwrite, replace, or merge different local/cloud versions. In a conflict, protect both copies and display a clear action.
- A separate teacher-only recovery section may offer JSON backup/export and restore; do **not** present JSON as an ordinary student submission. Students see only **Save now**, **Download Assignment PDF**, and **Emergency PDF**.
- No shared secret in HTML or GitHub; user has chosen no shared secret for this workflow. **Important limitation:** alias-only endpoints are not secure identity verification. Keep Sheets private, do not store sensitive information, and do not treat aliases as authorization.

## Nonnegotiable language, writing, and completion supports

- **Generous Tier 2 and Tier 3 vocabulary help:** Identify and define both academic words (Tier 2) and discipline-specific words (Tier 3) throughout student directions, captions, historical context, source transcriptions, and guiding questions where appropriate. When uncertain whether a term may hinder understanding, **include a hover/tap/focus definition**. Explain phrases and historical usages as well as isolated words. Definitions must be concise, readable, high contrast, and available by keyboard and touch as well as mouse; do not give away students' interpretations or answers.
- **Two sentence frames for each written text box**, displayed right beside the response field and unlabeled by proficiency level. The first is a more accessible structural opening; the second invites more nuanced reasoning or explanation. Neither frame supplies historical conclusions, selects evidence for students, or writes their answer. Use field-specific frames, including the final synthesis response, rather than repeating an unrelated generic sentence.
- **Completion grade on every exported PDF, at the TOP:** Print clearly `Completion grade: XX% (N of M required responses completed)` on page one, beside the student alias and lesson title. This is a completion-only metric, not a teacher-assigned quality grade. Apply the same in Emergency PDF and any other saved PDF. Use filled required response fields as the denominator, not optional tools or interface actions. Do not apply a 50-point academic grading floor to this displayed completion percentage unless the teacher explicitly requests that rule.
- Every new build's accessibility and PDF checklist explicitly verifies the tooltip coverage, keyboard/tap use, both frames for every written response, and completion grade in **every** PDF pathway.

## Offline-safe PDF dependencies (mandatory)

- Never rely on a third-party CDN for a **critical student action** such as Assignment PDF export. Vendor the approved, version-pinned PDF library into the lesson's GitHub repository and reference it by a local relative path, e.g. `assets/jspdf.umd.min.js`. Preserve its copyright/license notice.
- A dependency's mere presence in HTML is not proof it loaded. Check the published page's actual PDF export with school/Chromebook network restrictions; if library loading fails, show an explicit fallback to Emergency PDF without losing student answers.
- Verify all external fonts, images, scripts, and stylesheet dependencies needed for saving, recovery, PDFs, and accessibility are available in the published site or have tested offline-safe alternatives. Student deliverables must not fail merely because a third-party host is blocked.
- Regression: Day 6's primary PDF failed with “PDF library unavailable” because jsPDF was linked through Cloudflare CDN. The fix vendors jsPDF 2.5.2 as `assets/jspdf.umd.min.js` in the same GitHub Pages repository.

## PDF contract

- **Download Assignment PDF** produces a readable, data-driven PDF from the response state, not a screenshot of clipped textareas and not a serialized “Save Answered HTML” page.
- Include lesson, student alias, completion grade/percentage (filled required fields, **not score**), date as appropriate, image/source references, **every response in full**, and pagination/line-wrapping for very long answers. Avoid giant unreadable base64/data URL dumps.
- **Emergency PDF** is a genuinely separate print/save-as-PDF fallback. Do not remove or replace it when changing the primary PDF.
- Never assume the PDF works because the download button works; **open and inspect the produced PDF** with short and 1,000+ character answers, all field types, and a multi-page response.

## Frozen release gates (required before students see the link)

1. Exact `SHEET_ID` Script Property present; backend diagnostic from the **same deployment URL in HTML** returns `ok:true` with unused alias; correct lesson/tab.
2. Enter test answers with throwaway alias, obtain **confirmed cloud save**; verify the correct row/tab exists (no real student records touched).
3. Reload same browser and recover every field; recover on a second browser/device using the prescribed identity method.
4. Test offline or backend failure: local copy remains, status reports cloud failure, retry later succeeds without losing edits.
5. Test two tabs / stale version conflict; older work must not silently overwrite newer work.
6. Check PDF contains complete content for every field and 1,000+ character writing; check alias, **completion grade prominently at top**, and pages. Check Emergency PDF has the same grade. Verify both unlabeled sentence frames for every text box and generous Tier 2/3 hover/tap/focus help throughout.
7. Check all images load from the published GitHub Pages URL, including enlarge/zoom/return, and the input state does not reset.
8. Audit browser console for broken assets and errors. Only announce “classroom-ready” for checks actually completed; report any unchecked items.

## Why these rules exist

- **Day 3:** established alias-first entry, normalized identity, local persistence, revision/request-ID safeguards, pending-save warnings, cloud resume and PDF conventions.
- **Day 5:** pre-alias answers could be at risk; pending saves were less durable; the “Save Answered HTML” file rendered as alphanumeric/data text, whereas Emergency PDF remained readable. Student identity displayed as “not set” in a recovered artifact. Exact cause of the malformed/file-view outcome was not conclusively established.
- **Day 6:** new code introduced unnecessary variation, and the HTML used the wrong Web App deployment URL even as the teacher updated a different deployment. A good direct GET test against the *correct* URL did not prove the HTML used that URL. The old URL error survived until the HTML URL was corrected and refreshed.

## Keep this cross-project

Add this document to **both** the U.S. History and Personal Finance project's files/instructions. In each new build request say: “Follow Classroom HTML Save/PDF Standard v1.2; use the frozen verified reference implementation, and perform the release gates.” If a new issue is discovered, update the standard once, then use the revised version in both projects.

**No changes to a working live lesson's save layer without explicit authorization and a rollback plan.**
