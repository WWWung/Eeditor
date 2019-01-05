import { initOpts } from './options.js'
import './style/index.css'

let uid = 0

class Editor {
    constructor(options) {
        this.init(options)
    }
    init(options) {
        const e = this
        e.id = uid++
            initOpts(options, e)
    }
}

// init(Editor)

export default Editor