const MAIN_COLOR = "#0CB345";
const ALT_COLOR = "transparent";
const TEXT_COLOR = "#ffffff";
const BUTTON_ACTION_TEXT = "Copied!";
const BUTTON_ACTION_WAIT_TIME = 1000;
const WAIT_TIME = 1000;

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

const copyText = (isMarkdown, targetObj) => {
  const url = window.location.href;
  const title = targetObj.titleDom.innerText;
  const value = buildClipboardValue(targetObj.descriptionDom, {
    title,
    url,
    isMarkdown,
  });

  const hiddenElement = document.createElement("textarea");
  hiddenElement.value = value;
  document.body.appendChild(hiddenElement);
  hiddenElement.select();
  document.execCommand("copy");
  document.body.removeChild(hiddenElement);
};

// Set a timeout to give the page time to load before adding the buttons.
setTimeout(() => {
  // Target Layouts
  const TARGETS = [
    {
      name: "originalLayout",
      titleDom: document.querySelector("[data-cy=question-title]"),
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: true,
      style: `
        position: absolute;
        top: 1rem;
        right: 0;
        display: flex;
      `,
      classList: [],
    },
    {
      name: "newLayout",
      titleDom: document.querySelector(
        ".mr-2.text-lg.font-medium.text-label-1.dark\\:text-dark-label-1"
      ),
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: false,
      style: "",
      classList: [
        "mt-1",
        "inline-flex",
        "min-h-20px",
        "items-center",
        "space-x-2",
        "align-top",
      ],
    },
    {
      name: "contestLayout",
      titleDom: document.querySelector(
        "#base_content > div.container > div > div > div.question-title.clearfix > h3"
      ),
      descriptionDom: document.querySelector(
        "div.question-content.default-content"
      ),
      useStyle: true,
      style: `display: flex;`,
      classList: [],
    },
    {
      name: "dynamicLayout",
      titleDom: document.querySelector(".text-title-large"),
      descriptionDom: document.querySelector(
        "[data-track-load=description_content]"
      ),
      useStyle: true,
      style: `display: flex;`,
      classList: [],
    },
  ];

  // Determine which target layout.
  let target;

  // Create a container for the buttons.
  const buttonContainer = document.createElement("div");

  // Filter target DOM that is not null
  const filteredTarget = TARGETS.filter((t) => {
    const _target = t.titleDom;
    if (_target) {
      return _target;
    }
  });

  const targetObject = filteredTarget[0];
  target = targetObject.titleDom;

  // Style button by layout
  if (targetObject.useStyle) {
    buttonContainer.style = targetObject.style;
  } else {
    targetObject.classList.forEach((i) => buttonContainer.classList.add(i));
  }

  if (target) {
    // Set the parent element's position to relative to allow for absolute positioning of the button container.
    target.parentElement.style = "position: relative; align-items: center";

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
        copyText(button === "copyMarkdown", targetObject);
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
