# bpmnlint-pack-config

[![Build Status](https://travis-ci.org/nikku/bpmnlint-pack-config.svg?branch=master)](https://travis-ci.org/nikku/bpmnlint-pack-config)

Pack a [bpmnlint](https://github.com/bpmn-io/bpmnlint) configuration as a consumable bundle.


## Usage

Pack a configuration using the `bpmnlint-pack-config` executable:

```
bpmnlint-pack-config -c .bpmnlintrc -o packed-config.js -t es
```

Consume the packed config as part of your web-modeler:

```javascript
import { Linter } from 'bpmnlint';

import linterConfig from './packed-config';

var linter = new Linter(linterConfig);

const results = await linter.lint(modelRoot);
```


## License

MIT