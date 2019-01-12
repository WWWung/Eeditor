import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, execCommandSync, queryCommandState, queryCommandValue } from '../execCommand'

class LineThrough {
    constructor(e) {
        this._active = false
        this._editor = e
        const uid = this._uid = `lineThrough-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-lineThrough"></div>`)
        const main = this.main = elementCreater(`<div id="${uid}" class="ee-tool-normal lineThrough-button eticon-lineThrough"></div>`)
        el.appendChild(main)
        bindEvent(this)
    }
    query() {
        const v = queryCommandState('strikeThrough')
        this._active = !!v
        if (this._active) {
            addClass(this.main, 'et-active')
        } else {
            removeClass(this.main, 'et-active')
        }
    }
    do() {
        const c = this
        execCommand('strikeThrough', null, function() {
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

export function lineThrough(e, toolbar) {
    const ei = e.cmd.lineThrough = new LineThrough(e)
    toolbar.appendChild(ei.el)
}