# binary_zpl_to_png

This small web tool converts ZPL (Zebra Programming Language) label files into PNG images using the Labelary API. It's useful when labels include embedded binary image data that labelary.com cannot show directly.

## Usage

Open the project in a static server (recommended). For a quick local test you can run:

```bash
python3 -m http.server 8000
# or
npx http-server -c-1 .
```

Then open http://localhost:8000 in your browser and upload a `.zpl` file.

## Notes & Privacy

This tool uploads the contents of the label file to the Labelary API (https://labelary.com). If your ZPL files contain sensitive data, do not upload them. For privacy or control, consider adding a server-side proxy that forwards requests to Labelary from your own infrastructure.

## Development & Linting

Install dev tools and run linters:

```bash
npm install
npm run lint:js
npm run lint:css
npm run lint:html
```

Run the browser smoke test:

```bash
npm test
```

## Contributions

Feel free to open issues or PRs. Add tests and CI if you make behavior changes.

## License

Add a license (e.g., MIT) if you want to allow reuse.
