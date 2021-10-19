'use strict';

var EOL = require('os').EOL;

function toCamelCase(str) {
    return str.replace(str[0], str[0].toUpperCase());
}

module.exports = function(entity, naming) {
    let first;

    if (entity.mod?.name) {
        var capitalizeBlock = toCamelCase(entity.block);

        var modVal =
            typeof entity.mod.val === 'boolean'
                ? entity.mod.val
                : "'" + entity.mod.val + "'";

        var valBoolean = typeof entity.mod.val === 'boolean';

        first = [
            !valBoolean ? "import React from 'reactify'" : '//without react',
            "import { withBemMod } from '@bem-react/core'",
            '',
            `import './${entity.block}_${entity.mod.name}${
                !valBoolean ? '_' + entity.mod.val : ''
            }.css'`,
            `import { blockName } from '${entity.block}/${entity.block}'`,
            !valBoolean ? '' : null,
            !valBoolean
                ? `const ${capitalizeBlock}${toCamelCase(
                      entity.mod.name,
                  )} = () => ({className}) => <div className={blockName() + ' ' + className}></div>`
                : '//primitive application with mods and css',
            entity.mod.name
                ? `export const ${capitalizeBlock}${toCamelCase(
                      entity.mod.name,
                  )}${
                      !valBoolean ? toCamelCase(entity.mod.val) : ''
                  } = withBemMod('${entity.block}', { ${
                      entity.mod.name
                  } : ${modVal} }${!valBoolean ? ', ' + capitalizeBlock : ''}${
                      !valBoolean ? toCamelCase(entity.mod.name) : ''
                  })`
                : `export default ${entity.block}`,
            '',
        ];
    } else if (entity.elem) {
        var capitalizeElem = toCamelCase(entity.elem);

        first = [
            "import React from 'reactify'",
            '',
            `import { blockName } from '../${entity.block}/${entity.block}'`,
            `import './${entity.block}__${entity.elem}.css'`,
            `const elemName = React.cn(blockName(), '${entity.elem}')()`,
            '',
            `const ${capitalizeElem} = ({children}) => <div className={elemName}>{children}</div>`,
            '',
            `export default ${capitalizeElem}`,
        ];
    } else {
        first = [
            "import React from 'reactify'",
            '',
            `import './${entity.block}.css'`,
            `export const blockName = React.cn('${entity.block}')`,
            '',
            `const ${
                entity.block
            } = ({children}) => <div className={blockName()}>{children}</div>`,
            '',
            `export default ${entity.block}`,
        ];
    }

    return first.join(EOL);
};
