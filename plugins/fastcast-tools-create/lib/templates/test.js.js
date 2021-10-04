'use strict';

var EOL = require('os').EOL;

module.exports = function(entity, naming) {
    const blockName = naming.stringify(entity);
    return [
        `import ${blockName} from './${blockName}'`,
        '',
        `describe('${blockName} component test', () => {
    it('${blockName} no empty render', () => {
        const wrapper = shallow(<${blockName} />)
        expect(wrapper.isEmptyRender()).toBe(false)
    })
})`,
        '',
    ].join(EOL);
};
