import { elementCreater } from './utils/dom.js'
import { toolbarCreater } from './toolbar'

export function draw(e) {
    const opts = e.options
    const wrap = elementCreater(`<div id="editor-${e.id}" class="editor-wrap" style="width:${opts.width}px;height:${opts.height}px"></div>`)
    toolbarCreater(e, wrap)
    e.el.appendChild(wrap)
}