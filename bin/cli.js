#!/usr/bin/env node

const meow = require('meow');

const { writeFileSync } = require('fs');

const { packConfig } = require('..');

const cli = meow(
  `
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

`,
  {
    flags: {
      config: {
        type: 'string',
        alias: 'c',
        default: '.bpmnlintrc'
      },
      outfile: {
        type: 'string',
        alias: 'o'
      },
      target: {
        type: 'string',
        alias: 't',
        default: 'cjs'
      },
      targetName: {
        type: 'string'
      }
    }
  }
);

async function run(options) {
  const {
    config,
    outfile,
    target,
    targetName
  } = options;

  const { code } = await packConfig(config, target, targetName);

  if (outfile) {
    writeFileSync(outfile, code, 'utf8');
  } else {
    console.log(code);
  }
}


run(cli.flags);