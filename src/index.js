import { init } from './init.js'

const f = '__FORMAT__'
if (f === 'cjs') {
    require('./style.css')
}

let uid = 0
class Eeditor {
    constructor() {
        this._uid = uid++
    }
}

init(Eeditor)

export default Eeditor