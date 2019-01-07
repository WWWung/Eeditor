import './style/index.css'
import { init } from './init.js'
let uid = 0
class Eeditor {
    constructor() {
        this.id = uid++
    }
}

init(Eeditor)

export default Eeditor