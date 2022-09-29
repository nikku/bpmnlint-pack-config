#!/usr/bin/env node

const mri = require('mri');

const { writeFileSync } = require('fs');

const { packConfig } = require('..');

const options = mri(process.argv.slice(2), {

  alias: {
    c: 'config',
    o: 'outfile',
    t: 'target'
  },

  default: {
    config: '.bpmnlintrc',
    target: 'cjs',
  },

  string: [
    'outfile',
    'target-name'
  ],

  boolean: [
    'help'
  ]
});


if (options.help) {
  console.log(`
  Usage
    $ bpmnlint-pack-config [-c ...] [-o outfile] [-t es|cjs|umd]

  Options
    --config, -c    Config file path, takes precedence over local .bpmnlintrc
    --target, -t    Target format (cjs, es) of generated bundle (default: cjs)
    --target-name   Name of the UMD export
    --outfile, -o   Output path for generated bundle

  Examples
    $ bpmnlint-pack-config -t es > packed-config.js
    $ bpmnlint-pack-config -c conf/bpmnlint.json -o conf/bpmnlint.json.js
`);

  process.exit(0);
}

if (!options.config) {
  console.error('missing <config>');

  process.exit(1);
}

async function run(options) {
  const {
    config,
    outfile,
    target,
    'target-name': targetName
  } = options;

  const { code } = await packConfig(config, target, targetName);

  if (outfile) {
    writeFileSync(outfile, code, 'utf8');
  } else {
    console.log(code);
  }
}


run(options);