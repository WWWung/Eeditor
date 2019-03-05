import { query } from "../utils/dom";

class Select {
    constructor(opts) {
        this.option = opts
        let el = opts.el
        if (!el) {
            return this
        }
        if (typeof el === 'string') {
            el = opts.el = query(el)
        }
    }

}

function initOption(s) {
    const data = []
    if (el.nodeName.toLowerCase() === 'select') {
        const options = el.querySelector('option')
        for (var i = 0; i < options.length; i++) {
            const op = options[i]
            const opObj = {}
            opObj.value = op.value
            opObj.name = op.innerText
            opObj.selected = op.selected
            data.push(opObj)
        }
    }
    const opData = s.option.data
    if (opData && Array.isArray(opData)) {
        for (var i = 0; i < opData.length; i++) {
            const op = opData[i]
            const opObj = {}
            opObj.value = op.value || ''
            opObj.name = op.innerText || ''
            opObj.selected = !!op.selected
            data.push(opObj)
        }
    }
    s.option.data = data
}

function draw() {

}