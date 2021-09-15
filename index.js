const PLUGIN_PREFIX = 'fastcast-tools-'

const fs = require('fs'),
	path = require('path'),
	npmRootPath = require('global-modules'),
	cwd = process.cwd()

const fastcast = require('coa')
	.Cmd()
	.name(process.argv[1])
	.title(['FastCast plugins CLI runned.'])
	.helpful()
	.opt()
	.name('version')
	.title('Version')
	.short('v')
	.long('version')
	.flag()
	.only()
	.act(function () {
		return require('./package').version
	})
	.end()

function readDir(dir) {
	return new Promise(function (resolve, reject) {
		fs.readdir(dir, function (err, packages) {
			if (err && err.code !== 'ENOENT') return reject(err)

			resolve(
				(packages || []).reduce(function (acc, package) {
					acc[package] = path.resolve(dir, package)
					return acc
				}, {}),
			)
		})
	})
}

Promise.all([
	readDir(path.join(cwd)),
	readDir(path.join(cwd, 'node_modules')),
	readDir(path.join(cwd, 'node_modules', 'fastcast-tools', 'node_modules')),
	readDir(path.join(__dirname, 'node_modules')),
	readDir(path.join(__dirname, 'node_modules', 'fastcast-tools', 'node_modules')),
	readDir(npmRootPath),
	readDir(path.join(npmRootPath, 'fastcast-tools', 'node_modules')),
])
	.then(function (packagesArray) {
		var packagesHash = Object.assign.apply(Object, packagesArray.reverse())
		var packages = Object.keys(packagesHash).filter(function (package) {
			return package.indexOf(PLUGIN_PREFIX) === 0 && package !== 'fastcast-tools-core'
		})

		packages.forEach(function (packageName) {
			var commandName = packageName.replace(PLUGIN_PREFIX, ''),
				pluginPath = path.join(packagesHash[packageName], 'cli'),
				pluginModule = null

			try {
				pluginModule = require(pluginPath)
			} catch (err) {
				// TODO: implement verbose logging
				// console.warn('Cannot find module', plugin);
			}

			pluginModule && fastcast.cmd().name(commandName).apply(pluginModule).end()
		})

		fastcast.run(process.argv.slice(2))
	})
	.catch(console.error)

fastcast.act(function (opts, args) {
	if (!Object.keys(opts).length && !Object.keys(args).length) {
		return this.usage()
	}
})

module.exports = fastcast
