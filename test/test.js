const {
  packConfig
} = require('..');

const { expect } = require('chai');


describe('bpmnlint-pack-config', function() {

  describe('packConfig', function() {

    it('should write cjs', async function() {

      // when
      const code = await packConfig('test/.bpmnlintrc', 'cjs');

      // then
      expect(code).to.contain('exports.resolver = resolver;');
      expect(code).to.contain('exports.config = config;');
    });


    it('should write es', async function() {

      // when
      const code = await packConfig('test/.bpmnlintrc', 'es');

      // then
      expect(code).to.contain('export { resolver, config };');
    });

  });

})