const {
  rollup
} = require('rollup');

const rollupBpmnlint = require('rollup-plugin-bpmnlint');

const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');


async function packConfig(configPath, target) {

  // TODO(nikku): properly resolve to relative path
  configPath = './' + configPath;

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

  return await bundle.generate({
    format: target,
    exports: 'named'
  });
}

module.exports.packConfig = packConfig;