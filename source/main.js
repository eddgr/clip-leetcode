const MAIN_COLOR = "#0CB345";
const ALT_COLOR = "transparent";
const TEXT_COLOR = "#ffffff";
const BUTTON_ACTION_TEXT = "Copied!";
const BUTTON_ACTION_WAIT_TIME = 1000;
const WAIT_TIME = 5000;

// Object containing button text and extra styles
const BUTTON_MAP = {
  copy: {
    text: "Copy",
    extra: "margin-right: 1rem; width: 80px;",
  },
  copyMarkdown: {
    text: "Copy Markdown",
    extra: "width: 128px;",
  },
};

// Object containing html tags and their corresponding markdown syntax
const MARKDOWN = {
  "<div>": "",
  "</div>": "",
  "<p>": "",
  "</p>": "",
  "<u>": "",
  "</u>": "",
  "<ol>": "",
  "</ol>": "",
  "<ul>": "",
  "</ul>": "",
  "<li>": "- ",
  "</li>": "",
  "&nbsp;": "",
  "<em>": "",
  "</em>": "",
  "<strong>Input</strong>": "Input\n",
  "<strong>Output</strong>": "Output\n",
  "<strong>Explanation</strong>": "Explanation\n",
  "<strong>Input:</strong>": "Input:",
  "<strong>Output:</strong>": "Output:",
  "<strong>Explanation:</strong>": "Explanation:",
  "<strong>Input: </strong>": "Input: ",
  "<strong>Output: </strong>": "Output: ",
  "<strong>Explanation: </strong>": "Explanation: ",
  '<strong class="example">Example': "**Example",
  "<strong>": "**",
  "</strong>": "** ",
  "<pre>": "\n```\n",
  "</pre>": "```\n\n",
  "<code>": "`",
  "</code>": "`",
  "&lt;": "<",
  "&gt;": ">",
  "<sup>": "^",
  "</sup>": "",
  "	": "", // special tab
  "<span.*?>": "",
  "</span>": "",
};

const copyText = (isMarkdown) => {
  // Get the current URL.
  const url = window.location.href;

  // Try to find the elements for the old version of the website.
  let title;
  let descriptionContent;
  let text;
  let html;
  try {
    title = document.querySelector("[data-cy=question-title]").innerText;
    descriptionContent = Array.from(
      document.querySelector("[data-key=description-content]").children
    )[0].children[1];
    text = descriptionContent.textContent.replace(/(\n){2,}/g, "\n\n").trim();
    html = descriptionContent.innerHTML;
    if (text == null || html == null) {
      throw "Old version elements not found";
    }
  } catch (err) {
    // If the elements for the old version are not found, try finding the elements for the new version.
    title = document.querySelector(
      ".mr-2.text-lg.font-medium.text-label-1.dark\\:text-dark-label-1"
    ).innerText;
    descriptionContent = document.querySelector("._1l1MA");
    text = descriptionContent.textContent.replace(/(\n){2,}/g, "\n\n").trim();
    html = descriptionContent.innerHTML;
    // Removes unwanted elements.
    html = html
      .replace(/<div class=".*?" data-headlessui-state=".*?">/g, "")
      .replace(
        /<div id=".*?" aria-expanded=".*?" data-headlessui-state=".*?">/g,
        ""
      );
  }

  // Create a hidden textarea element.
  const hiddenElement = document.createElement("textarea");

  let value;
  if (isMarkdown) {
    let htmlToMarkdown = html;
    // Replace HTML elements with markdown equivalents.
    Object.keys(MARKDOWN).forEach((key) => {
      htmlToMarkdown = htmlToMarkdown.replace(
        new RegExp(key, "g"),
        MARKDOWN[key]
      );
    });
    // Format the markdown string and add the title and URL.
    value = `# [${title}](${url})\n\n${htmlToMarkdown
      .replace(/(\n){2,}/g, "\n\n")
      .trim()}`;
  } else {
    // Format the plain text string and add the title and URL.
    value = `URL: ${url}\n\n${title}\n\n${text}`;
  }

  // Set the value of the hidden textarea element.
  hiddenElement.value = value;
  // Add the element to the document.
  document.body.appendChild(hiddenElement);
  // Select the text in the element.
  hiddenElement.select();
  // Copy the text.
  document.execCommand("copy");
  // Remove the hidden element from the document.
  document.body.removeChild(hiddenElement);
};

// Set a timeout to give the page time to load before adding the buttons.
setTimeout(() => {
  // Try to find the old version elements.
  let target;

  // Create a container for the buttons.
  const buttonContainer = document.createElement("div");

  try {
    target = document.querySelector("[data-cy=question-title]");
    if (target == null) {
      throw "Old version elements not found";
    }
    buttonContainer.style = `
    position: absolute;
    top: 1rem;
    right: 0;
    display: flex;
  `;
  } catch (err) {
    // If the old version elements are not found, try finding the new version elements.
    target = document.querySelector(
      ".mr-2.text-lg.font-medium.text-label-1.dark\\:text-dark-label-1"
    );
    buttonContainer.classList.add(
      "mt-1",
      "inline-flex",
      "min-h-20px",
      "items-center",
      "space-x-2",
      "align-top"
    );
  }

  if (target) {
    // Set the parent element's position to relative to allow for absolute positioning of the button container.
    target.parentElement.style = "position: relative";

    // Set the base style for the buttons.
    const buttonStyle = `
      padding: 4px 4px;
      color: ${MAIN_COLOR};
      background: ${ALT_COLOR};
      border-radius: 12px;
      border: 1px solid ${MAIN_COLOR};
      font-size: 10px;
      cursor: pointer;
      text-align: center;
    `;

    // Loop through the buttons and add them to the button container.
    const buttons = ["copy", "copyMarkdown"];
    buttons.forEach((button) => {
      const _button = document.createElement("div");
      // Styling.
      _button.innerText = BUTTON_MAP[button].text;
      _button.style = BUTTON_MAP[button].extra
        ? buttonStyle + BUTTON_MAP[button].extra
        : buttonStyle;

      // Event listeners.
      _button.addEventListener("click", () => {
        copyText(button === "copyMarkdown");
        _button.innerText = BUTTON_ACTION_TEXT;
        setTimeout(
          () => (_button.innerText = BUTTON_MAP[button].text),
          BUTTON_ACTION_WAIT_TIME
        );
      });

      _button.addEventListener("mouseenter", () => {
        _button.style.background = MAIN_COLOR;
        _button.style.color = TEXT_COLOR;
      });

      _button.addEventListener("mouseleave", () => {
        _button.style.background = ALT_COLOR;
        _button.style.color = MAIN_COLOR;
      });

      // Add the button to the button container.
      buttonContainer.append(_button);
    });

    // Add the button container to the parent element.
    target.parentElement.appendChild(buttonContainer);
  }
}, WAIT_TIME);
