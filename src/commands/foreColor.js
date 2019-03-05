import { elementCreater, bind, addClass, removeClass } from "../utils/dom";
import { execCommand, queryCommandState, queryCommandValue } from '../execCommand'
import { ColorPicker } from '../colorPicker'

class ForeColor {
    constructor(e) {
        this._value = '#1A1A1A'
        this._editor = e

        initCp(this)

        const uid = this._uid = `foreColor-${e._uid}`
        const el = this.el = elementCreater(`<div class="ee-tool ee-tool-hover ee-tool-foreColor"></div>`)
        const main = this.main = elementCreater(`<div id="${uid}" class="ee-tool-normal foreColor-button eticon-color"><span></span></div>`)
        el.appendChild(main)

        bindEvent(this)
    }
    query() {
        this._value = this.main.querySelector('span').style.backgroundColor = queryCommandValue('foreColor')
    }
}

function bindEvent(c) {
    bind(c.main, 'click', function(e) {
        e.stopPropagation()
        e.cancelBubble = true
        c._cp.show()
    })
}

function offEvent(el) {

}

function initCp(c) {
    const option = {
        el: c._editor._wrap,
        beforeHide() {
            c._editor._s.restoreSelection()
            const hex = this.hex()
            c.main.querySelector('span').style.backgroundColor = `#${hex}`
            execCommand('foreColor', hex)
            c._editor._s.saveRange()
        }
    }
    c._cp = new ColorPicker(option)
}

export function foreColor(e, toolbar) {
    const ei = e.cmd.foreColor = new ForeColor(e)
    toolbar.appendChild(ei.el)
}