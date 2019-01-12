import { query, getStyle } from "./utils/dom";
import { getMax, unique } from "./utils/other";

const opts = {
    el: null,
    tools: []
}

export function initOpts(options, e) {
    const el = e.el = query(options.el)
    const tools = e.tools = normalizeTools(options.tools)

    normalizeStyle(options, el)
    options.styleWith = options.styleWith || 'css'

    e.options = options
}

function normalizeTools(tools) {
    if (!tools) {
        return []
    }
    const r = tools.split(' ')
    return unique(r)
}

function normalizeStyle(options, el) {
    const w = options.width || getStyle(el, 'width')
    const h = options.height || getStyle(el, 'height')
    options.width = getMax(w, 600)
    options.height = getMax(h, 400)
}