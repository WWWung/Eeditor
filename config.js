import resolve from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'
import node from 'rollup-plugin-node-resolve'
import postcss from 'rollup-plugin-postcss'
import { setFlagsFromString } from 'v8';


const builds = {
    'web': {
        input: 'src/index.js',
        output: {
            file: './dist/editor.js',
            format: 'umd',
            name: 'eEditor'
        },
        plugins: [
            resolve(),
            node(),
            postcss({
                extensions: ['.css'],
            }),
            cjs()
        ]
    },
    'node': {
        input: 'src/index.js',
        output: {
            file: './dist/editor.common.js',
            format: 'cjs',
            name: 'eEditor'
        },
        plugins: [
            resolve(),
            node(),
            postcss({
                extensions: ['.css'],
            }),
            cjs()
        ]
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
        plugins: opts.plugins
    }
    config.output.name = 'eEditor'
    return config
}

module.exports = getConfig(process.env.TARGET)