import { doAsync } from "../utils/dom";

export function execCommand(name, value, callback) {
    // doAsync(function() {
    document.execCommand(name, false, value)
        // document.execCommand('insertHTML', false, '&#8203;')
    callback && callback()
        // })
}
export function execCommandSync(name, value) {
    document.execCommand(name, false, value)
}

export function queryCommandState(name, value) {
    return document.queryCommandState(name)
}

export function queryCommandValue(name) {
    return document.queryCommandValue(name)
}