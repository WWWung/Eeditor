import { initOpts } from './options.js'
import { draw } from './draw.js';
export function init(Eeditor) {
    Eeditor.prototype.init = function(options) {
        initOpts(options, this)
        draw(this)
    }
}