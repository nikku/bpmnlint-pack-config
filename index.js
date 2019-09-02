const {
  rollup
} = require('rollup');

const rollupBpmnlint = require('rollup-plugin-bpmnlint');

const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');


async function packConfig(configPath, target, targetName) {

  const bundle = await rollup({
    input: configPath,
    plugins: [
      rollupResolve(),
      rollupCommonjs(),
      rollupBpmnlint({
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