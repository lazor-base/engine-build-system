process.on("uncaughtException", function(err) {
	"use strict";
	console.error(err.message, err.stack);
});
var path = require("path");
var rootDir = path.resolve(process.argv[1], "../../") + "/";
var UglifyJS = require("uglify-js");
var fs = require("fs");
var config = require(rootDir + "build_system/options.js");
// var Minify = require(rootDir + "build_system/minifier.js");

function mergeObject(object, container) {
	"use strict";
	for (var attrname in object) {
		if (typeof object[attrname] === "object" && Array.isArray(object[attrname]) === false) {
			container[attrname] = mergeObject(object[attrname], {});
		} else {
			container[attrname] = object[attrname];
		}
	}
	return container;
}

// function mergeOptions(obj1, obj2) {
// 	"use strict";
// 	var obj3 = mergeObject(obj1, {});
// 	obj3 = mergeObject(obj2, obj3);
// 	return obj3;
// }

var options = config.options;
var globalDefs = mergeObject(config.options.compress.global_defs, config.constNames);
var engineOptions = config.engineNames;
var singleOptions = config.singleNames;

var jsHintOptions = require(rootDir + "build_system/jsHint.json");

jsHintOptions.globals = mergeObject(config.constNames, jsHintOptions.globals);
for(var attr in jsHintOptions.globals) {
	jsHintOptions.globals[attr] = false;
}
fs.writeFileSync(rootDir + ".jshintrc", JSON.stringify(jsHintOptions));

options.compress.global_defs = globalDefs;

// var defaultOptions = {};
// Create copies of the options
var getUTF8Size = function(str) {
	"use strict";
	var sizeInBytes = str.split('')
		.map(function(ch) {
		return ch.charCodeAt(0);
	}).map(function(uchar) {
		// characters over 127 are larger than one byte
		return uchar < 128 ? 1 : 2;
	}).reduce(function(curr, next) {
		return curr + next;
	});

	return sizeInBytes;
};

function uglifyCode(folder, fileName) {
	"use strict";
	options.parse.filename = rootDir + "build/temp/" + folder + "/" + fileName + ".js";
	var parseOptions = UglifyJS.defaults({}, options.parse);
	var compressOptions = UglifyJS.defaults({}, options.compress);
	var outputOptions = UglifyJS.defaults({}, options.output);

	// parseOptions = defaults(parseOptions, defaultOptions.parse, true);
	// compressOptions = defaults(compressOptions, defaultOptions.compress, true);
	// outputOptions = defaults(outputOptions, defaultOptions.output, true);

	// 1. Parse
	var fullCode = fs.readFileSync(rootDir + "build/temp/" + folder + "/" + fileName + ".js", "utf8");
	var topLevelAst = UglifyJS.parse(fullCode, parseOptions);
	topLevelAst.figure_out_scope();

	// 2. Compress
	var compressor = new UglifyJS.Compressor(compressOptions);
	var compressedAst = topLevelAst.transform(compressor);

	// 3. Mangle
	compressedAst.figure_out_scope();
	compressedAst.compute_char_frequency();
	// compressedAst.mangle_names();

	// 4. Generate output
	var uglifiedCode = compressedAst.print_to_string(outputOptions);
	var oldSize = getUTF8Size(fullCode);
	var newSize = getUTF8Size(uglifiedCode);
	var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
	console.log("Saved " + saved + " % of old size: " + oldSize + "B with new size: " + newSize + "B for " + fileName);
	// var minifiedCode = Minify(uglifiedCode);

	fs.writeFileSync(rootDir + "build/" + folder + "/" + fileName + ".js", uglifiedCode);
	console.log("Wrote final build to " + rootDir + "build/" + folder + "/" + fileName + ".js");
}

// function unique(array) {
// 	array.reverse();
// 	var result = array.filter(function(e, i, array) {
// 		return array.indexOf(e, i + 1) === -1;
// 	}).reverse();
// 	array.reverse();
// 	return result;
// }

var nameRegex = /(?:\/\/\s*name[s]?:\s*)([a-z]*)/gi;
var fileNameRegex = /(?:\/\/\s*filename[s]?:\s*)([a-z,]*)/gi;
var targetFolderRegex = /(?:\/\/\s*target[s]?:\s*)([a-z,]*)/gi;
var variableRegex = /(?:\/\/\s*variable[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*variable[s]?)/gi;
var functionRegex = /(?:\/\/\s*function[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*function[s]?)/gi;
var otherRegex = /(?:\/\/\s*other[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*other[s]?)/gi;
var returnRegex = /(?:\/\/\s*return[s]?[\n\r])([\S\n\r\D]*)(?:\/\/\s*end\s*return[s]?)/gi;
var copyOriginalFileRegex = /(?:\/\/\s*copyFile[s]?:\s*)([a-z]*)/gi;

var names = [];
var fileNames = [];
var targetFolders = [];
var variables = [];
var functions = [];
var others = [];
var returns = [];

var files = fs.readdirSync(rootDir);
for (var i = 0; i < files.length; i++) {
	var file = files[i];
	nameRegex.lastIndex = 0;
	fileNameRegex.lastIndex = 0;
	targetFolderRegex.lastIndex = 0;
	variableRegex.lastIndex = 0;
	functionRegex.lastIndex = 0;
	otherRegex.lastIndex = 0;
	returnRegex.lastIndex = 0;
	if (file.indexOf("js") > -1) {
		var string = fs.readFileSync(rootDir + file, "utf8");
		if (string.match(copyOriginalFileRegex) !== null && string.split(copyOriginalFileRegex)[1] === "true") {
			for (var attr in singleOptions) {
				if (string.indexOf(attr) > -1) {
					string = string.replace(new RegExp(attr, "g"), singleOptions[attr]);
				}
			}
			if (file.indexOf(".json") === -1) {
				fs.writeFileSync(rootDir + "build/temp/client/" + file, string);
				console.log("Wrote temporary file to " + rootDir + "build/temp/client/" + file);
				uglifyCode("client", file.split(".js")[0]);
			} else {
				fs.writeFileSync(rootDir + "build/client/" + file, string);
				console.log("Wrote temporary file to " + rootDir + "build/client/" + file);
			}
		} else if (string.match(nameRegex) !== null) {
			// only gather files that are prepped for the engine.
			names.push(string.split(nameRegex)[1]);
			fileNames.push(string.split(fileNameRegex)[1].split(","));
			targetFolders.push(string.split(targetFolderRegex)[1].split(","));
			variables.push(string.split(variableRegex)[1]);
			functions.push(string.split(functionRegex)[1]);
			others.push(string.split(otherRegex)[1]);
			returns.push(string.split(returnRegex)[1]);
		}
	}
}

var fileContents = {};
for (var i = 0; i < names.length; i++) {
	for (var e = 0; e < fileNames[i].length; e++) {
		var id = fileNames[i][e].toLowerCase() + "_" + targetFolders[i][e].toLowerCase();
		if (!fileContents[id]) {
			fileContents[id] = {
				names: [names[i]],
				fileName: fileNames[i][e],
				folder: targetFolders[i][e].toLowerCase(),
				variables: [variables[i]],
				functions: [functions[i]],
				others: [others[i]],
				returns: [returns[i]]
			};
		} else {
			fileContents[id].names.push(names[i]);
			fileContents[id].variables.push(variables[i]);
			fileContents[id].functions.push(functions[i]);
			fileContents[id].others.push(others[i]);
			fileContents[id].returns.push(returns[i]);
		}
	}
}

for (var id in fileContents) {
	var data = fileContents[id];
	var content = "";
	if (id.indexOf("engine") > -1) {
		var header = fs.readFileSync(rootDir + "build_system/" + id + "_head.js", "utf8");
		var footer = fs.readFileSync(rootDir + "build_system/" + id + "_foot.js", "utf8");
	} else {
		var header = fs.readFileSync(rootDir + "build_system/default_" + data.folder + "_head.js", "utf8");
		var footer = fs.readFileSync(rootDir + "build_system/default_" + data.folder + "_foot.js", "utf8");
	}
	content = header + data.variables.join("\n\r") + data.functions.join("\n\r") + data.others.join("\n\r");

	for (var i = 0; i < data.returns.length; i++) {
		content += "window." + data.names[i] + "={" + data.returns[i] + "};\n\r";
	}
	content += footer;
	if (data.fileName.toLowerCase().indexOf("engine") > -1) {
		for (var attr in engineOptions) {
			if (content.indexOf(attr) > -1) {
				content = content.replace(new RegExp(attr, "g"), engineOptions[attr]);
			}
		}
	} else {
		for (var attr in singleOptions) {
			if (content.indexOf(attr) > -1) {
				content = content.replace(new RegExp(attr, "g"), singleOptions[attr]);
			}
		}
	}
	fs.writeFileSync(rootDir + "build/temp/" + data.folder + "/" + data.fileName + ".js", content);
	console.log("Wrote temporary file to " + rootDir + "build/temp/" + data.folder + "/" + data.fileName + ".js");
	uglifyCode(data.folder, data.fileName);
}