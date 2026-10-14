# KidsADA — Kids Card Page

A lightweight Persian card page designed to help someone contact a child's parents after opening a QR-code or NFC-card link.

The interface uses one reusable layout: a photograph, the child's name, and two large telephone links. It is built with HTML, CSS, and JavaScript, with no build step or framework.

## Current status

This is a **visual prototype**. The page currently displays `sampleCard` from `main.js`. It does not yet read the CSV or select a child's photograph from the identity folder.

Implemented:

- Persian right-to-left layout and locally bundled Vazir regular/bold fonts.
- Responsive green card, blue name strip, and small KidsADA logo at the top-left.
- Circular photograph area with a shimmer placeholder for absent or failed images.
- Father and mother icons, large phone numbers, and full-row `tel:` links.
- Accessible contact labels, keyboard focus outlines, and reduced-motion support.
- Links to card requests, the KidsADA homepage, and support.
- Sample identity data in CSV, with a separate photograph folder.

Still to implement:

- Record lookup based on the card URL.
- Data loading and photo selection using the identity number.
- Hosting-compatible routing for individual card URLs.
- Unknown-card, inactive-card, and data-loading error states.
- A private backend and protected storage for real records.

## Project structure

```text
kidsADA/
├── README.md
├── index.html                     # Page markup and asset-base handling
├── main.js                        # Current sample data and card renderer
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

## Edit the current preview

Change `sampleCard` in `main.js`:

```js
const sampleCard = {
  name: 'آرین نمونه',
  photo: null,
  father: '+12025550101',
  mother: '+12025550102'
};
```

The numbers above are fictional demonstration numbers. Set `photo` to an existing relative image path, such as `kidsADA-data/faceimages/img000002.jpg`, to preview a photograph. Use `null` to keep the placeholder.

Phone numbers must be strings containing 7–15 ASCII digits with an optional leading `+`. A valid number becomes a `tel:` link, while the page displays its digits in Persian. Blank or invalid numbers remain non-callable placeholders. Tapping a valid row opens the device's telephone handler; the operating system controls any confirmation and the actual call.

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

Currently, images exist for `img000002` through `img000005`. No `img000001.jpg` has been supplied. When photo lookup is implemented, a missing image should show the existing placeholder.

## Intended card-opening flow

1. A QR/NFC link opens the universal page with a card token.
2. The application resolves that token to one matching identity record.
3. The identity selects its photograph.
4. The page displays the name, photo, and parent-contact links.

For example, the CSV currently uses `pidp1111_keyp11111/` for its first record. This is different from the earlier illustrative token `pidp11111_keyp11111/`; use the exact stored value when connecting lookup.

The current script recognizes the shape of a path token but does not use it for record lookup. Query-string lookup is also not implemented. Changing the URL or CSV today will not change the displayed sample card.

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

GitHub Pages can serve the main static page, but an arbitrary URL such as `/kidsADA/pidp1111_keyp11111/` will not automatically resolve to `index.html`. Choose and implement a routing strategy before issuing card links. A query parameter can avoid static-host path routing, but requires corresponding lookup code; clean paths require supported routing or generated entry pages.

## Data visibility

This repository is public. Committing identity records, Numbers documents, or photographs makes those files public; publishing them beside the site also makes them directly downloadable. The page's `noindex` directive is not access control.

Use fictional demonstration records and appropriate sample images in this public prototype. For real children's records, store the data and photographs privately and expose only the approved matching card information through a backend. Keep credentials out of browser JavaScript and public Git history. Anyone holding a card link can see the information the card is designed to display.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Main page returns 404 | Pages is enabled, the deployment succeeded, and `index.html` is at the selected publishing root. |
| A card-specific path returns 404 | Token routing has not been implemented for this static host. |
| CSV edits do not appear on the page | CSV lookup is not connected yet; the current preview uses `sampleCard`. |
| Numbers edits are missing from the CSV | Export the Numbers table to CSV again. |
| Photograph stays a placeholder | The current `photo` value is null, or its path cannot load; data-driven selection is not connected yet. |
| Phone number cannot be dialed correctly | Restore the complete number as text, including the intended zero or country prefix. |
| Fonts or icons fail to load | Preserve the `assets` folder paths and filename capitalization when uploading. |

## Credits

- KidsADA logo supplied for this project.
- Vazir fonts bundled with their license in `assets/fonts/Vazir-LICENSE.txt`.
- Shimmer placeholder adapted from the HTML example supplied for this project.

No project-wide software license has been selected in this repository.
