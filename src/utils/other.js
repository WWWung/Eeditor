export function warn(msg) {
    console.error(msg)
}

export function makeMap(keys) {
    const map = Object.create(null)
    const arr = keys.split(',')
    for (let i = 0; i < arr.length; i++) {
        map[arr[i]] = true
    }
    return k => map[k]
}

export function toInt(v) {
    const r = parseInt(v)
    if (r === r) {
        return r
    }
    return 0
}

export function getMax(...nums) {
    nums = nums.filter(n => typeof n === 'number' && n === n)
    return Math.max(...nums)
}

export function getMin(...nums) {
    nums = nums.filter(n => typeof n === 'number' && n === n)
    return Math.min(...nums)
}

export function unique(arr) {
    const s = new Set(arr)
    return [...s]
}

export function mergeObect(to, from) {
    return Object.assign(to, from)
}

export function noop() {

}

export function doWithCheck(func, context) {
    if (typeof func !== 'function') {
        return
    }
    if (context) {
        func.call(context)
    } else {
        func()
    }
}