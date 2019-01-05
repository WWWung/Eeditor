export function warn(msg) {
    console.error(msg)
}

export function makeMap(keys) {
    const map = Object.create(null)
    const arr = keys.split(',')
    for (let i = 0; i < arr.length; i++) {
        map[arr[i]] = true
    }
    return k => map[key]
}

export function toInt(v) {
    const r = parseInt(v)
    if (r === r) {
        return r
    }
    return 0
}

export function max(...nums) {
    nums = nums.filter(n => typeof n === 'number' && n === n)
    return Math.max(...nums)
}

export function min(...nums) {
    nums = nums.filter(n => typeof n === 'number' && n === n)
    return Math.min(...nums)
}