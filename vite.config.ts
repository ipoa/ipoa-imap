import { defineConfig } from 'vite'
import * as path from 'path'
import { resolve } from 'path'
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '/src': resolve('./src'),
        '@': resolve(__dirname, './src'),
      },
    },
    server:{
      port: 3001
    },
    build: {
      outDir: './example/dist',
      minify: false,
      lib: {
        entry: path.resolve(__dirname, 'src/main.ts'),
        name: 'IMap',
        formats: ['umd'],
      },
      rollupOptions: {
        external: ['cesium'],
        output: {
          globals: {
            cesium: 'Cesium',
          },
        },
      },
    },
  };
});
