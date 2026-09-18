## Description
Spend less time switching between your browser and code editor.

Use the Copy button to easily paste the problem, examples, and contraints in
your IDE for reference when you're working on your solution.

You can also use the Copy Markdown button for the formatted problem ready to
save as markdown.

Color-block example grids (CSS `.grid-container`) are converted to ASCII
grids such as `B W B` / `B W W` so the clipboard stays readable without
shipping page CSS or empty `&nbsp;` cells.

[Get the Chrome extension.](https://chrome.google.com/webstore/detail/clip-leetcode/cnghimckckgcmhbdokjielmhkmnagdcp)

## Local Setup
You can modify the source code and load the extension in Chrome locally:
- Go to `chrome://extensions/`
- Enable `Developer mode`
- `Load unpacked` and select the `source` folder

## Regression check
From the repo root, serve static files so `fetch` of the fixture works:

```
npx serve .
```

Then open `http://localhost:3000/tests/copy_pipeline.runner.html` in a
browser to assert Copy / Copy Markdown cleaning on problem 3127 HTML.

## Build
`source zip.sh` to build the zip file for upload.
