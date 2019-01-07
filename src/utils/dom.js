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