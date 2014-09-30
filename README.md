# grunt-retina-img v0.0.1 (Draft)

> Small Grunt task for generating background-images from x2 size to x1.

Due to fact this task is small configurable async wrapper for imageMagic utils, which aimed to create retina and non-retina image subsets a bit easier. It provides an access to ImageMagick via the node_imagemagick package.

## Getting Started
This task requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin. To install it you can simply clone it to your project node modules. 
Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-retina-img');
```

You will need to have image magick CLI tools installed also. There are numerous ways to install them. For instance, if you're on OS X you can use [Homebrew](http://mxcl.github.com/homebrew/): `brew install imagemagick`.

### Settings

There are a couple of options available, which are described below. Please review the [minimatch options](https://github.com/isaacs/minimatch#options) if you didn't before.

#### files
Type: `String|Array`

This defines what file patterns this task will take into account. Can be a string or an array of files and/or minimatch patterns.
There is an example below.

#### suffixes
Type: `Array`

It defines prefixes for `x2` and `x1` files like this: `suffixes: ['x2', 'x1'].

## Usage example

Here is the task configuration example.

```javascript
grunt.initConfig(
    "retinaImages": {
        dev: {
            files:"path/to/images/**/*@2x.png",
            suffixes:["@2x",""]
        }
    },
    ...
});
```

## License

MIT
