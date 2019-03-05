(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Eeditor = factory());
}(this, function () { 'use strict';

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  function warn(msg) {
      console.error(msg);
  }

  function makeMap(keys) {
      var map = Object.create(null);
      var arr = keys.split(',');
      for (var i = 0; i < arr.length; i++) {
          map[arr[i]] = true;
      }
      return function (k) {
          return map[k];
      };
  }

  function toInt(v) {
      var r = parseInt(v);
      if (r === r) {
          return r;
      }
      return 0;
  }

  function getMax() {
      for (var _len = arguments.length, nums = Array(_len), _key = 0; _key < _len; _key++) {
          nums[_key] = arguments[_key];
      }

      nums = nums.filter(function (n) {
          return typeof n === 'number' && n === n;
      });
      return Math.max.apply(Math, toConsumableArray(nums));
  }

  function getMin() {
      for (var _len2 = arguments.length, nums = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          nums[_key2] = arguments[_key2];
      }

      nums = nums.filter(function (n) {
          return typeof n === 'number' && n === n;
      });
      return Math.min.apply(Math, toConsumableArray(nums));
  }

  function unique(arr) {
      var s = new Set(arr);
      return [].concat(toConsumableArray(s));
  }

  function mergeObect(to, from) {
      return Object.assign(to, from);
  }

  function noop() {}

  function doWithCheck(func, context) {
      if (typeof func !== 'function') {
          return;
      }
      if (context) {
          func.call(context);
      } else {
          func();
      }
  }

  function query(el) {
      if (typeof el === 'string') {
          var selected = document.querySelector(el);
          if (!selected) {
              warn('Cannot find element: ' + el);
              return document.createElement('div');
          }
          return selected;
      } else {
          return el;
      }
  }

  function elementCreater(html) {
      var div = document.createElement('div');
      if (!html) {
          return div;
      }
      if (html.indexOf('<') >= 0) {
          div.innerHTML = html;
          return div.children[0];
      }
      return document.createElement(html);
  }

  function getStyle(el, name) {
      var style = window.getComputedStyle(el)[name] || '';
      var check = makeMap('width,height,top,left,right,bottom');
      if (check(name)) {
          return toInt(style);
      }
      return style;
  }

  function addClass(el, cls) {
      el.classList.add(cls);
  }

  function removeClass(el, cls) {
      el.classList.remove(cls);
  }
  /**
   * 
   * @param {nodeType|string|NodeList|HTMLCollection} el 需要绑定事件的dom元素
   * @param {string} type 事件类型
   * @param {function} func 触发时需要执行的函数
   * @param {boolean} needPatch 是否需要储存事件对象
   */
  function bind(el, type, func, needPatch) {
      if (typeof el === 'string') {
          el = query(el);
          el.addEventListener(type, func);
          if (needPatch) {
              el['$' + type] = new Event(type);
          }
      } else if (el instanceof NodeList || el instanceof HTMLCollection) {
          for (var i = 0; i < el.length; i++) {
              el[i].addEventListener(type, func);
              if (needPatch) {
                  el[i]['$' + type] = new Event(type);
              }
          }
      } else {
          el.addEventListener(type, func);
          if (needPatch) {
              el['$' + type] = new Event(type);
          }
      }
  }

  function off(el, type, func) {
      if (typeof el === 'string') {
          el = query(el);
      }
      el.removeEventListener(type, func);
  }

  function isEditorContainer(dom, selector) {
      var els = document.querySelectorAll(selector);
      if (!els.length) {
          return null;
      }
      if (dom.nodeName.toLowerCase() === "html") {
          return null;
      }
      for (var i = 0; i < els.length; i++) {
          if (els[i] === dom.parentNode || els[i] === dom) {
              return els[i];
          }
      }
      return isEditorContainer(dom.parentNode, selector);
  }

  function domBlur(dom, func) {
      bind(document.body, 'click', blur);

      function blur(e) {
          var target = e.target;
          if (dom !== target && !dom.contains(target)) {
              doWithCheck(func);
              dom.style.display = 'none';
              off(document.body, 'click', blur);
          }
      }
  }

  function initOpts(options, e) {
      var el = e.el = query(options.el);
      var tools = e.tools = normalizeTools(options.tools);

      normalizeStyle(options, el);
      options.styleWith = options.styleWith || 'css';

      e.options = options;
  }

  function normalizeTools(tools) {
      if (!tools) {
          return [];
      }
      var r = tools.split(' ');
      return unique(r);
  }

  function normalizeStyle(options, el) {
      var w = options.width || getStyle(el, 'width');
      var h = options.height || getStyle(el, 'height');
      options.width = getMax(w, 600);
      options.height = getMax(h, 400);
  }

  function execCommand(name, value, callback) {
      // doAsync(function() {
      document.execCommand(name, false, value);
      // document.execCommand('insertHTML', false, '&#8203;')
      callback && callback();
      // })
  }

  function queryCommandState(name, value) {
      return document.queryCommandState(name);
  }

  function queryCommandValue(name) {
      return document.queryCommandValue(name);
  }

  var Bold = function () {
      function Bold(e) {
          classCallCheck(this, Bold);

          this._active = false;
          this._editor = e;
          var uid = this._uid = 'bold-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-bold"></div>');
          var main = this.main = elementCreater('<div id="' + uid + '" class="ee-tool-normal bold-button eticon-bold"></div>');
          el.appendChild(main);
          bindEvent(this);
      }

      createClass(Bold, [{
          key: 'query',
          value: function query$$1() {
              var v = queryCommandState('bold');
              this._active = !!v;
              if (this._active) {
                  addClass(this.main, 'et-active');
              } else {
                  removeClass(this.main, 'et-active');
              }
          }
      }, {
          key: 'do',
          value: function _do() {
              var c = this;
              execCommand('bold', null, function () {
                  c.query();
                  c._editor._s.saveRange();
              });
          }
      }, {
          key: 'cancel',
          value: function cancel() {
              if (this._active) {
                  this.do();
              }
          }
      }]);
      return Bold;
  }();

  function bindEvent(c) {
      var el = c.main;
      var selection = c._editor._s;
      if (!el) {
          return;
      }
      bind(el, 'click', doo);

      function doo() {
          selection.restoreSelection();
          c.do();
      }
  }

  function bold(e, toolbar) {
      var ei = e.cmd.bold = new Bold(e);
      toolbar.appendChild(ei.el);
  }

  var Italic = function () {
      function Italic(e) {
          classCallCheck(this, Italic);

          this._active = false;
          this._editor = e;
          var uid = this._uid = 'italic-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-italic"></div>');
          var main = this.main = elementCreater('<div id="' + uid + '" class="ee-tool-normal italic-button eticon-italic"></div>');
          el.appendChild(main);
          bindEvent$1(this);
      }

      createClass(Italic, [{
          key: 'query',
          value: function query$$1() {
              var v = queryCommandState('italic');
              this._active = !!v;
              if (this._active) {
                  addClass(this.main, 'et-active');
              } else {
                  removeClass(this.main, 'et-active');
              }
          }
      }, {
          key: 'do',
          value: function _do() {
              var c = this;
              execCommand('italic', null, function () {
                  c.query.call(c);
                  c._editor._s.saveRange();
              });
          }
      }, {
          key: 'cancel',
          value: function cancel() {
              if (this._active) {
                  this.do();
              }
          }
      }]);
      return Italic;
  }();

  function bindEvent$1(c) {
      var el = c.main;
      var selection = c._editor._s;
      if (!el) {
          return;
      }
      bind(el, 'click', doo);

      function doo() {
          selection.restoreSelection();
          c.do();
      }
  }

  function italic(e, toolbar) {
      var ei = e.cmd.italic = new Italic(e);
      toolbar.appendChild(ei.el);
  }

  var LineThrough = function () {
      function LineThrough(e) {
          classCallCheck(this, LineThrough);

          this._active = false;
          this._editor = e;
          var uid = this._uid = 'lineThrough-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-lineThrough"></div>');
          var main = this.main = elementCreater('<div id="' + uid + '" class="ee-tool-normal lineThrough-button eticon-lineThrough"></div>');
          el.appendChild(main);
          bindEvent$2(this);
      }

      createClass(LineThrough, [{
          key: 'query',
          value: function query$$1() {
              var v = queryCommandState('strikeThrough');
              this._active = !!v;
              if (this._active) {
                  addClass(this.main, 'et-active');
              } else {
                  removeClass(this.main, 'et-active');
              }
          }
      }, {
          key: 'do',
          value: function _do() {
              var c = this;
              execCommand('strikeThrough', null, function () {
                  c.query.call(c);
                  c._editor._s.saveRange();
              });
          }
      }, {
          key: 'cancel',
          value: function cancel() {
              if (this._active) {
                  this.do();
              }
          }
      }]);
      return LineThrough;
  }();

  function bindEvent$2(c) {
      var el = c.main;
      var selection = c._editor._s;
      if (!el) {
          return;
      }
      bind(el, 'click', doo);

      function doo() {
          selection.restoreSelection();
          c.do();
      }
  }

  function lineThrough(e, toolbar) {
      var ei = e.cmd.lineThrough = new LineThrough(e);
      toolbar.appendChild(ei.el);
  }

  var uid = 0;
  var defaultOpts = {
      el: 'body',
      hex: '#ff0000',
      mask: false,
      hsvpStyle: {
          width: 200,
          height: 150
      },
      hStyle: {
          width: 200,
          height: 15
      },
      afterColorChange: noop,
      afterShow: noop,
      beforeHide: noop,
      autoClose: true
  };

  var ColorPicker = function () {
      function ColorPicker(opts) {
          classCallCheck(this, ColorPicker);

          this.id = uid++;
          //  初始化
          this.option = mergeObect(defaultOpts, opts);
          var el = opts.el;
          this.el = typeof el === 'string' ? query(el) : el;
          createPanel(this);
          this._hsv = {
              h: 0,
              s: 1,
              v: 1
          };
      }

      createClass(ColorPicker, [{
          key: 'show',
          value: function show() {
              if (this.wrap && this.option.autoClose) {
                  var that = this;
                  domBlur(this.wrap, function () {
                      that.beforeHide();
                  });
              }
              this.wrap && (this.wrap.style.display = 'block');
              this.afterShow();
          }
      }, {
          key: 'hide',
          value: function hide() {
              this.beforeHide();
              this.wrap && (this.wrap.style.display = 'none');
          }
      }, {
          key: 'hsv',
          value: function hsv() {
              return this._hsv;
          }
      }, {
          key: 'rgb',
          value: function rgb() {
              return {
                  r: this._rInput.value,
                  g: this._gInput.value,
                  b: this._bInput.value
              };
          }
      }, {
          key: 'hex',
          value: function hex() {
              return this._hexInput.value;
          }
      }, {
          key: 'setHex',
          value: function setHex(hex) {
              this._hexInput.value = hex;
              this._hexInput.dispatchEvent(this._hexInput.$blur);
          }
      }, {
          key: 'afterColorChange',
          value: function afterColorChange() {
              var afterColorChange = this.option.afterColorChange;
              doWithCheck(afterColorChange, this);
          }
      }, {
          key: 'afterShow',
          value: function afterShow() {
              var afterShow = this.option.afterShow;
              doWithCheck(afterShow, this);
          }
      }, {
          key: 'beforeHide',
          value: function beforeHide() {
              var beforeHide = this.option.beforeHide;
              doWithCheck(beforeHide, this);
          }
      }]);
      return ColorPicker;
  }();

  function createPanel(c) {
      var cp = c.wrap = elementCreater('<div id="ew-cp-' + c.id + '" class="ew-cp"></div>');
      var hsvPanel = createHsvPanel(c);
      cp.appendChild(hsvPanel);

      var hPanel = createHPanel(c);
      cp.appendChild(hPanel);

      var inputPanel = createInputPanel(c);
      cp.appendChild(inputPanel);

      c.el.appendChild(cp);
  }
  //  取色板
  function createHsvPanel(c) {
      var timer = null;
      var hsvpStyle = c.option.hsvpStyle;
      var hsvPanel = c._back = elementCreater('<div id="ew-hsvp-' + c.id + '" style="width:' + hsvpStyle.width + 'px;height:' + hsvpStyle.height + 'px" class="ew-hsvp"><div class="ew-hsvp-m1"></div><div class="ew-hsvp-m2"></div></div>');
      var hsvCusor = c._hsvCusor = elementCreater('<span class="ew-hsvc"></span>');
      hsvPanel.appendChild(hsvCusor);
      bind(hsvPanel, 'mousedown', dragHsvc);

      function dragHsvc(e) {
          e.preventDefault();
          var pos = hsvPanel.getBoundingClientRect();
          var l = pos.left;
          var t = pos.top;
          var x = e.pageX - l - 6;
          var y = e.pageY - t - 6;
          if (x < -6) {
              x = -6;
          }
          if (x > hsvpStyle.width - 6) {
              x = hsvpStyle.width - 6;
          }
          if (y < -6) {
              y = -6;
          }
          if (y > hsvpStyle.height - 6) {
              y = hsvpStyle.height - 6;
          }
          timer = setTimeout(function () {
              hsvCusor.style.top = y + 'px';
              hsvCusor.style.left = x + 'px';

              var s = c._hsv.s = (x + 6) / hsvpStyle.width;
              var v = c._hsv.v = 1 - (y + 6) / hsvpStyle.height;
              var rgb = hsvToRgb(c._hsv.h, s, v);
              var color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
              c._preview.style.backgroundColor = color;
              var r = c._rInput.value = rgb.r;
              var g = c._gInput.value = rgb.g;
              var b = c._bInput.value = rgb.b;

              c._hexInput.value = rgbToHex(r, g, b);
          }, 10);
          bind('body', 'mousemove', dragHsvc);
          bind('body', 'mouseup', offDragHsvc);

          c.afterColorChange();

          function offDragHsvc() {
              off('body', 'mousemove', dragHsvc);
              off('body', 'mouseup', offDragHsvc);
          }
      }

      return hsvPanel;
  }
  //  选择h的色板
  function createHPanel(c) {
      var hStyle = c.option.hStyle;
      var hPanel = elementCreater('<div id="ew-hp-' + c.id + '" style="width:' + hStyle.width + 'px;height:' + hStyle.height + 'px" class="ew-hp"></div>');
      var hCursor = c._hCursor = elementCreater('<span class="ew-hpc"></span>');
      hPanel.appendChild(hCursor);

      bind(hPanel, 'mousedown', dragHc);

      function dragHc(e) {
          e.preventDefault();
          var pos = hPanel.getBoundingClientRect();
          var l = pos.left;
          var x = e.pageX - l - 2;
          if (x < -2) {
              x = -2;
          }
          if (x > hStyle.width - 2) {
              x = hStyle.width - 2;
          }
          var hsv = c._hsv;
          var h = hsv.h = (x + 2) / hStyle.width;
          var rgb = hsvToRgb(h, 1, 1);
          var color = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
          c._back && (c._back.style.backgroundColor = color);

          hCursor.style.left = x + 'px';

          var _hsvToRgb = hsvToRgb(h, hsv.s, hsv.v),
              r = _hsvToRgb.r,
              g = _hsvToRgb.g,
              b = _hsvToRgb.b;

          var hex = rgbToHex(r, g, b);
          c._hexInput.value = hex;
          c._rInput.value = r;
          c._gInput.value = g;
          c._bInput.value = b;
          c._preview.style.backgroundColor = '#' + hex;

          c.afterColorChange();

          bind('body', 'mousemove', dragHc);
          bind('body', 'mouseup', offDragHc);

          function offDragHc() {
              off('body', 'mousemove', dragHc);
              off('body', 'mouseup', offDragHc);
          }
      }

      return hPanel;
  }
  //  输入框
  function createInputPanel(c) {
      var wrap = elementCreater('<div class="ew-cip"></div>');
      var row1 = elementCreater('<div class="ew-cip-row1 ew-cip-row"><div class="ew-cip-row-sub">R:<input value=255 class="ew-cip-i"></div><div class="ew-cip-row-sub">G:<input value=0 class="ew-cip-i"></div><div class="ew-cip-row-sub">B:<input value=0 class="ew-cip-i"></div></div>');
      wrap.appendChild(row1);
      var inputs = row1.querySelectorAll('.ew-cip-i');
      var _rInput = c._rInput = inputs[0];
      var _gInput = c._gInput = inputs[1];
      var _bInput = c._bInput = inputs[2];

      var row2 = elementCreater('<div class="ew-cip-row2 ew-cip-row"><div class="ew-cip-row-sub">HEX:#<input value="FF0000" maxlength=6 class="ew-cip-hex"></div><div class="ew-cip-row-sub ew-cip-pre"></div></div>');
      var _hexInput = c._hexInput = row2.querySelector('.ew-cip-hex');
      var pre = c._preview = row2.querySelector('.ew-cip-pre');
      c._preview = row2.querySelector('.ew-cip-pre');
      wrap.appendChild(row2);

      bind(_hexInput, 'blur', hexInput, true);
      bind(inputs, 'blur', rgbInput, true);

      function hexInput() {
          var hex = this.value = hexFomatter(this.value).toUpperCase();
          var rgb = hexToRgb(hex);
          var hsv = c._hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

          //  改变hpanel的位置
          fixHcPos(hsv.h, c);

          //  改变hsvCusor的位置
          fixHsvcPos(hsv, c);

          //  改变背景色
          var rgb2 = hsvToRgb(hsv.h, 1, 1);
          var color = 'rgb(' + rgb2.r + ',' + rgb2.g + ',' + rgb2.b + ')';
          c._back && (c._back.style.backgroundColor = color);
          pre.style.backgroundColor = '#' + hex;

          c.afterColorChange();
      }

      function rgbInput() {
          var v = this.value.replace(/[^0-9]/g, '');
          v = toInt(v);
          this.value = v > 255 ? 255 : v < 0 ? 0 : v;

          var r = c._rInput.value;
          var g = c._gInput.value;
          var b = c._bInput.value;

          var hex = rgbToHex(r, g, b);
          c._hexInput.value = hex;
          c._preview.style.backgroundColor = '#' + hex;
          var hsv = c._hsv = rgbToHsv(r, g, b);

          fixHcPos(hsv.h, c);
          fixHsvcPos(hsv, c);

          c.afterColorChange();
      }

      return wrap;
  }

  function fixHsvcPos(hsv, c) {
      var hsvpStyle = c.option.hsvpStyle;
      var l2 = hsv.s * hsvpStyle.width - 6;
      var t2 = (1 - hsv.v) * hsvpStyle.height - 6;
      var hsvCusor = c._hsvCusor;
      hsvCusor && (hsvCusor.style.top = t2 + 'px') && (hsvCusor.style.left = l2 + 'px');
  }

  function fixHcPos(h, c) {
      var l = h * c.option.hStyle.width - 2;
      c._hCursor && (c._hCursor.style.left = l + 'px');
  }

  function hexFomatter(hex) {
      hex = hex.replace(/[^A-Z|^a-z|^0-9]/g, '');
      if (hex.length >= 6) {
          hex = hex.substring(0, 6);
      } else if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      } else {
          for (var i = hex.length; i < 6; i++) {
              hex += '0';
          }
      }
      return hex;
  }

  //  颜色之间的相互转换
  function rgbToHex(r, g, b) {
      r = r.toString(16);
      if (r.length == 1) {
          r = '0' + r;
      }
      g = g.toString(16);
      if (g.length == 1) {
          g = '0' + g;
      }
      b = b.toString(16);
      if (b.length == 1) {
          b = '0' + b;
      }
      return (r + g + b).toUpperCase();
  }

  function hexToRgb(hex) {
      var r = parseInt(hex.substr(0, 2), 16);
      var g = parseInt(hex.substr(2, 2), 16);
      var b = parseInt(hex.substr(4, 2), 16);
      return { r: r, g: g, b: b };
  }

  function rgbToHsv(r, g, b) {
      r = toInt(r);
      g = toInt(g);
      b = toInt(b);
      var max = getMax(r, g, b);
      var min = getMin(r, g, b);
      var h = 0,
          s = 0,
          v = 0;

      var sub = max - min;
      if (max === min) {
          h = 0;
      } else {
          if (r === max) {
              if (g >= b) {
                  h = 60 * (g - b) / sub;
              } else {
                  h = 60 * (g - b) / sub + 360;
              }
          } else if (g === max) {
              h = 60 * (b - r) / sub + 120;
          } else {
              h = 60 * (r - g) / sub + 240;
          }
      }
      if (h > 360) {
          h -= 360;
      } else if (h < 0) {
          h += 360;
      }
      s = sub / max;
      v = max / 255;
      h /= 360;
      s = isNaN(s) ? 0 : s;
      return {
          h: h,
          s: s,
          v: v
      };
  }

  /**
   * 传入0-1
   */
  function hsvToRgb(h, s, v) {
      h *= 360;
      var r = 0;
      var g = 0;
      var b = 0;
      var i = Math.floor(h / 60);
      var f = h / 60 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);
      r = v;
      g = t;
      b = p;
      if (i === 0) {
          r = v;
          g = t;
          b = p;
      }
      if (i === 1) {
          r = q;
          g = v;
          b = p;
      }
      if (i === 2) {
          r = p;
          g = v;
          b = t;
      }
      if (i === 3) {
          r = p;
          g = q;
          b = v;
      }
      if (i === 4) {
          r = t;
          g = p;
          b = v;
      }
      if (i === 5) {
          r = v;
          g = p;
          b = q;
      }
      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);
      return {
          r: r,
          g: g,
          b: b
      };
  }

  var ForeColor = function () {
      function ForeColor(e) {
          classCallCheck(this, ForeColor);

          this._value = '#1A1A1A';
          this._editor = e;

          initCp(this);

          var uid = this._uid = 'foreColor-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-foreColor"></div>');
          var main = this.main = elementCreater('<div id="' + uid + '" class="ee-tool-normal foreColor-button eticon-color"><span></span></div>');
          el.appendChild(main);

          bindEvent$3(this);
      }

      createClass(ForeColor, [{
          key: 'query',
          value: function query$$1() {
              this._value = this.main.querySelector('span').style.backgroundColor = queryCommandValue('foreColor');
          }
      }]);
      return ForeColor;
  }();

  function bindEvent$3(c) {
      bind(c.main, 'click', function (e) {
          e.stopPropagation();
          e.cancelBubble = true;
          c._cp.show();
      });
  }

  function initCp(c) {
      var option = {
          el: c._editor._wrap,
          beforeHide: function beforeHide() {
              c._editor._s.restoreSelection();
              var hex = this.hex();
              c.main.querySelector('span').style.backgroundColor = '#' + hex;
              execCommand('foreColor', hex);
              c._editor._s.saveRange();
          }
      };
      c._cp = new ColorPicker(option);
  }

  function foreColor(e, toolbar) {
      var ei = e.cmd.foreColor = new ForeColor(e);
      toolbar.appendChild(ei.el);
  }

  var Underline = function () {
      function Underline(e) {
          classCallCheck(this, Underline);

          this._active = false;
          this._editor = e;
          var uid = this._uid = 'underline-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-underline"></div>');
          var main = this.main = elementCreater('<div id="' + uid + '" class="ee-tool-normal underline-button eticon-underline"></div>');
          el.appendChild(main);
          bindEvent$4(this);
      }

      createClass(Underline, [{
          key: 'query',
          value: function query$$1() {
              var v = queryCommandState('underline');
              this._active = !!v;
              if (this._active) {
                  addClass(this.main, 'et-active');
              } else {
                  removeClass(this.main, 'et-active');
              }
          }
      }, {
          key: 'do',
          value: function _do() {
              var c = this;
              execCommand('underline', null, function () {
                  c.query();
                  c._editor._s.saveRange();
              });
          }
      }, {
          key: 'cancel',
          value: function cancel() {
              if (this._active) {
                  this.do();
              }
          }
      }]);
      return Underline;
  }();

  function bindEvent$4(c) {
      var el = c.main;
      var selection = c._editor._s;
      if (!el) {
          return;
      }
      bind(el, 'click', doo);

      function doo() {
          selection.restoreSelection();
          c.do();
      }
  }

  function underline(e, toolbar) {
      var ei = e.cmd.underline = new Underline(e);
      toolbar.appendChild(ei.el);
  }

  var sizes = ['1', '2', '3', '4', '5', '6', '7'];

  var FontSize = function () {
      function FontSize(e) {
          classCallCheck(this, FontSize);

          this._active = false;
          this._editor = e;
          var uid = this._uid = 'fontSize-' + e._uid;
          var el = this.el = elementCreater('<div class="ee-tool ee-tool-hover ee-tool-fontSize"></div>');

          var html = '<select id="' + uid + '" class="ew-selector ew-selector-fontsize">';
          for (var i = 0; i < sizes.length; i++) {
              var size = sizes[i];
              html += '<option value="' + size + '">' + size + '</option>';
          }
          html += '</select>';
          var main = this.main = elementCreater(html);

          el.appendChild(main);
          bindEvent$5(this);
      }

      createClass(FontSize, [{
          key: 'query',
          value: function query$$1() {
              var v = queryCommandState('fontSize');
              this._active = !!v;
              if (this._active) {
                  addClass(this.main, 'et-active');
              } else {
                  removeClass(this.main, 'et-active');
              }
          }
      }, {
          key: 'do',
          value: function _do(size) {
              var c = this;
              execCommand('fontSize', size, function () {
                  c.query();
                  c._editor._s.saveRange();
              });
          }
      }, {
          key: 'cancel',
          value: function cancel() {
              if (this._active) {
                  this.do();
              }
          }
      }]);
      return FontSize;
  }();

  function bindEvent$5(c) {
      var el = c.main;
      var selection = c._editor._s;
      if (!el) {
          return;
      }
      bind(el, 'change', doo);

      function doo() {
          selection.restoreSelection();
          c.do(this.value);
      }
  }

  function fontSize(e, toolbar) {
      var ei = e.cmd.fontSize = new FontSize(e);
      toolbar.appendChild(ei.el);
  }

  var handlers = {
      bold: bold,
      italic: italic,
      lineThrough: lineThrough,
      foreColor: foreColor,
      underline: underline,
      fontSize: fontSize
  };

  /**
   * bold:  bold 加粗
   * italic: italic 斜体
   * underline: underline 下划线
   * lineThrough: lineThrough 删除线
   * fontSize: fontSize 字体大小
   * foreColor: foreColor 字体颜色
   * link: link 链接 
   * code: insertHtml 插入代码片段
   * fontName: fontName 字体
   * image: insertImage 插入图片
   * orderedList: insertOrderedList 插入有序列表
   * unorderedList: insertUnorderedList 插入无序列表-
   * center: justifyCenter 文字居中
   * full: justifyFull 文字对齐
   * left: justifyLeft 文字居左
   * right: justifyRight 文字居右
   * undo: undo 撤销操作
   * redo: redo 恢复撤销的操作
   * hiliteColor: hiliteColor 文字背景色
   */

  var hasHandler = makeMap('bold,italic,underline,lineThrough,fontSize,foreColor,link,code,fontName,image,orderedList,unorderedList,center,full,left,right,redo,undo,hiliteColor');

  function toolbarCreater(e) {
      var wrap = e._wrap;
      var toolbar = elementCreater("<div class=\"editor-toolbar\"></div>");
      var tools = e.tools;
      for (var i = 0; i < tools.length; i++) {
          var t = tools[i];
          var handler = handlers[t];
          handler && handler(e, toolbar);
      }
      wrap.appendChild(toolbar);
  }

  function draw(e) {
      var opts = e.options;
      var wrap = e._wrap = elementCreater('<div id="editor-' + e._uid + '" class="editor-wrap" style="width:' + opts.width + 'px;height:' + opts.height + 'px"></div>');
      toolbarCreater(e);
      writerCreater(e);
      e.el.appendChild(wrap);
  }

  function writerCreater(e) {
      var uid = e._uid;
      var h = e.options.height - 46;
      var ewID = 'ew-' + uid;
      var ewc = elementCreater('<div id="ew-container-' + uid + '" class="ew-container"><div id="' + ewID + '" class="ew" contenteditable=true spellcheck=false style="height:' + h + 'px"></div></div>');
      var ew = ewc.querySelector('#' + ewID);
      bind(ew, 'mouseup', saveRange);
      bind(ew, 'mouseup', query$$1);
      bind(ew, 'keyup', saveRange);
      e._wrap.appendChild(ewc);

      function saveRange() {
          e._s.saveRange();
      }

      function query$$1() {
          var cmd = e.cmd;
          if (cmd) {
              var _iteratorNormalCompletion = true;
              var _didIteratorError = false;
              var _iteratorError = undefined;

              try {
                  for (var _iterator = Object.keys(cmd)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                      var key = _step.value;

                      var c = cmd[key];
                      c.query && c.query();
                  }
              } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
              } finally {
                  try {
                      if (!_iteratorNormalCompletion && _iterator.return) {
                          _iterator.return();
                      }
                  } finally {
                      if (_didIteratorError) {
                          throw _iteratorError;
                      }
                  }
              }
          }
      }
  }

  var Selection = function () {
      function Selection() {
          classCallCheck(this, Selection);

          this._sel = null;
          this._range = null;
      }

      createClass(Selection, [{
          key: "saveRange",
          value: function saveRange(r) {
              if (r) {
                  return this._range = r;
              }
              var sel = this._sel = window.getSelection();
              if (!sel.rangeCount) {
                  return this._range = null;
              }
              r = sel.getRangeAt(0);
              var parent = this.getSelectionContainer(r);
              if (!parent || !parent.getAttribute("contenteditable") !== "true" && !isEditorContainer(parent, "[contenteditable=true]")) {
                  return this._range = null;
              }
              this._range = r;
          }
      }, {
          key: "getSelectionContainer",
          value: function getSelectionContainer(r) {
              if (!r) {
                  return null;
              }
              var container = r.commonAncestorContainer;
              return container.nodeType === 1 ? container : container.parentNode;
          }
      }, {
          key: "restoreSelection",
          value: function restoreSelection(r) {
              r = r || this._range;
              if (!r) {
                  return;
              }
              var selection = window.getSelection();
              selection.removeAllRanges();
              selection.addRange(r);
          }
      }, {
          key: "getSelectionContainerElem",
          value: function getSelectionContainerElem(range) {
              range = range || this._range;
              var elem = void 0;
              if (range) {
                  elem = range.commonAncestorContainer;
                  return elem.nodeType === 1 ? elem : elem.parentNode;
              }
          }
      }, {
          key: "isSelectionEmpty",
          value: function isSelectionEmpty() {
              var range = this._range;
              if (range && range.startContainer) {
                  if (range.startContainer === range.endContainer) {
                      if (range.startOffset === range.endOffset) {
                          return true;
                      }
                  }
              }
              return false;
          }
      }, {
          key: "createRangeByElem",
          value: function createRangeByElem(el) {
              var range = document.createRange();

              range.selectNode(el);

              // 存储 range
              this.saveRange(range);
          }
      }]);
      return Selection;
  }();

  function init(Eeditor) {
      Eeditor.prototype.init = function (options) {
          initOpts(options, this);
          this._s = new Selection();
          this.cmd = {};
          draw(this);
          initWriter(this);
      };
  }

  function initWriter(e) {
      execCommand('styleWithCSS', e.options.styleWith === 'css');
      //  如果可编辑区域没有内容则插入一个空行，详见 http://web.jobbole.com/92919/
      var dom = e._wrap.querySelector('#ew-' + e._uid);
      if (!dom.children.length) {
          var br = elementCreater('<p><br></p>');
          dom.appendChild(br);
      }
      //  由于这个空行是会被删除的，所以监听一下删除事件
      bind(dom, 'keyup', function (ev) {
          if (ev.keyCode === 8) {
              initWriter(e);
          }
      });
  }

  var uid$1 = 0;

  var Eeditor = function Eeditor() {
      classCallCheck(this, Eeditor);

      this._uid = uid$1++;
  };

  init(Eeditor);

  return Eeditor;

}));
