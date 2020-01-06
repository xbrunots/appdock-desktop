var configCode = {
  highlight: [{
      highlight: ['OnClick{', 'OnLongClick{', 'OnFocusIn{', 'OnKeyPress{', 'OnTouch{',
        'OnDoubleClick{', 'OnFocusOut{', 'OnLoad{', 'comments{',  'onSwipeTop{',  'onSwipeRight{',  'onSwipeLeft{',  'onSwipeBottom{'
      ],
      className: 'code-event'
    },
    {
      highlight: '}',
      className: 'code-event-key'
    },
    {
      highlight: '::',
      className: 'code-invoke-key'
    },
    {
      highlight: ['true', 'false'],
      className: 'code-invoke-boolean'
    },
    {
      highlight: '->',
      className: 'code-invoke-key'
    },
    {
      highlight: '<-',
      className: 'imported-invoke-key'
    },
    {
      highlight: ['showSnack(', 'invoke(', 'showToast(', 'setIcon(', 'setText(', 'appendText(', 'fadeIn(',
        'fadeOut(', 'invokeAnimation(', 'shake(', 'countDown(', 'resize(', 'share(', 'enable(', 'disable(',
        'setTextColor(','startContainer(','translation(','moveY(','moveX(','rotateY(','rotateX(','rotate(', 'setRippleColor(','setImage(' ,'getRippleColor(','showPush(',  'setColor(', 'setCache(', 'getCache(',
        'date(', 'exec(', 'calc(', 'setTitle(', 'setBackgroundColor('

      ],
      className: 'code-method'
    },
    {
      highlight: ['import', '[', ']'],
      className: 'imported-for-mobile'
    },
    {
      highlight: ['import', ';', ')'],
      className: 'code-method'
    },
    {
      highlight: ['import', '[', ']'],
      className: 'imported-for-mobile'
    },
    {
      highlight: [' var '],
      className: 'variable-code'
    },
    {
      highlight: /\/[\*]+.*|g(oo|ee)se/gi,
      className: 'code-is-comments'
    },
    {
      highlight: /(\w+[.])|g(oo|ee)se/gi,
      className: 'code-is-element'
    },

    {
      highlight: /(\w+[=])|g(oo|ee)se/gi,
      className: 'code-is-element'
    },

    {
      highlight: /(\[!]+w)|g(oo|ee)se/gi,
      className: 'code-is-element'
    },

    {
      highlight: /(\$+\w+)|g(oo|ee)se/gi,
      className: 'variable-code'
    },

    {
      highlight: /(\#+\w+)|g(oo|ee)se/gi,
      className: 'color-code'
    }
  ]
}


function lightOrDark(color) {

  // Variables for red, green, blue values
  var r, g, b, hsp;

  // Check the format of the color, HEX or RGB?
  if (color.match(/^rgb/)) {

    // If HEX --> store the red, green, blue values in separate variables
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  } else {

    // If RGB --> Convert it to HEX: http://gist.github.com/983661
    color = +("0x" + color.slice(1).replace(
      color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  hsp = Math.sqrt(
    0.299 * (r * r) +
    0.587 * (g * g) +
    0.114 * (b * b)
  );

  // Using the HSP value, determine whether the color is light or dark
  if (hsp > 127.5) {

    return 'light';
  } else {

    return 'dark';
  }
}

// invoke(contact.phone)::button2.setText(Telefone:&& contact.phone);
$('.kotlin').highlightWithinTextarea(configCode);
