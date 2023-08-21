import {build} from 'esbuild';
import {copy} from 'esbuild-plugin-copy';

build({
    entryPoints: ['src/index.mjs'],
    bundle: true,
    format: 'esm',
    target: 'es2020',
    outfile: 'public/js/index.mjs',

    plugins: [
        copy({
            assets: [
                {
                    from: 'node_modules/jquery/dist/jquery.min.js',
                    to: 'jquery.js'
                },
                {
                    from: 'node_modules/tidy-html5/tidy.js',
                    to: 'tidy.js'
                }
            ],
        }),
    ],

    external: ['jquery', 'tidy'],
}).catch(() => process.exit(1));