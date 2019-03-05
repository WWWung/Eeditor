import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, execCommandSync, queryCommandState, queryCommandValue } from '../execCommand'

class Italic {
    constructor(e) {
        this._active = false
        this._editor = e
        const uid = this._uid = `italic-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-hover ee-tool-italic"></div>`)
        const main = this.main = elementCreater(`<div id="${uid}" class="ee-tool-normal italic-button eticon-italic"></div>`)
        el.appendChild(main)
        bindEvent(this)
    }
    query() {
        const v = queryCommandState('italic')
        this._active = !!v
        if (this._active) {
            addClass(this.main, 'et-active')
        } else {
            removeClass(this.main, 'et-active')
        }
    }
    do() {
        const c = this
        execCommand('italic', null, function() {
            c.query.call(c)
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
    bind(el, 'click', doo)

    function doo() {
        selection.restoreSelection()
        c.do()
    }
}

function offEvent(el) {

}

export function italic(e, toolbar) {
    const ei = e.cmd.italic = new Italic(e)
    toolbar.appendChild(ei.el)
}