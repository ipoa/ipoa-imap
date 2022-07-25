import { defineConfig } from 'vite'
import * as path from 'path'
export default defineConfig(() => {
  return {
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
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
