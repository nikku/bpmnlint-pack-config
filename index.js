const { Linter } = require('bpmnlint');

const { readFileSync } = require('fs');

const { rollup } = require('rollup');

const NodeResolver = require('bpmnlint/lib/resolver/node-resolver');

const rollupResolve = require('rollup-plugin-node-resolve');
const rollupCommonjs = require('rollup-plugin-commonjs');

const rollupHypothetical = require('rollup-plugin-hypothetical');


/**
 * Resolve and pack a linter config.
 *
 * @param {Object} config
 *
 * @return {Promise<String>} packed config as a string
 */
async function generatePacked(config) {

  const linter = new Linter({ resolver: new NodeResolver() });

  const resolvedRules = await linter.resolveConfiguredRules(config);

  const serializedRules = JSON.stringify(resolvedRules, null, '  ');

  const preambleCode = `
var cache = {};

/**
 * A resolver that caches rules and configuration as part of the bundle,
 * making them accessible in the browser.
 *
 * @param {Object} cache
 */
function Resolver() {}

Resolver.prototype.resolveRule = function(pkg, ruleName) {

  const rule = cache[pkg + '/' + ruleName];

  if (!rule) {
    throw new Error('cannot resolve rule <' + pkg + '/' + ruleName + '>');
  }

  return rule;
};

Resolver.prototype.resolveConfig = function(pkg, configName) {
  throw new Error(
    'cannot resolve config <' + configName + '> in <' + pkg +'>'
  );
};

var resolver = new Resolver();

var config = {
  rules: ${serializedRules}
};

var bundle = {
  resolver: resolver,
  config: config
};

export { resolver, config };

export default bundle;
`;

  const importCode = Object.entries(resolvedRules).filter(
    ([ key, value ]) => linter.parseRuleValue(value).ruleFlag !== 'off'
  ).map(([ key, value ], idx) => {

    const {
      pkg, ruleName
    } = linter.parseRuleName(key);

    return `
import rule_${idx} from '${pkg}/rules/${ruleName}';
cache['${pkg}/${ruleName}'] = rule_${idx};`;
  }).join('\n');

  return `${preambleCode}\n\n${importCode}`;
}

function readConfig(path) {
  const contents = readFileSync(path, 'utf8');

  return JSON.parse(contents);
}

async function bundle(configPath, incode, target) {

  if (!/\.js$/.test(configPath)) {
    configPath += '.js';
  }

  // TODO(nikku): properly resolve to relative path
  configPath = './' + configPath;

  const bundle = await rollup({
    input: configPath,
    plugins: [
      rollupHypothetical({
        files: {
          [configPath]: incode
        },
        allowFallthrough: true
      }),
      rollupResolve(),
      rollupCommonjs()
    ]
  });

  const { code } = await bundle.generate({
    format: target,
    exports: 'named'
  });

  return code;
}

async function packConfig(configPath, target) {

  const config = readConfig(configPath);

  const intermediateCode = await generatePacked(config);

  const code = await bundle(configPath, intermediateCode, target);

  return code;
}


module.exports.generatePacked = generatePacked;
module.exports.packConfig = packConfig;