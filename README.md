# KidsADA — Kids Card Page

A lightweight Persian card page designed to help someone contact a child's parents after opening a QR-code or NFC-card link.

The interface uses one reusable layout: a photograph, the child's name, and two large telephone links. It is built with HTML, CSS, and JavaScript, with no build step or framework.

## Current status

The page now loads the CSV dynamically, finds the unique row matching the URL, and displays its name, telephone numbers, and photograph. GitHub Pages clean-path routing is handled by `404.html`, which redirects to the main page with a card parameter; the app then restores the clean URL without reloading.

The homepage asks visitors to open or scan a card link. Unknown cards and data-loading failures display a message without showing another child's information. Missing photographs retain the shimmer placeholder. This is a public static prototype, not a private backend.

## Project structure

```text
kidsADA/
├── README.md
├── index.html                     # Page markup and asset-base handling
├── main.js                        # CSV lookup and card renderer
├── 404.html                       # GitHub Pages card-path fallback
├── .nojekyll                      # Serve static files without Jekyll
├── assets/
│   ├── styles.css                 # Layout, colors, fonts, and animation
│   ├── README.md
│   ├── fonts/
│   │   ├── Vazir-Regular.woff2
│   │   ├── Vazir-Bold.woff2
│   │   └── Vazir-LICENSE.txt
│   └── medias/
│       ├── kidsada-logo.png
│       ├── father.svg
│       └── mother.svg
└── kidsADA-data/
    ├── kids-identity.csv           # Exported identity table
    ├── kids-identity.numbers       # Editable Apple Numbers source
    ├── README.md
    └── faceimages/
        ├── img000002.jpg
        ├── img000003.jpg
        ├── img000004.jpg
        └── img000005.jpg
```

The current photo directory is named `faceimages`, not `kidsPicture`. Website styling, fonts, and branding live under `assets`; the sample data folder is a separate directory at the project root.

## Run locally

Open a terminal in the project directory and run:

```sh
python3 -m http.server 8765
```

Then open <http://localhost:8765/>. Stop the server with `Ctrl+C`.

Using a local web server will also support the future data-fetching workflow. Python's basic static server does not provide fallback routing for card paths.

## Open a card

Example after uploading the updated files:

<https://parviznarimani.github.io/kidsADA/pidp1112_keyp11112/>

The equivalent parameter URL also works:

<https://parviznarimani.github.io/kidsADA/?card=pidp1112_keyp11112>

Update the CSV and matching photographs to change card content. No JavaScript edits are needed for new records. Telephone rows use `tel:` links; the device controls dialing and any confirmation. Ten-digit Iranian mobile numbers beginning with 9 receive a leading 0 for dialing; numbers beginning with 989 and containing twelve digits receive a leading +. Other valid phone strings are preserved. Review the source numbers for correctness.

## Identity CSV

`kidsADA-data/kids-identity.csv` uses UTF-8 with a BOM to support Persian text in spreadsheet applications. Its first row must contain these five column names:

| Column | Meaning | Example |
| --- | --- | --- |
| `kidscard_url` | Unique card path relative to the site root | `pidp1111_keyp11111/` |
| `kidsname` | Name to display on the card | `آرین نمونه` |
| `kids_identity_number` | Unique internal identity used to match the photo | `img000001` |
| `father_phone` | Father's telephone number, stored as text | `+12025550101` |
| `mother_phone` | Mother's telephone number, stored as text | `+12025550102` |

Each row represents one identity/card. Keep both the card path and identity unique. The identity is an internal project identifier, not a government identity number. The current table uses `img` followed by six digits.

### Editing with Apple Numbers

1. Open `kids-identity.numbers`.
2. Set the identity and both phone columns to **Text** before entering values.
3. Edit or add records, keeping the five column names unchanged.
4. Save the Numbers document.
5. Choose **File → Export To → CSV**, select UTF-8 where offered, and replace `kids-identity.csv` in the same folder.

Saving the Numbers file alone does not update the CSV. CSV files do not preserve spreadsheet column types: when importing them, explicitly select Text for identifiers and telephone numbers to retain leading zeros and `+` signs.

The current CSV was exported from five Numbers records without changing their values. Some phone numbers in that source have no leading zero or `+`; correct the intended complete numbers in Numbers and export again before using them for calls.

## Photographs

Name each image exactly after its `kids_identity_number`, followed by its file extension:

```text
CSV identity: img000002
Photo path:   kidsADA-data/faceimages/img000002.jpg
```

Do not add a second `img` prefix. Keep the capitalization and leading zeros identical. Use one photo per identity; JPEG is the convention used by the current files. Square portraits suit the circular crop best; the page uses `object-fit: cover`.

Currently, images exist for `img000002` through `img000005`. No `img000001.jpg` has been supplied. A missing image shows the existing placeholder. The loader tries jpg, jpeg, png, and webp, in that order.

## Intended card-opening flow

1. A QR/NFC link opens the universal page with a card token.
2. The application resolves that token to one matching identity record.
3. The identity selects its photograph.
4. The page displays the name, photo, and parent-contact links.

For example, the CSV currently uses `pidp1111_keyp11111/` for its first record. This is different from the earlier illustrative token `pidp11111_keyp11111/`; use the exact stored value when connecting lookup.

## GitHub Pages deployment

Repository: <https://github.com/parviznarimani/kidsADA>

Expected main-page URL after successful deployment:

**<https://parviznarimani.github.io/kidsADA/>**

1. Upload this directory's **contents** to the repository, placing `index.html` directly at its root. Do not nest the whole project inside another `kidsADA` folder.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch containing the uploaded files and the **/(root)** folder, then save.
5. Wait for the Pages deployment to finish and open the published URL shown by GitHub.

See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Upload `404.html`, `.nojekyll`, `index.html`, `main.js`, `assets/`, and `kidsADA-data/` to the repository root. GitHub Pages initially returns a 404 response for a card path; the custom fallback redirects to the existing main page, which loads the record and restores the original clean path. Direct visits and refreshes both use this flow. JavaScript must be enabled. The initial 404 is expected in network logs.

## Data visibility

This repository is public. Committing identity records, Numbers documents, or photographs makes those files public; publishing them beside the site also makes them directly downloadable. The page's `noindex` directive is not access control.

Use fictional demonstration records and appropriate sample images in this public prototype. For real children's records, store the data and photographs privately and expose only the approved matching card information through a backend. Keep credentials out of browser JavaScript and public Git history. Anyone holding a card link can see the information the card is designed to display.

## Troubleshooting

- Main page returns 404: verify Pages publishing settings and deployment status.
- A card link stays on the fallback: ensure the latest `404.html` is at the publishing root and JavaScript is enabled.
- Card not found: match the URL token exactly to `kidscard_url`; do not repeat the same card URL across rows.
- Information could not load: check CSV availability, its five headers, matching field counts, and duplicate card URLs.
- Photograph remains a placeholder: check the exact identity filename, lowercase extension, and successful upload.
- Numbers edits do not appear: export to CSV, replace the repository's CSV, and wait for deployment.
- Incorrect telephone dialing: verify complete source phone numbers, stored as text.

## Credits

- KidsADA logo supplied for this project.
- Vazir fonts bundled with their license in `assets/fonts/Vazir-LICENSE.txt`.
- Shimmer placeholder adapted from the HTML example supplied for this project.

No project-wide software license has been selected in this repository.
