const MAIN_COLOR = '#008000';
const ALT_COLOR = '#ffffff';
const BUTTON_ACTION_TEXT = 'Copied!';
const BUTTON_ACTION_WAIT_TIME = 1000;
const WAIT_TIME = 5000;
const BUTTON_MAP = {
  'copy': {
    text: 'Copy',
    extra: 'margin-right: 1rem; width: 80px;',
  },
  'copyMarkdown': {
    text: 'Copy Markdown',
    extra: 'width: 128px;',
  }
}
const MARKDOWN = {
  '<div>': '',
  '</div>': '',
  '<p>': '',
  '</p>': '',
  '<u>': '',
  '</u>': '',
  '<ol>': '',
  '</ol>': '',
  '<ul>': '',
  '</ul>': '',
  '<li>': '- ',
  '</li>': '',
  '&nbsp;': '',
  '<em>': '',
  '</em>': '',
  '<strong>Input</strong>': 'Input\n',
  '<strong>Output</strong>': 'Output\n',
  '<strong>Explanation</strong>': 'Explanation\n',
  '<strong>Input:</strong>': 'Input:',
  '<strong>Output:</strong>': 'Output:',
  '<strong>Explanation:</strong>': 'Explanation:',
  '<strong>Input: </strong>': 'Input: ',
  '<strong>Output: </strong>': 'Output: ',
  '<strong>Explanation: </strong>': 'Explanation: ',
  '<strong>': '**',
  '</strong>': '** ',
  '<pre>': '\n```\n',
  '</pre>': '\n```\n\n',
  '<code>': '`',
  '</code>': '`',
  '&lt;': '<',
  '&gt;': '>',
  '<sup>': '^',
  '</sup>': '',
  '	': '', // special tab
};

const copyText = (isMarkdown) => {
  const url = window.location.href;
  const title = document.querySelector('[data-cy=question-title]').innerText;
  const text = Array.from(
    document.querySelector('[data-key=description-content]').children
  )[0].children[1].innerText;

  const hiddenElement = document.createElement('textarea');

  const html = Array.from(
    document.querySelector('[data-key=description-content]').children
  )[0].children[1].innerHTML;

  if (isMarkdown) {
    let htmlToMarkdown = html;
    Object.keys(MARKDOWN).forEach(key => {
      htmlToMarkdown = htmlToMarkdown.replace(
        new RegExp(key, 'g'),
        MARKDOWN[key]
      );
    });
    hiddenElement.value = `# [${title}](${url})\n\n${htmlToMarkdown}`;
  } else {
    hiddenElement.value = `URL: ${url}\n\n${title}\n\n${text}`;
  }

  document.body.appendChild(hiddenElement);
  hiddenElement.select();
  document.execCommand('copy');
  document.body.removeChild(hiddenElement);
};

setTimeout(() => {
  const target = document.querySelector('[data-cy=question-title]');
  if (target) {
    target.parentElement.style = 'position: relative';

    const buttonContainer = document.createElement('div');
    buttonContainer.style = `
      position: absolute;
      top: 1rem;
      right: 0;
      display: flex;
    `;

    const buttonStyle = `
      padding: 8px 16px;
      color: ${MAIN_COLOR};
      border-radius: 24px;
      border: 1px solid ${MAIN_COLOR};
      font-size: 12px;
      cursor: pointer;
      text-align: center;
    `;

    const buttons = ['copy', 'copyMarkdown']

    buttons.forEach(button => {
      const _button = document.createElement('div');
      // styling
      _button.innerText = BUTTON_MAP[button].text;
      _button.style = BUTTON_MAP[button].extra
        ? buttonStyle + BUTTON_MAP[button].extra
        : buttonStyle;

      // event listeners
      _button.addEventListener('click', () => {
        copyText(button === 'copyMarkdown');
        _button.innerText = BUTTON_ACTION_TEXT;
        setTimeout(
          () => (_button.innerText = BUTTON_MAP[button].text),
          BUTTON_ACTION_WAIT_TIME
        );
      });

      _button.addEventListener('mouseenter', () => {
        _button.style.background = MAIN_COLOR;
        _button.style.color = ALT_COLOR;
      });

      _button.addEventListener('mouseleave', () => {
        _button.style.background = ALT_COLOR;
        _button.style.color = MAIN_COLOR;
      });

      // add to buttonContainer
      buttonContainer.append(_button);
    })

    target.parentElement.appendChild(buttonContainer);
  }
}, WAIT_TIME);
