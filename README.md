# fastcast-tools-core

`fastcast-tools-core` is a CLI runner for its plugins.

Plugins are `npm` packages exporting [COA](https://www.npmjs.com/package/coa) command. By convention they should be named with `fastcast-tools-` prefix so `fastcast-tools-core` may find them among other packages.

## Plugins

Each plugin provides JS API and exports COA command via `cli.js` file to be used with `fastcast-tools-core`.

## Available plugins list

-   [fastcast-tools-create](https://github.com/bemdev/fastcast-tools-core/tree/main/plugins/fastcast-tools-create) — creates blocks, elements and modifiers on file system according to [FS scheme](https://en.bem.info/methodology/filesystem/).

## How to create your own plugin

1. Plugin should be named with `fastcast-tools-` prefix.
2. By convention each plugin should be available as JS API (so it may be used without `fastcast-tools-core`). You may export plugin functionality from `index.js` file in the root of your package.
3. Plugin should provide `COA` command via `cli.js` file:

```js
module.exports = function () {
	this.title('Title of your plugin')
		.helpful()
		.opt()
		.name('foo')
		.short('f')
		.long('foo')
		.title('Foo')
		.end()
		.arg()
		.name('bar')
		.title('Bar')
		.arr()
		.end()
		.act(function (opts, args) {
			console.log(opts.foo, args.bar)
		})
		.end()
}
```

For more info about COA please refer to [https://www.npmjs.com/package/coa](https://www.npmjs.com/package/coa).
