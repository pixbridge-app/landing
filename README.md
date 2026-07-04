# PixBridge Landing Page

Static landing website for PixBridge, a mobile Camera-to-API client that captures photos, sends images to a user-owned server API, and maps selected JSON fields into an app result screen.

## Project structure

```text
.
├── index.html
├── privacy/
│   └── index.html
├── terms/
│   └── index.html
├── ko/
│   ├── privacy/
│   │   └── index.html
│   ├── terms/
│   │   └── index.html
│   └── index.html
├── style.css
├── script.js
├── robots.txt
├── sitemap.xml
├── assets/
│   └── .gitkeep
└── README.md
```

## Local preview

Open `index.html` directly in a browser, or serve this folder with any static file server.

## GitHub Pages

This project uses only HTML, CSS, and vanilla JavaScript, so it can be deployed directly with GitHub Pages.

1. Push this folder to a GitHub repository.
2. In repository settings, enable GitHub Pages.
3. Select the branch and root directory containing `index.html`.

## Publishing checklist

- Testing participation CTA links to `https://tally.so/r/EkYk9l`.
- Review canonical, hreflang, Open Graph, `robots.txt`, and `sitemap.xml` before publishing.
- Review privacy policy and terms drafts before production release.
- Do not commit Flutter app source code to this landing repository.
- Do not commit Firebase configuration values.
- Do not commit API keys, private auth secrets, private server URLs, customer data, or real vehicle identifiers.

## Notes

The developer examples focus on Response Setting preset import files and a FastAPI server example. Keep any real endpoint URLs, auth values, and customer data out of this public landing repository.

The privacy policy and terms pages are early testing drafts. Review legal, business, and contact details before production release.

## Later release changes

- Change the top-right `Join testing` CTA to `Join us`.
- Change the early testing `Join testing` CTA to the Google Play join link.
- Add a `Contact us` CTA beside it for business email.
