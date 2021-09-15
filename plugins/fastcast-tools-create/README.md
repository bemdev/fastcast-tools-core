# fastcast-tools-create

`fastcast-tools-create` could be used to create BEM-instances on the file system:

 * blocks
 * elements
 * block or element modifiers

## Usage

For each BEM-instance only configured tech is created. Configuration could be done via config file (list of default techs), command line arguments or API.

If none tech configured **no files will be created**.

You can use templates for creating tech. Custom templates could be configured in the config file

### CLI


Install [fastcast-tools-core](https://github.com/bem-tools/bem-tools-core/) to use `fastcast-tools-create` via CLI.

**SYNOPSIS**

```sh
fastcast create [-t includeTech] [-n excludeTech] [-T onlyTech] [-l level] [-f] [-c fileContent] ( -b blockName [-e elemName] [-m modName] [-v modVal] | bem__instance_description )
```

The command line options are as follows:

| Command | Description |
| --- | --- |
| -t *includeTech* | create tech *includeTech* in addition to the default tech list for current level. Could be used several times.|
| -n *excludeTech* | exclude *excludeTech* from the creation tech list to ignore some default tech for example. Could be used several times.|
| -T *onlyTech* | create only defined tech(s) totally ignoring all other tech sources (config files etc.) Could be used several times.|
| -l *level* | defines level of block creation. If set default levels from config file will be ignored. *level* could be absolute path to level directory or just short name of level configured via config file.|
| -f | force file creation even if file already exists. No warnings will be shown with this option.|
| -c *fileContent* | defines file content. With this option set template content for current tech is ignored and file will have defined content. If *fileContent* is empty (**-c** should be the last option) then content is piped from **STDIN**|
| -b *blockName* -e *elemName* -m *modName* -v *modVal* | defines BEM-instance to create. *blockName* is  mandatory part of naming. Another way to define bem instance is using string bem instance description|
| *bem__instance_description* | string defines bem-instance according to current BEM naming scheme.|

**Examples**

##### Creation of block with the default techs

```sh
fastcast create my-block
```

Creates block `my-block`. If default tech was not configured --- creates nothing.

##### Creation of block with one explicit tech

```sh
fastcast create my-block.css
```

or the same

```sh
fastcast create my-block -t css
```

Creates block `my-block` with technology `css` **in addition to default techs**.

##### Creation of block with several defined techs

```sh
fastcast create my-block.{css,js}
```

or the same

```sh
fastcast create my-block -t css -t js
```

Creates block `my-block` with techs `css` and `js` in addition to default techs.

##### Creation of block with defined techs only

```sh
fastcast create my-block -T css -T js
```

Creates block `my-block` **only** with techs `css` and `js` ignoring default techs.

##### Creation of block excluding some techs

```sh
fastcast create my-block.js -n css
```

Creates block `my-block` with techs `js` and default tech list excluding **css**.

##### Level for block creation

```sh
fastcast create level/my-block
fastcast create my-block -l level
```

Creates block `my-block` with the default techs on level `level`.
Short lavel names will be resolved relatively to the config file `.bemrc`

#### Force file overwrite

By default existing files will not be overwrited and the list of conflicting files will be shown in warning message. Non-existing file will be created anyway.

To force existing files overwriting option `-f` could be used

```sh
fastcast create -f -b bl1
```

In result all existing files will be overwrited without any warnings.

#### Define file content

To support file creation with custom content (not from configured tempalte) option `-c` could be used. Content should be defined as command line argument

```sh
fastcast create -b bl1 -T css -c '.bl1
{
    display: none;
}'
```

If `-c` option used with empty value, then content of file will be piped from **STDIN**.

```sh
cat source_file.css | fastcast create -b bl1 -T css -c
```

This piped content will be writed in all created files, for example for several default techs or default levels. So `-T` option and explicit level definition usefull in conjunction with content piping.

#### Element creation

```sh
fastcast create my-block__elem
```

or

```sh
fastcast create -b my-block -e elem
```

Creates element `elem` of block `my-block` with the default techs.

##### Block modifier creation

```sh
fastcast create my-block_mod
fastcast create my-block_mod_val
```

or

```sh
fastcast create -b my-block -m mod
fastcast create -b my-block -m mod -v val
```

Creates modifier `mod` (with `val` value if defined) of block `my-block` with the default techs.

##### Element modifier creation

```sh
fastcast create my-block__elem_mod
fastcast create my-block__elem_mod_val
```

or

```sh
fastcast create -b my-block -e elem -m mod
fastcast create -b my-block -e elem -m mod -v val
```

Creates modifier `mod` (with `val` value if defined) of element `elem` of block
`my-block` with the default techs.



### JS API

```js
const create = require('fastcast-tools-create');

create('level1/b1.{css,js}'); // will create b1.css and b1.js in level1/b1 folder
create('b1__e1.{css,js}'); // will create b1/__e1/b1__e1.css and b1/__e1/b1__d1.js on default levels or cwd
create('b1'); // will create b1 with default techs from config on default levels or cwd

create([
    { block: 'b1' },
    { block: 'b1', modName: 'm1', modVal: true },
    { block: 'b1', elem: 'e2' },
    { block: 'b1', elem: 'e2', modName: 'elemMod', modVal: true },
    { block: 'b1', modName: 'm1', modVal: 'v1' }
], ['level1', 'level2'], ['css', 'js', 'bemhtml.js']);
```

### Configuration
Use [bem-config](https://github.com/bem/bem-sdk/tree/master/packages/config#config) to set up `fastcast-tools-create` behaviour.

```js
{
    "root": true,
    "levels": [
        {
            "path": "level1",
            "scheme": "nested"
        },
        {
            "path": "level2",
            "scheme": "nested"
        },
        {
            "path": "path/to/level3",
            "scheme": "nested"
        }
    ],
    "modules": {
        "fastcast-tools": {
            "plugins": {
                "create": {
                    "techs": [
                        "css", "js"
                    ]
                }
            }
        }
    }
}
```
