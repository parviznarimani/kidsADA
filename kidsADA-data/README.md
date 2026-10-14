# Kids identity data

This folder is inside the project root for local sample-data development. Include only fictional sample data here: publishing this folder as static website files makes its contents publicly accessible. The CSV currently contains one fictional demonstration record, matching the sample card URL and displayed name. Phone numbers are fictional example numbers.

## Columns

- kidscard_url: unique card path, e.g. pidp11111_keyp11111/ (relative to the card site's domain).
- kidsname: displayed child name; Persian text is supported.
- kids_identity_number: unique internal identifier, stored as text; it is not a government identity number. Never reuse it for another child.
- father_phone: telephone number as text, including its leading zero or country prefix.
- mother_phone: telephone number as text, including its leading zero or country prefix.

Each row represents one child/card. Card paths and identity numbers must be unique. Leave an unavailable phone number blank.

## Photographs

Store each photo in faceimages/ and name it exactly after the identity number, with a lowercase extension: 000001.jpg, 000001.png, or 000001.webp. Use only one photograph per identity. The folder is intentionally empty because no child photograph was supplied. A missing photo should retain the page's placeholder.

## Editing

The CSV uses UTF-8 with BOM for Persian compatibility. CSV does not store column types: when importing into Excel or another spreadsheet app, explicitly import all five columns as Text to preserve leading zeros and plus signs. Save as UTF-8 CSV. Do not add spreadsheet formulas.

This creates the data structure only. The existing page still uses sample data in main.js; backend lookup and photo delivery are not connected yet.
