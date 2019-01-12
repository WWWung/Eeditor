import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, queryCommandState, queryCommandValue } from '../execCommand'
import { ColorPicker } from '../colorPicker'

class ForeColor {
    constructor(e) {
        this._value = '#1A1A1A'
        this._editor = e
        const uid = this._uid = `foreColor-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-foreColor"></div>`)
        const main = this.main = elementCreater(`<div id="${uid}" class="ee-tool-normal foreColor-button eticon-color"></div>`)
        el.appendChild(main)
        bindEvent(this)

        this._active = false
        this._editor = e
        const cp = new ColorPicker({
            el: this._editor._wrap
        })
        cp.show()
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

export function foreColor(e, toolbar) {
    const ei = e.cmd.foreColor = new ForeColor(e)
    toolbar.appendChild(ei.el)
}