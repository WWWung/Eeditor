import { warn, makeMap, toInt, doWithCheck } from './other'

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
/**
 * 
 * @param {nodeType|string|NodeList|HTMLCollection} el 需要绑定事件的dom元素
 * @param {string} type 事件类型
 * @param {function} func 触发时需要执行的函数
 * @param {boolean} needPatch 是否需要储存事件对象
 */
export function bind(el, type, func, needPatch) {
    if (typeof el === 'string') {
        el = query(el)
        el.addEventListener(type, func)
        if (needPatch) {
            el['$' + type] = new Event(type)
        }
    } else if (el instanceof NodeList || el instanceof HTMLCollection) {
        for (var i = 0; i < el.length; i++) {
            el[i].addEventListener(type, func)
            if (needPatch) {
                el[i]['$' + type] = new Event(type)
            }
        }
    } else {
        el.addEventListener(type, func)
        if (needPatch) {
            el['$' + type] = new Event(type)
        }
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

export function domBlur(dom, func) {
    bind(document.body, 'click', blur)

    function blur(e) {
        const target = e.target
        if (dom !== target && !dom.contains(target)) {
            doWithCheck(func)
            dom.style.display = 'none'
            off(document.body, 'click', blur)
        }
    }
}