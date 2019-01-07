import { query, getStyle } from "./utils/dom";
import { max } from "./utils/other";

const opts = {
    el: null,
    tools: []
}

export function initOpts(options, e) {
    const el = e.el = query(options.el)
    const tools = e.tools = normalizeTools(options.tools)

    normalizeStyle(options, el)

    e.options = options
}

function normalizeTools(tools) {
    if (!tools) {
        return []
    }
    return tools.split(' ')
}

function normalizeStyle(options, el) {
    const w = options.width || getStyle(el, 'width')
    const h = options.height || getStyle(el, 'height')
    options.width = max(w, 600)
    options.height = max(h, 300)
}