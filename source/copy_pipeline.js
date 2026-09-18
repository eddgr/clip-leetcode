/**
 * Shared copy pipeline: clone description DOM, convert color grids,
 * strip noise, then serialize to plain text or Markdown.
 */

/**
 * Count columns declared by grid-template-columns in style tags.
 * @param {Element} root
 * @returns {number|null}
 */
const countGridColumnsFromStyles = (root) => {
  const styles = root.querySelectorAll("style");
  for (const style of styles) {
    const match = style.textContent.match(
      /grid-template-columns\s*:\s*([^;}{]+)/i
    );
    if (!match) {
      continue;
    }
    const tokens = match[1]
      .trim()
      .split(/\s+/)
      .filter((token) => token.length > 0);
    if (tokens.length > 0) {
      return tokens.length;
    }
  }
  return null;
};

/**
 * Infer column count for a grid container.
 * @param {Element} container
 * @param {Element} root
 * @returns {number}
 */
const inferGridColumns = (container, root) => {
  const fromStyle = countGridColumnsFromStyles(root);
  if (fromStyle) {
    return fromStyle;
  }
  const childCount = container.children.length;
  const sqrt = Math.sqrt(childCount);
  if (Number.isInteger(sqrt) && sqrt > 0) {
    return sqrt;
  }
  return 3;
};

/**
 * Replace .grid-container color blocks with ASCII <pre> grids.
 * Must run before style tags are removed.
 * @param {Element} root
 */
const replaceColorGrids = (root) => {
  root.querySelectorAll(".grid-container").forEach((container) => {
    const cols = inferGridColumns(container, root);
    const cells = [...container.children];
    const lines = [];
    for (let i = 0; i < cells.length; i += cols) {
      const row = cells.slice(i, i + cols).map((cell) =>
        cell.classList.contains("grid-item-white") ? "W" : "B"
      );
      lines.push(row.join(" "));
    }
    const pre = document.createElement("pre");
    pre.textContent = lines.join("\n");
    container.replaceWith(pre);
  });
};

/**
 * Remove style/script/darkreader noise from a cloned description tree.
 * @param {Element} root
 */
const stripNoise = (root) => {
  root
    .querySelectorAll('style, script, [class*="darkreader"]')
    .forEach((node) => node.remove());
};

/**
 * Clone description DOM, convert grids, then strip noise.
 * @param {Element} descriptionDom
 * @returns {Element}
 */
const cloneAndClean = (descriptionDom) => {
  const root = descriptionDom.cloneNode(true);
  replaceColorGrids(root);
  stripNoise(root);
  return root;
};

/**
 * Collapse excessive blank lines and normalize nbsp.
 * @param {string} text
 * @returns {string}
 */
const normalizeWhitespace = (text) =>
  text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

/**
 * Recursively convert a DOM node to Markdown.
 * @param {Node} node
 * @returns {string}
 */
const nodeToMarkdown = (node) => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.replace(/\u00a0/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const el = /** @type {Element} */ (node);
  const tag = el.tagName.toLowerCase();
  const children = () =>
    [...el.childNodes].map((child) => nodeToMarkdown(child)).join("");

  switch (tag) {
    case "code":
      return `\`${el.textContent.replace(/\u00a0/g, " ")}\``;
    case "pre":
      return `\n\`\`\`\n${el.textContent.replace(/\u00a0/g, " ").trim()}\n\`\`\`\n\n`;
    case "strong":
    case "b":
      return `**${children()}**`;
    case "em":
    case "i":
      return `*${children()}*`;
    case "li":
      return `- ${children().trim()}\n`;
    case "ul":
    case "ol":
      return `${children()}\n`;
    case "p":
      return `${children()}\n\n`;
    case "br":
      return "\n";
    case "sup":
      return `^${children()}`;
    case "img": {
      const alt = el.getAttribute("alt") || "";
      const src = el.getAttribute("src") || "";
      return `![${alt}](${src})`;
    }
    case "u":
    case "span":
    case "font":
    default:
      return children();
  }
};

/**
 * Serialize cleaned root to Markdown body.
 * @param {Element} root
 * @returns {string}
 */
const toMarkdown = (root) => normalizeWhitespace(nodeToMarkdown(root));

/**
 * Extract visible plain text from a cleaned (possibly detached) root.
 * @param {Element} root
 * @returns {string}
 */
const extractPlainText = (root) => {
  const holder = document.createElement("div");
  // Do not use visibility:hidden — browsers omit that content from innerText.
  holder.style.cssText =
    "position:fixed;left:-9999px;top:0;width:800px;opacity:0;pointer-events:none;";
  holder.appendChild(root);
  document.body.appendChild(holder);
  const text = holder.innerText;
  document.body.removeChild(holder);
  return normalizeWhitespace(text);
};

/**
 * Build final clipboard value for Copy or Copy Markdown.
 * @param {Element} descriptionDom
 * @param {{title: string, url: string, isMarkdown: boolean}} options
 * @returns {string}
 */
const buildClipboardValue = (descriptionDom, options) => {
  const { title, url, isMarkdown } = options;
  const cleaned = cloneAndClean(descriptionDom);
  if (isMarkdown) {
    return `# [${title}](${url})\n\n${toMarkdown(cleaned)}`;
  }
  return `URL: ${url}\n\n${title}\n\n${extractPlainText(cleaned)}`;
};
