import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

console.log(uglify, '======')
const builds = {
    'web': {
        input: 'src/index.js',
        output: {
            file: './dist/editor.js',
            format: 'umd',
            name: 'Eeditor'
        },
        plugins: []
    },
    'node': {
        input: 'src/index.js',
        output: {
            file: './dist/editor.common.js',
            format: 'cjs',
            name: 'Eeditor'
        },
        plugins: [
            node(),
            cjs()
        ]
    },
    'min': {
        input: 'src/index.js',
        output: {
            file: './dist/editor.min.js',
            format: 'umd',
            name: 'Eeditor'
        },
        plugins: [uglify.uglify()]
    }
}

const getConfig = name => {
    const opts = builds[name]
    const config = {
        input: opts.input || 'src/index.js',
        output: opts.output || {
            file: './dist/editor.js',
            format: 'cjs'
        },
        plugins: [
            resolve(),
            replace({
                __FORMAT__: process.env.TARGET || 'umd'
            }),
            babel({
                exclude: 'node_modules/**'
            })
        ].concat(opts.plugins)
    }
    return config
}

module.exports = getConfig(process.env.TARGET)