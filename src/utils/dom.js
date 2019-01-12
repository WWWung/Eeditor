import { warn, makeMap, toInt } from './other'

export function query(el) {
    if (typeof el === 'string') {
        const selected = document.querySelector(el)
        if (!selected) {
            warn(
                'Cannot find element: ' + el
            )
            return document.createElement('div')
        }
        return selected
    } else {
        return el
    }
}

export function elementCreater(html) {
    const div = document.createElement('div')
    if (!html) {
        return div
    }
    if (html.indexOf('<') >= 0) {
        div.innerHTML = html
        return div.children[0]
    }
    return document.createElement(html)
}

export function getStyle(el, name) {
    const style = window.getComputedStyle(el)[name] || ''
    const check = makeMap('width,height,top,left,right,bottom')
    if (check(name)) {
        return toInt(style)
    }
    return style
}

export function addClass(el, cls) {
    el.classList.add(cls)
}

export function removeClass(el, cls) {
    el.classList.remove(cls)
}

export function bind(el, type, func) {
    if (typeof el === 'string') {
        el = query(el)
    }
    try {
        el.addEventListener(type, func)
    } catch (error) {
        console.log(error)
        console.log(el)
    }
}

export function off(el, type, func) {
    if (typeof el === 'string') {
        el = query(el)
    }
    el.removeEventListener(type, func)
}

export function isNative(Ctor) {
    return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

export function doAsync(func) {
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
        const p = Promise.resolve()
        p.then(func)
        return
    }
    if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) || MessageChannel.toString() === '[object MessageChannelConstructor]')) {
        const channel = new MessageChannel()
        const port = channel.port2
        channel.port1.onmessage = func
        port.postMessage(1)
        return
    }
    setTimeout(func, 0)
}

export function isEditorContainer(dom, selector) {
    const els = document.querySelectorAll(selector)
    if (!els.length) {
        return null
    }
    if (dom.nodeName.toLowerCase() === "html") {
        return null
    }
    for (var i = 0; i < els.length; i++) {
        if (els[i] === dom.parentNode || els[i] === dom) {
            return els[i]
        }
    }
    return isEditorContainer(dom.parentNode, selector)
}