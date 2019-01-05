'use strict';

function warn(msg) {
    console.error(msg);
}

function makeMap(keys) {
    const map = Object.create(null);
    const arr = keys.split(',');
    for (let i = 0; i < arr.length; i++) {
        map[arr[i]] = true;
    }
    return k => map[key]
}

function toInt(v) {
    const r = parseInt(v);
    if (r === r) {
        return r
    }
    return 0
}

function max(...nums) {
    nums = nums.filter(n => typeof n === 'number' && n === n);
    return Math.max(...nums)
}

function query(el) {
    if (typeof el === 'string') {
        const selected = document.querySelector(el);
        if (!selected) {
            warn(
                'Cannot find element: ' + el
            );
            return document.createElement('div')
        }
        return selected
    } else {
        return el
    }
}

function getStyle(el, name) {
    const style = window.getComputedStyle(el)[name] || '';
    const check = makeMap('width,height,top,left,right,bottom');
    if (check(name)) {
        return toInt(style)
    }
    return style
}

function initOpts(options, e) {
    const el = e.el = query(options.el);
    const tools = e.tools = normalizeTools(options.tools);

    normalizeStyle(options);
}

function normalizeTools(tools) {
    if (!tools) {
        return []
    }
    return tools.split(' ')
}

function normalizeStyle(options, el) {
    w = options.width || getStyle(el, 'width');
    h = options.height || getStyle(el, 'height');
    options.width = max(w, 600);
    options.height = max(h, 300);
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "body {\r\n    height: 600px;\r\n    background: red;\r\n}";
styleInject(css);

let uid = 0;

class Editor {
    constructor(options) {
        this.init(options);
    }
    init(options) {
        const e = this;
        e.id = uid++;
            initOpts(options, e);
    }
}

module.exports = Editor;
