# KidsADA card page

A Persian, responsive single-page visual prototype with bundled Vazir regular/bold fonts and a circular shimmer placeholder adapted from the provided HTML.

Serve this directory as a static site. For `/pidp11111_keyp11111/` and other token paths, configure the host to rewrite those requests to `index.html` with status 200. This page reads the path token but intentionally uses fictional sample data until the private API is connected. GitHub Pages does not provide arbitrary rewrite rules; a compatible host or an explicit routing strategy is required for these clean URLs.

Edit `sampleCard` in `main.js` to preview a name, photo URL, and phone numbers. Null numbers remain non-callable placeholders. Valid phone numbers become `tel:` links. Missing or failed images show the shimmer placeholder. Do not place actual private records or credentials in this public source.

Vazir font license is included in `assets/fonts/Vazir-LICENSE.txt`.

Example telephone links use reserved fictional US numbers +1 202 555 0101 and +1 202 555 0102. Replace these with approved numbers before use. The supplied KidsADA logo is stored in `assets/medias/kidsada-logo.png`.
