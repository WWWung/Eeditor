import { elementCreater, query, bind, off } from "../utils/dom";
import { mergeObect, toInt, getMax, getMin } from '../utils/other.js'
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
    }
}

export class ColorPicker {
    constructor(opts) {
        this.id = uid++
            //  初始化
            this.option = mergeObect(defaultOpts, opts)
        const el = opts.el
        this.el = typeof el === 'string' ? query(el) : el
        createPanel(this)
        this.hsv = {
            h: 0,
            s: 0,
            v: 0
        }
    }
    show() {
        this.wrap && (this.wrap.style.display = 'block')
    }
    hide() {
        this.wrap && (this.wrap.style.display = 'none')
    }
    colorChange() {

    }
}

function createPanel(c) {
    const cp = c.wrap = elementCreater(`<div id="ew-cp-${c.id}" class="ew-cp"></div>`)
    const hsvPanel = createHsvPanel(c)
    const hPanel = createHPanel(c)
    cp.appendChild(hsvPanel)
    cp.appendChild(hPanel)
    c.el.appendChild(cp)
}
//  取色板
function createHsvPanel(c) {
    let timer = null
    const hsvpStyle = c.option.hsvpStyle
    const hsvPanel = c._back = elementCreater(`<div id="ew-hsvp-${c.id}" style="width:${hsvpStyle.width}px;height:${hsvpStyle.height}px" class="ew-hsvp"><div class="ew-hsvp-m1"></div><div class="ew-hsvp-m2"></div></div>`)
    const hsvCusor = elementCreater(`<span class="ew-hsvc"></span>`)
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

            const s = c.hsv.s = (x + 6) / hsvpStyle.width
            const v = c.hsv.v = 1 - (y + 6) / hsvpStyle.height
            const rgb = hsvToRgb(c.hsv.h, s, v)
            const color = `rgb(${rgb.r},${rgb.g},${rgb.b})`
            document.body.style.background = color

        }, 10)
        bind('body', 'mousemove', dragHsvc)
        bind('body', 'mouseup', offDragHsvc)

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
    const hCursor = elementCreater(`<span class="ew-hpc"></span>`)
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

        const h = c.hsv.h = (x + 2) / hStyle.width
        const rgb = hsvToRgb(h, 1, 1)
        const color = `rgb(${rgb.r},${rgb.g},${rgb.b})`
        c._back && (c._back.style.backgroundColor = color)

        hCursor.style.left = `${x}px`
        bind('body', 'mousemove', dragHc)
        bind('body', 'mouseup', offDragHc)

        function offDragHc() {
            off('body', 'mousemove', dragHc)
            off('body', 'mouseup', offDragHc)
        }
    }

    return hPanel
}

function rgbToHsv(r, g, b) {
    r = toInt(r)
    g = toInt(g)
    b = toInt(b)
    var max = getMax(r, g, b)
    var min = getMin(r, g, b)
    var h = 0,
        s = 0,
        v = 0;
    if (max === min) {
        h = 0;
    } else {
        var sub = max - min
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