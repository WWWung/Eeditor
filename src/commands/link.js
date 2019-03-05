import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, queryCommandState, queryCommandValue } from '../execCommand'

class Link {
    constructor(e) {
        this._active = false
        this._editor = e
        const uid = this._uid = `link-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-hover ee-tool-link"></div>`)
        const main = this.main = elementCreater(`<div id="${uid}" class="ee-tool-normal link-button eticon-link"></div>`)
        el.appendChild(main)
        bindEvent(this)
    }
    query() {
        const v = queryCommandState('bold')
        this._active = !!v
        if (this._active) {
            addClass(this.main, 'et-active')
        } else {
            removeClass(this.main, 'et-active')
        }
    }
    do() {
        const c = this
        execCommand('bold', null, function() {
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
    bind(el, 'click', doo)

    function doo() {
        selection.restoreSelection()
        c.do()
    }
}

function offEvent(el) {

}

export function link(e, toolbar) {
    const ei = e.cmd.link = new Link(e)
    toolbar.appendChild(ei.el)
}