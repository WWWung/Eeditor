import { isEditorContainer } from '../utils/dom.js'

export class Selection {
    constructor() {
        this._sel = null
        this._range = null
    }
    saveRange(r) {
        if (r) {
            return (this._range = r)
        }
        const sel = this._sel = window.getSelection()
        if (!sel.rangeCount) {
            return (this._range = null)
        }
        r = sel.getRangeAt(0)
        const parent = this.getSelectionContainer(r)
        if (!parent || !parent.getAttribute("contenteditable") !== "true" && !isEditorContainer(parent, "[contenteditable=true]")) {
            return (this._range = null)
        }
        this._range = r
    }
    getSelectionContainer(r) {
        if (!r) {
            return null
        }
        const container = r.commonAncestorContainer
        return container.nodeType === 1 ? container : container.parentNode
    }
    restoreSelection(r) {
        r = r || this._range
        if (!r) {
            return
        }
        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(r)
    }
    getSelectionContainerElem(range) {
        range = range || this._range
        let elem
        if (range) {
            elem = range.commonAncestorContainer
            return elem.nodeType === 1 ? elem : elem.parentNode
        }
    }
    isSelectionEmpty() {
        const range = this._range
        if (range && range.startContainer) {
            if (range.startContainer === range.endContainer) {
                if (range.startOffset === range.endOffset) {
                    return true
                }
            }
        }
        return false
    }
    createRangeByElem(el) {
        const range = document.createRange()

        range.selectNode(el)

        // 存储 range
        this.saveRange(range)
    }
}