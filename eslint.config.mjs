import bpmnIoPlugin from 'eslint-plugin-bpmn-io';

const files = {
  lib: [
    'index.js'
  ],
  test: [
    'test/**/*.js'
  ],
  ignored: []
};

export default [
  {
    'ignores': files.ignored
  },
  ...bpmnIoPlugin.configs.recommended.map(config => {

    return {
      ...config,
      files: files.lib
    };
  }),
  ...bpmnIoPlugin.configs.node.map(config => {

    return {
      ...config,
      ignores: files.lib
    };
  }),
  ...bpmnIoPlugin.configs.mocha.map(config => {

    return {
      ...config,
      files: files.test
    };
  }),
  {
    files: [
      '**/*.js'
    ],
    languageOptions: {
      sourceType: 'commonjs'
    }
  }
];