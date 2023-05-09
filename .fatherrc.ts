import { defineConfig } from 'father';

export default defineConfig({
  cjs: {
    output: 'lib',
  },
  esm: {
    output: 'es',
  },
  prebundle: {
    deps: {}
  },
  extraBabelPlugins: [
    ['import', { libraryName: 'antd', style: 'css' }],
  ]
});
