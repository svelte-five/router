import { resolve } from 'path'
import { type UserConfigExport, defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'

export default (): UserConfigExport => {
    return defineConfig({
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'SvelteFiveRouter',
                // the proper extensions will be added
                fileName: 'index',
            },
            rollupOptions: {
                // make sure to externalize deps that shouldn't be bundled
                // into your library
                external: ['svelte', 'esm-env', 'regexparam']
            },
        },
        plugins: [
            // svelte plugin is essential for vite to work with svelte
            svelte(),
            dts()
        ]
    })
}
