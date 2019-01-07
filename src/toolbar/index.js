import { elementCreater } from "../utils/dom";
import { makeMap } from "../utils/other";

const hasHandler = makeMap('bold,italic,underline,lineThrough,fontSize,foreColor,link,code')

export function toolbarCreater(e, wrap) {
    const toolbar = elementCreater(`<div class="editor-toolbar"></div>`)

    wrap.appendChild(toolbar)
}