import { elementCreater, bind } from './utils/dom.js'
import { toolbarCreater } from './toolbar'

export function draw(e) {
    const opts = e.options
    const wrap = e._wrap = elementCreater(`<div id="editor-${e._uid}" class="editor-wrap" style="width:${opts.width}px;height:${opts.height}px"></div>`)
    toolbarCreater(e)
    writerCreater(e)
    e.el.appendChild(wrap)
}

function writerCreater(e) {
    const uid = e._uid
    const h = e.options.height - 46
    const ewID = `ew-${uid}`
    const ewc = elementCreater(`<div id="ew-container-${uid}" class="ew-container"><div id="${ewID}" class="ew" contenteditable=true spellcheck=false style="height:${h}px"></div></div>`)
    const ew = ewc.querySelector(`#${ewID}`)
    bind(ew, 'mouseup', saveRange)
    bind(ew, 'mouseup', query)
    bind(ew, 'keyup', saveRange)
    e._wrap.appendChild(ewc)

    function saveRange() {
        e._s.saveRange()
    }

    function query() {
        const cmd = e.cmd
        if (cmd) {
            for (let key of Object.keys(cmd)) {
                const c = cmd[key]
                c.query && c.query()
            }
        }
    }
}