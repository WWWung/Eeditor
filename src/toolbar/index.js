import { elementCreater } from "../utils/dom";
import { makeMap } from "../utils/other";
import handlers from "../commands"

/**
 * bold:  bold 加粗
 * italic: italic 斜体
 * underline: underline 下划线
 * lineThrough: lineThrough 删除线
 * fontSize: fontSize 字体大小
 * foreColor: foreColor 字体颜色
 * link: link 链接 
 * code: insertHtml 插入代码片段
 * fontName: fontName 字体
 * image: insertImage 插入图片
 * orderedList: insertOrderedList 插入有序列表
 * unorderedList: insertUnorderedList 插入无序列表-
 * center: justifyCenter 文字居中
 * full: justifyFull 文字对齐
 * left: justifyLeft 文字居左
 * right: justifyRight 文字居右
 * undo: undo 撤销操作
 * redo: redo 恢复撤销的操作
 * hiliteColor: hiliteColor 文字背景色
 */


const hasHandler = makeMap('bold,italic,underline,lineThrough,fontSize,foreColor,link,code,fontName,image,orderedList,unorderedList,center,full,left,right,redo,undo,hiliteColor')

export function toolbarCreater(e) {
    const wrap = e._wrap
    const toolbar = elementCreater(`<div class="editor-toolbar"></div>`)
    const tools = e.tools
    for (var i = 0; i < tools.length; i++) {
        const t = tools[i]
        const handler = handlers[t]
        handler && handler(e, toolbar)
    }
    wrap.appendChild(toolbar)
}