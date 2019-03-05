import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, queryCommandState, queryCommandValue } from '../execCommand'

const sizes = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7'
]

class FontSize {
    constructor(e) {
        this._active = false
        this._editor = e
        const uid = this._uid = `fontSize-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-hover ee-tool-fontSize"></div>`)

        let html = `<select id="${uid}" class="ew-selector ew-selector-fontsize">`
        for (let i = 0; i < sizes.length; i++) {
            const size = sizes[i]
            html += `<option value="${size}">${size}</option>`
        }
        html += '</select>'
        const main = this.main = elementCreater(html)

        el.appendChild(main)
        bindEvent(this)
    }
    query() {
        const v = queryCommandState('fontSize')
        this._active = !!v
        if (this._active) {
            addClass(this.main, 'et-active')
        } else {
            removeClass(this.main, 'et-active')
        }
    }
    do(size) {
        const c = this
        execCommand('fontSize', size, function() {
            c.query()
            c._editor._s.saveRange()
        })
    }
    cancel() {
        if (this._active) {
            this.do()
        }
    }
}

function bindEvent(c) {
    const el = c.main
    const selection = c._editor._s
    if (!el) {
        return
    }
    bind(el, 'change', doo)

    function doo() {
        selection.restoreSelection()
        c.do(this.value)
    }
}

function offEvent(el) {

}

export function fontSize(e, toolbar) {
    const ei = e.cmd.fontSize = new FontSize(e)
    toolbar.appendChild(ei.el)
}