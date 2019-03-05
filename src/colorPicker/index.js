import { elementCreater, query, bind, off, domBlur } from "../utils/dom";
import { mergeObect, toInt, getMax, getMin, noop, doWithCheck } from '../utils/other.js'
let uid = 0
const defaultOpts = {
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
}

export class ColorPicker {
    constructor(opts) {
        this.id = uid++
            //  初始化
            this.option = mergeObect(defaultOpts, opts)
        const el = opts.el
        this.el = typeof el === 'string' ? query(el) : el
        createPanel(this)
        this._hsv = {
            h: 0,
            s: 1,
            v: 1
        }
    }
    show() {
        if (this.wrap && this.option.autoClose) {
            const that = this
            domBlur(this.wrap, function() {
                that.beforeHide()
            })
        }
        this.wrap && (this.wrap.style.display = 'block')
        this.afterShow()
    }
    hide() {
        this.beforeHide()
        this.wrap && (this.wrap.style.display = 'none')
    }
    hsv() {
        return this._hsv
    }
    rgb() {
        return {
            r: this._rInput.value,
            g: this._gInput.value,
            b: this._bInput.value
        }
    }
    hex() {
        return this._hexInput.value
    }
    setHex(hex) {
        this._hexInput.value = hex
        this._hexInput.dispatchEvent(this._hexInput.$blur)
    }
    afterColorChange() {
        const afterColorChange = this.option.afterColorChange
        doWithCheck(afterColorChange, this)
    }
    afterShow() {
        const afterShow = this.option.afterShow
        doWithCheck(afterShow, this)
    }
    beforeHide() {
        const beforeHide = this.option.beforeHide
        doWithCheck(beforeHide, this)
    }
}

function createPanel(c) {
    const cp = c.wrap = elementCreater(`<div id="ew-cp-${c.id}" class="ew-cp"></div>`)
    const hsvPanel = createHsvPanel(c)
    cp.appendChild(hsvPanel)

    const hPanel = createHPanel(c)
    cp.appendChild(hPanel)

    const inputPanel = createInputPanel(c)
    cp.appendChild(inputPanel)

    c.el.appendChild(cp)
}
//  取色板
function createHsvPanel(c) {
    let timer = null
    const hsvpStyle = c.option.hsvpStyle
    const hsvPanel = c._back = elementCreater(`<div id="ew-hsvp-${c.id}" style="width:${hsvpStyle.width}px;height:${hsvpStyle.height}px" class="ew-hsvp"><div class="ew-hsvp-m1"></div><div class="ew-hsvp-m2"></div></div>`)
    const hsvCusor = c._hsvCusor = elementCreater(`<span class="ew-hsvc"></span>`)
    hsvPanel.appendChild(hsvCusor)
    bind(hsvPanel, 'mousedown', dragHsvc)

    function dragHsvc(e) {
        e.preventDefault()
        const pos = hsvPanel.getBoundingClientRect()
        const l = pos.left
        const t = pos.top
        let x = e.pageX - l - 6
        let y = e.pageY - t - 6
        if (x < -6) {
            x = -6
        }
        if (x > hsvpStyle.width - 6) {
            x = hsvpStyle.width - 6
        }
        if (y < -6) {
            y = -6
        }
        if (y > hsvpStyle.height - 6) {
            y = hsvpStyle.height - 6
        }
        timer = setTimeout(function() {
            hsvCusor.style.top = `${y}px`
            hsvCusor.style.left = `${x}px`

            const s = c._hsv.s = (x + 6) / hsvpStyle.width
            const v = c._hsv.v = 1 - (y + 6) / hsvpStyle.height
            const rgb = hsvToRgb(c._hsv.h, s, v)
            const color = `rgb(${rgb.r},${rgb.g},${rgb.b})`
            c._preview.style.backgroundColor = color
            const r = c._rInput.value = rgb.r
            const g = c._gInput.value = rgb.g
            const b = c._bInput.value = rgb.b

            c._hexInput.value = rgbToHex(r, g, b)


        }, 10)
        bind('body', 'mousemove', dragHsvc)
        bind('body', 'mouseup', offDragHsvc)

        c.afterColorChange()

        function offDragHsvc() {
            off('body', 'mousemove', dragHsvc)
            off('body', 'mouseup', offDragHsvc)
        }
    }

    return hsvPanel
}
//  选择h的色板
function createHPanel(c) {
    const hStyle = c.option.hStyle
    const hPanel = elementCreater(`<div id="ew-hp-${c.id}" style="width:${hStyle.width}px;height:${hStyle.height}px" class="ew-hp"></div>`)
    const hCursor = c._hCursor = elementCreater(`<span class="ew-hpc"></span>`)
    hPanel.appendChild(hCursor)

    bind(hPanel, 'mousedown', dragHc)

    function dragHc(e) {
        e.preventDefault()
        const pos = hPanel.getBoundingClientRect()
        const l = pos.left
        let x = e.pageX - l - 2
        if (x < -2) {
            x = -2
        }
        if (x > hStyle.width - 2) {
            x = hStyle.width - 2
        }
        const hsv = c._hsv
        const h = hsv.h = (x + 2) / hStyle.width
        const rgb = hsvToRgb(h, 1, 1)
        const color = `rgb(${rgb.r},${rgb.g},${rgb.b})`
        c._back && (c._back.style.backgroundColor = color)

        hCursor.style.left = `${x}px`

        const { r, g, b } = hsvToRgb(h, hsv.s, hsv.v)
        const hex = rgbToHex(r, g, b)
        c._hexInput.value = hex
        c._rInput.value = r
        c._gInput.value = g
        c._bInput.value = b
        c._preview.style.backgroundColor = `#${hex}`

        c.afterColorChange()

        bind('body', 'mousemove', dragHc)
        bind('body', 'mouseup', offDragHc)

        function offDragHc() {
            off('body', 'mousemove', dragHc)
            off('body', 'mouseup', offDragHc)
        }
    }

    return hPanel
}
//  输入框
function createInputPanel(c) {
    const wrap = elementCreater(`<div class="ew-cip"></div>`)
    const row1 = elementCreater(`<div class="ew-cip-row1 ew-cip-row"><div class="ew-cip-row-sub">R:<input value=255 class="ew-cip-i"></div><div class="ew-cip-row-sub">G:<input value=0 class="ew-cip-i"></div><div class="ew-cip-row-sub">B:<input value=0 class="ew-cip-i"></div></div>`)
    wrap.appendChild(row1)
    const inputs = row1.querySelectorAll('.ew-cip-i')
    const _rInput = c._rInput = inputs[0]
    const _gInput = c._gInput = inputs[1]
    const _bInput = c._bInput = inputs[2]

    const row2 = elementCreater(`<div class="ew-cip-row2 ew-cip-row"><div class="ew-cip-row-sub">HEX:#<input value="FF0000" maxlength=6 class="ew-cip-hex"></div><div class="ew-cip-row-sub ew-cip-pre"></div></div>`)
    const _hexInput = c._hexInput = row2.querySelector('.ew-cip-hex')
    const pre = c._preview = row2.querySelector('.ew-cip-pre')
    c._preview = row2.querySelector('.ew-cip-pre')
    wrap.appendChild(row2)

    bind(_hexInput, 'blur', hexInput, true)
    bind(inputs, 'blur', rgbInput, true)

    function hexInput() {
        let hex = this.value = hexFomatter(this.value).toUpperCase()
        const rgb = hexToRgb(hex)
        const hsv = c._hsv = rgbToHsv(rgb.r, rgb.g, rgb.b)

        //  改变hpanel的位置
        fixHcPos(hsv.h, c)

        //  改变hsvCusor的位置
        fixHsvcPos(hsv, c)

        //  改变背景色
        const rgb2 = hsvToRgb(hsv.h, 1, 1)
        const color = `rgb(${rgb2.r},${rgb2.g},${rgb2.b})`
        c._back && (c._back.style.backgroundColor = color)
        pre.style.backgroundColor = `#${hex}`

        c.afterColorChange()
    }

    function rgbInput() {
        let v = this.value.replace(/[^0-9]/g, '')
        v = toInt(v)
        this.value = v > 255 ? 255 : v < 0 ? 0 : v

        const r = c._rInput.value
        const g = c._gInput.value
        const b = c._bInput.value

        const hex = rgbToHex(r, g, b)
        c._hexInput.value = hex
        c._preview.style.backgroundColor = `#${hex}`
        const hsv = c._hsv = rgbToHsv(r, g, b)

        fixHcPos(hsv.h, c)
        fixHsvcPos(hsv, c)

        c.afterColorChange()
    }

    return wrap
}

function fixHsvcPos(hsv, c) {
    const hsvpStyle = c.option.hsvpStyle
    const l2 = hsv.s * hsvpStyle.width - 6
    const t2 = (1 - hsv.v) * hsvpStyle.height - 6
    const hsvCusor = c._hsvCusor
    hsvCusor && ((hsvCusor.style.top = `${t2}px`) && (hsvCusor.style.left = `${l2}px`))
}

function fixHcPos(h, c) {
    const l = h * c.option.hStyle.width - 2
    c._hCursor && (c._hCursor.style.left = `${l}px`)
}

function hexFomatter(hex) {
    hex = hex.replace(/[^A-Z|^a-z|^0-9]/g, '')
    if (hex.length >= 6) {
        hex = hex.substring(0, 6)
    } else if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    } else {
        for (var i = hex.length; i < 6; i++) {
            hex += '0'
        }
    }
    return hex
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
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return { r, g, b }
}

function rgbToHsv(r, g, b) {
    r = toInt(r)
    g = toInt(g)
    b = toInt(b)
    const max = getMax(r, g, b)
    const min = getMin(r, g, b)
    let h = 0,
        s = 0,
        v = 0;

    const sub = max - min
    if (max === min) {
        h = 0;
    } else {
        if (r === max) {
            if (g >= b) {
                h = 60 * (g - b) / sub
            } else {
                h = 60 * (g - b) / sub + 360
            }
        } else if (g === max) {
            h = 60 * (b - r) / sub + 120
        } else {
            h = 60 * (r - g) / sub + 240
        }
    }
    if (h > 360) {
        h -= 360
    } else if (h < 0) {
        h += 360
    }
    s = sub / max
    v = max / 255
    h /= 360
    s = isNaN(s) ? 0 : s
    return {
        h,
        s,
        v
    }
}

/**
 * 传入0-1
 */
function hsvToRgb(h, s, v) {
    h *= 360
    let r = 0
    let g = 0
    let b = 0
    const i = Math.floor(h / 60)
    const f = (h / 60) - i
    const p = v * (1 - s)
    const q = v * (1 - (f * s))
    const t = v * (1 - (1 - f) * s)
    r = v
    g = t
    b = p
    if (i === 0) {
        r = v
        g = t
        b = p
    }
    if (i === 1) {
        r = q
        g = v
        b = p
    }
    if (i === 2) {
        r = p
        g = v
        b = t
    }
    if (i === 3) {
        r = p
        g = q
        b = v
    }
    if (i === 4) {
        r = t
        g = p
        b = v
    }
    if (i === 5) {
        r = v
        g = p
        b = q
    }
    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    return {
        r,
        g,
        b
    }
}