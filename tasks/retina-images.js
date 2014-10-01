var grunt = require('grunt');
var fs = require('fs');

var proxy = function(func, context) {
	var _func = func;
	var _context = context;
	return function() {
		_func.apply(_context, Array.prototype.slice.call(arguments));
	};
};

var ImageMagicWrapper = {
	"im": undefined,
	"suffixes": [],
	"init": function(file, suffixes, callback, context) {
		try {
			this.im = require('node-imagemagick');
			this.file = file;
			this.path = file.substr(0, file.lastIndexOf('/') + 1);
			this.extention = file.substr(file.lastIndexOf('.') + 1);
			this.name = file.substr(file.lastIndexOf('/') + 1, file.lastIndexOf('.') - file.lastIndexOf('/') - 1);
			this.suffixes = suffixes;
			this.callback = callback;
			this.context = context;

			this.im.identify(['-format', '%wx%h', this.file], proxy(this.resize, this));
		} catch(e) {
			this.complete(false, e);
		}
	},
	"resize": function(err, output) {
		try {
			this.baseWidth = Number(output.split('x')[0]);
			this.baseHeight = Number(output.split('x')[1]);
			var resultName = this.path + this.name.split(this.suffixes[0]).join(this.suffixes[1]) + '.' + this.extention;

			if (fs.existsSync(resultName)) {
				this.complete(this, true);
			} else {
				this.im.resize({
					"width": Math.round(this.baseWidth/2),
					"height": Math.round(this.baseHeight/2),
					"srcPath": this.file,
					"dstPath": resultName
				}, proxy(this.complete, this));
				grunt.log.write('file [', resultName, '] is created.\n');

			}
		} catch (e) {
			this.complete(false, e);
		}
	},
	"complete": function(success, error) {
		this.callback.apply(this.context,[this, success, error]);
	}
};

module.exports = function(grunt) {
	grunt.registerMultiTask('retinaImg', 'generates images set due to configuration', function() {
		var done = this.async();
		grunt.log.warn("\nPlease make sure that you installed imageMagic CLI before start.\n");
		var files = grunt.file.expand(this.data.files);
		var suffixes = this.data.suffixes || ["@2x", "@1x"];

		var cmds=[];
		var cmd;

		function onComplete(cmd, success, err) {
			if (!success) {
				grunt.log.write("Error in: ", cmd.file, " processing: [ ", (err && err.code ? err.code : "UnknownError"), " ]\n");
			}
			cmds.splice(cmds.indexOf(cmd), 1);
			if (!cmds.length) {
				done();
			}
		}

		for (var i = 0; i < files.length; i++) {
			cmd = Object.create(ImageMagicWrapper);
			cmds.push(cmd);
			cmd.init(files[i], suffixes, onComplete, this);
		}

		if (!files.length) {
			grunt.log.write("Nothing to do\n");
			done();
		}
	});
};