import { initOpts } from './options.js'
import { draw } from './draw.js';
import { Selection } from './selection'
import { execCommand } from './execCommand'
import { elementCreater, bind } from './utils/dom.js';
export function init(Eeditor) {
    Eeditor.prototype.init = function(options) {
        initOpts(options, this)
        this._s = new Selection()
        this.cmd = {}
        draw(this)
        initWriter(this)
    }
}

function initWriter(e) {
    execCommand('styleWithCSS', e.options.styleWith === 'css')
        //  如果可编辑区域没有内容则插入一个空行，详见 http://web.jobbole.com/92919/
    const dom = e._wrap.querySelector(`#ew-${e._uid}`)
    if (!dom.children.length) {
        const br = elementCreater(`<p><br></p>`)
        dom.appendChild(br)
    }
    //  由于这个空行是会被删除的，所以监听一下删除事件
    bind(dom, 'keyup', function(ev) {
        if (ev.keyCode === 8) {
            initWriter(e)
        }
    })
}