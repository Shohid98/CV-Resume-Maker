# ProCV Studio - Modular Project Structure

Apnar `3.html` file-ti alada HTML, CSS ebong 8-ti alada JS module-e bhag kora hoyeche jate nirdisto kono feature ba design khub sohojei change korte paren:

- `index.html` — Mul HTML layout, Modal ebong Editor-er structure.
- `css/style.css` — Print settings, Page size (A4, Letter, Legal, A5, B5), Font scale ebong custom styling.
- `js/firebase-config.js` — Firebase API keys ebong Authentication/Firestore setup.
- `js/state-auth.js` — Global `cvData` structure, Login/Signup, ebong Cloud Auto-Sync.
- `js/image-cropper.js` — Profile photo manual HD crop o filter logic.
- `js/editor-ui.js` — Tab switching, Template category selection, Page size, Margin ebong Drag & Drop section order.
- `js/dynamic-lists.js` — Experience, Projects, Education, Custom sections ebong automatic Year/Month/Day duration calculation.
- `js/templates.js` — **18-ti CV Template-er HTML design** (Kono template-er design change korte chaile ei file-e edit korun).
- `js/cover-letter-ats.js` — Auto Cover Letter generator, ATS Job Description matcher ebong Public Share link.
- `js/export-io.js` — Sample Data, Reset, JSON Import/Export ebong `.doc`, `.png`, `.html`, `.txt` export logic.

> **Note:** `firebase-config.js` jehetu `type="module"` hisebe load hoy, tai local computer-e run korar somoy VS Code-er **Live Server** (ba localhost server) diye `index.html` open korben.
