const {
  packConfig
} = require('..');

const { expect } = require('chai');


describe('bpmnlint-pack-config', function() {

  describe('packConfig', function() {

    it('should write cjs', async function() {

      // when
      const { code } = await packConfig('test/.bpmnlintrc', 'cjs');

      // then
      // imports are resolved
      expect(code).not.to.contain('import rule_0');

      // rules are resolved
      expect(code).to.contain('"conditional-flows": "error"');
      expect(code).to.contain('cache[\'bpmnlint/conditional-flows\'] = conditionalFlows;');

      // exports are in place
      expect(code).to.contain('exports.default = bundle');

      expect(code).to.contain('exports.config = config');
      expect(code).to.contain('exports.resolver = resolver');
    });


    it('should write es', async function() {

      // when
      const { code } = await packConfig('test/.bpmnlintrc', 'es');

      // then
      // imports are resolved
      expect(code).not.to.contain('import rule_0');

      // rules are resolved
      expect(code).to.contain('"conditional-flows": "error"');
      expect(code).to.contain('cache[\'bpmnlint/conditional-flows\'] = conditionalFlows;');

      // exports are in place
      expect(code).to.contain('export default bundle;');
      expect(code).to.contain('export { resolver, config }');
    });


    it('should pack custom named config', async function() {

      // when
      const { code } = await packConfig('test/other.json', 'esm');

      // then
      // imports are resolved
      expect(code).not.to.contain('import rule_0');

      // rules are resolved
      expect(code).to.contain('"conditional-flows": "error"');
      expect(code).to.contain('cache[\'bpmnlint/conditional-flows\'] = conditionalFlows;');
    });

  });

});