'use strict'

var EOL = require('os').EOL

module.exports = function (entity, naming) {
	let first

	if (entity.mod?.name) {
		var modVal =
			typeof entity.mod.val === 'boolean' ? entity.mod.val : "'" + entity.mod.val + "'"

		first = [
			"import React from 'reactify'",
			'',
			`import './${entity.block}.css'`,
			'',
			`const ${entity.block} = (props) => <div className={React.cn('${entity.block}')({ ${entity.mod.name}: ${modVal} })}></div>`,
			'',
			`export default ${entity.block}`,
		]
	} else if (entity.elem) {
		first = [
			"import React from 'reactify'",
			'',
			`import './${entity.elem}.css'`,
			'',
			`const ${entity.elem} = (props) => <div className={React.cn('${entity.block}', '${entity.elem}')()}></div>`,
			'',
			`export default ${entity.elem}`,
		]
	} else {
		first = [
			"import React from 'reactify'",
			'',
			`import './${entity.block}.css'`,
			'',
			`const ${entity.block} = (props) => <div className={React.cn('${entity.block}')()}></div>`,
			'',
			`export default ${entity.block}`,
		]
	}

	return first.join(EOL)
}
