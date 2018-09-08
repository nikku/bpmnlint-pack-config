# bpmnlint-pack-config

Pack a [bpmnlint](https://github.com/bpmn-io/bpmnlint) configuration as a consumable bundle.


## Usage

Pack a configuration using the `bpmnlint-pack-config` executable:

```
bpmnlint-pack-config -c .bpmnlintrc -o packed-config.js -t es
```

Consume the packed config as part of your web-modeler:

```javascript
import {
  config,
  resolver
} from './packed-config';


import { Linter } from 'bpmnlint';

var linter = new Linter({ resolver });

linter.lint(modelRoot, config);
```


## License

MIT