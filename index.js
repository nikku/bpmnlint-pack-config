const {
  rollup
} = require('rollup');

const bpmnlint = require('rollup-plugin-bpmnlint');

const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');


async function packConfig(configPath, target, targetName) {

  const bundle = await rollup({
    input: configPath,
    plugins: [
      nodeResolve(),
      commonjs(),
      bpmnlint({
        include: configPath
      })
    ]
  });

  const result = await bundle.generate({
    format: target,
    exports: 'named',
    name: targetName
  });

  return result.output[0];
}

module.exports.packConfig = packConfig;