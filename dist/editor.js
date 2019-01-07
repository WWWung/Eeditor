(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Eeditor = factory());
}(this, function () { 'use strict';

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

  var css = ".editor-wrap {\r\n    border: 1px solid #e0e1e5;\r\n}\r\n\r\n.editor-toolbar {\r\n    height: 46px;\r\n    border-bottom: 1px solid rgba(0, 0, 0, .05);\r\n    padding: 10px 0;\r\n    box-sizing: border-box;\r\n    background: url('./imgs/ds.png');\r\n}";
  styleInject(css);

  function warn(msg) {
      console.error(msg);
  }

  function makeMap(keys) {
      const map = Object.create(null);
      const arr = keys.split(',');
      for (let i = 0; i < arr.length; i++) {
          map[arr[i]] = true;
      }
      return k => map[k]
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

  function elementCreater(html) {
      const div = document.createElement('div');
      if (!html) {
          return div
      }
      if (html.indexOf('<') >= 0) {
          div.innerHTML = html;
          return div.children[0]
      }
      return document.createElement(html)
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

      normalizeStyle(options, el);

      e.options = options;
  }

  function normalizeTools(tools) {
      if (!tools) {
          return []
      }
      return tools.split(' ')
  }

  function normalizeStyle(options, el) {
      const w = options.width || getStyle(el, 'width');
      const h = options.height || getStyle(el, 'height');
      options.width = max(w, 600);
      options.height = max(h, 300);
  }

  const hasHandler = makeMap('bold,italic,underline,lineThrough,fontSize,foreColor,link,code');

  function toolbarCreater(e, wrap) {
      const toolbar = elementCreater(`<div class="editor-toolbar"></div>`);

      wrap.appendChild(toolbar);
  }

  function draw(e) {
      const opts = e.options;
      const wrap = elementCreater(`<div id="editor-${e.id}" class="editor-wrap" style="width:${opts.width}px;height:${opts.height}px"></div>`);
      toolbarCreater(e, wrap);
      e.el.appendChild(wrap);
  }

  function init(Eeditor) {
      Eeditor.prototype.init = function(options) {
          initOpts(options, this);
          draw(this);
      };
  }

  let uid = 0;
  class Eeditor {
      constructor() {
          this.id = uid++;
      }
  }

  init(Eeditor);

  return Eeditor;

}));
