# KidsADA public card site

This package contains only the public card interface, fonts, branding, and icons. The CSV and children's photos are deliberately excluded.

Card URLs remain unchanged, for example:
https://parviznarimani.github.io/kidsADA/pidp1112_keyp11112/

The browser requests one record from the Cloudflare admin Worker at `/api/card/<token>`, then its image at `/api/card/<token>/photo`. It does not fetch the CSV or use a GitHub credential. The API origin is configured by API_BASE in main.js.

Upload this package's contents to the public kidsADA repository. Keep index.html, main.js, 404.html, and .nojekyll at the root. GitHub Pages should publish main /(root). Uploading replacement code DOES NOT delete an existing kidsADA-data directory: remove that directory from the public repository separately after verifying the private migration.

The admin Worker must be updated first, with GITHUB_REPO=kidsada-admin and a GitHub token permitted to access that private repository. Data belongs at kidsADA-data/ in the private repository root, never inside its public/ directory. The public card page continues to show a placeholder for missing photos.

The original public CSV/photos may remain in Git history and old deployments after current files are deleted. Repository history and old published artifacts require separate cleanup. Previously downloaded copies cannot be recalled.

For local development, serve this directory with a static server. Direct path URLs require the included GitHub Pages fallback or an equivalent local route. This production build talks to the production Cloudflare API, whose CORS policy permits the configured CARD_BASE_URL origin; localhost development requires a separate test Worker configuration.

Vazir's license is in assets/fonts/Vazir-LICENSE.txt.
