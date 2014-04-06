process.on("uncaughtException", function(err) {
	"use strict";
	console.error(err.stack);
	console.error(err.toString());
});
var path = require("path");
var rootDir = path.resolve(process.argv[1], "../../") + "/";
var UglifyJS = require("uglify-js");
var fs = require("fs");
var config = require(rootDir + "buildOptions.js");
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


var options = config.options;
var globalDefs = mergeObject(config.options.compress.global_defs, config.constNames);
var localDataNames = config.local;
var remoteDataNames = config.remote;

var jsHintOptions = require(rootDir + "build_system/jsHint.json");

jsHintOptions.globals = mergeObject(config.constNames, jsHintOptions.globals);
for (var attr in jsHintOptions.globals) {
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
var htmlContent = [];
var badList = ["build_system", "node_modules", ".git", "crashes", "build"];

function isGoodFile(file) {
	"use strict";
	for (var i = 0; i < badList.length; i++) {
		if (file.indexOf(badList[i]) > -1) {
			return false;
		}
	}
	return true;
}

var walk = function(dir, done) {
	"use strict";
	var results = [];
	fs.readdir(dir, function(err, list) {
		if (err) {
			return done(err);
		}
		var pending = list.length;
		if (!pending) {
			return done(null, results);
		}
		list.forEach(function(file) {
			file = dir + "/" + file;
			fs.stat(file, function(err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function(err, res) {
						results = results.concat(res);
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					if (isGoodFile(file)) {
						results.push(file);
					}
					if (!--pending) {
						done(null, results);
					}
				}
			});
		});
	});
};
walk(rootDir, function(err, files) {
	"use strict";
	if (err) {
		throw new Error(err);
	}
	for (var t = 0; t < files.length; t++) {
		var file = files[t];
		var extensionName = path.extname(file);
		var fileName = path.basename(file);
		nameRegex.lastIndex = 0;
		fileNameRegex.lastIndex = 0;
		targetFolderRegex.lastIndex = 0;
		variableRegex.lastIndex = 0;
		functionRegex.lastIndex = 0;
		otherRegex.lastIndex = 0;
		returnRegex.lastIndex = 0;
		var string = fs.readFileSync(file, "utf8");
		if (extensionName === ".js" || extensionName === ".json") {
			if (string.match(copyOriginalFileRegex) !== null && string.split(copyOriginalFileRegex)[1] === "true") {
				for (var attr in remoteDataNames) {
					if (string.indexOf(attr) > -1) {
						string = string.replace(new RegExp(attr, "g"), remoteDataNames[attr]);
					}
				}
				if (extensionName === ".js") {
					fs.writeFileSync(rootDir + "build/temp/client/" + fileName, string.trim());
					console.log("Wrote temporary file to " + rootDir + "build/temp/client/" + fileName);
					uglifyCode("client", path.basename(fileName, extensionName));
				} else {
					if (string.match(copyOriginalFileRegex) !== null) {
						string = string.replace(copyOriginalFileRegex, "");
					}
					fs.writeFileSync(rootDir + "build/client/" + fileName, string.trim());
					console.log("Wrote temporary file to " + rootDir + "build/client/" + fileName);
				}
			} else if (string.match(nameRegex) !== null) {
				var result = string.split(fileNameRegex)[1];
				// only gather files that are prepped for the engine.
				names.push(string.split(nameRegex)[1]);
				fileNames.push(result.split(","));
				targetFolders.push(string.split(targetFolderRegex)[1].split(","));
				variables.push(string.split(variableRegex)[1]);
				functions.push(string.split(functionRegex)[1]);
				others.push(string.split(otherRegex)[1]);
				returns.push(string.split(returnRegex)[1].trim());
			}
		} else if (extensionName === ".html") {
			htmlContent.push(string.trim());
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
				var found = false;
				for (var r = 0; r < fileContents[id].names.length; r++) {
					if (fileContents[id].names[r] === names[i]) {
						found = true;
						break;
					}
				}
				if (found) {
					if (variables[i].length) {
						fileContents[id].variables[r] = fileContents[id].variables[r] + variables[i];
					}
					if (functions[i].length) {
						fileContents[id].functions[r] = fileContents[id].functions[r] + functions[i];
					}
					if (others[i].length) {
						fileContents[id].others[r] = fileContents[id].others[r] + others[i];
					}
					if (returns[i].length) {
						fileContents[id].returns[r] = fileContents[id].returns[r] + "," + returns[i];
					}
				} else {
					if (names[i].length) {
						fileContents[id].names.push(names[i]);
					}
					if (variables[i].length) {
						fileContents[id].variables.push(variables[i]);
					}
					if (functions[i].length) {
						fileContents[id].functions.push(functions[i]);
					}
					if (others[i] && others[i].length) {
						fileContents[id].others.push(others[i]);
					}
					if (returns[i].length) {
						fileContents[id].returns.push(returns[i]);
					}
				}
			}
		}
	}

	for (var fileId in fileContents) {
		var data = fileContents[fileId];
		var content = "";
		var header = "";
		var footer = "";
		if (fileId.indexOf("engine") > -1) {
			header = fs.readFileSync(rootDir + "build_system/" + fileId + "_head.js", "utf8");
			footer = fs.readFileSync(rootDir + "build_system/" + fileId + "_foot.js", "utf8");
		} else {
			header = fs.readFileSync(rootDir + "build_system/default_" + data.folder + "_head.js", "utf8");
			footer = fs.readFileSync(rootDir + "build_system/default_" + data.folder + "_foot.js", "utf8");
		}
		content = header + data.variables.join("\n\r") + data.functions.join("\n\r") + data.others.join("\n\r");

		for (var f = 0; f < data.returns.length; f++) {
			content += "window." + data.names[f] + "={" + data.returns[f] + "};\n\r";
		}
		content += footer;
		for (var fileAttr in localDataNames) {
			if (data.names.indexOf(fileAttr) > -1) {
				for (var property in localDataNames[fileAttr]) {
					if (content.indexOf(property) > -1) {
						content = content.replace(new RegExp(property, "g"), localDataNames[fileAttr][property]);
					}
				}
			}
		}
		for (var remoteAttr in remoteDataNames) {
			if (content.indexOf(remoteAttr) > -1) {
				content = content.replace(new RegExp(remoteAttr, "g"), remoteDataNames[remoteAttr]);
			}
		}

		fs.writeFileSync(rootDir + "build/temp/" + data.folder + "/" + data.fileName + ".js", content);
		console.log("Wrote temporary file to " + rootDir + "build/temp/" + data.folder + "/" + data.fileName + ".js");
		uglifyCode(data.folder, data.fileName);
	}

	Array.prototype.move = function(pos1, pos2) {
		// local variables
		var i, tmp;
		// cast input parameters to integers
		pos1 = parseInt(pos1, 10);
		pos2 = parseInt(pos2, 10);
		// if positions are different and inside array
		if (pos1 !== pos2 && 0 <= pos1 && pos1 <= this.length && 0 <= pos2 && pos2 <= this.length) {
			// save element from position 1
			tmp = this[pos1];
			// move element down and shift other elements up
			if (pos1 < pos2) {
				for (i = pos1; i < pos2; i++) {
					this[i] = this[i + 1];
				}
			}
			// move element up and shift other elements down
			else {
				for (i = pos1; i > pos2; i--) {
					this[i] = this[i - 1];
				}
			}
			// put element from position 1 to destination
			this[pos2] = tmp;
		}
	};
	var builtFiles = fs.readdirSync(rootDir + "build/client/");
	var index = 0;
	while (index < builtFiles.length) {
		if (fs.lstatSync(rootDir + "build/client/" + builtFiles[index]).isFile()) {
			index++;
		} else {
			builtFiles.splice(index, 1);
		}
	}
	var basicHTMLPage = fs.readFileSync(rootDir + "build_system/index.html", "utf8");
	htmlContent = htmlContent.join("\n").replace(new RegExp("\n", "g"), "\n\t\t\t");
	basicHTMLPage = basicHTMLPage.replace(new RegExp("<% HTML %>", "g"), htmlContent);
	fs.writeFileSync(rootDir + "build/temp/index.html", basicHTMLPage);
	var htmlPage = fs.readFileSync(rootDir + "build/temp/index.html", "utf8");
	var invalidScripts = ["WebWorker.js", "package.json", "index.html"];
	for (var j = 0; j < invalidScripts.length; j++) {
		if (builtFiles.indexOf(invalidScripts[j]) > -1) {
			builtFiles.splice(builtFiles.indexOf(invalidScripts[j]), 1);
		}
	}
	var engineIndex = builtFiles.indexOf("Engine.js");
	builtFiles.move(engineIndex, builtFiles.length - 1);
	var gameIndex = builtFiles.indexOf("Game.js");
	builtFiles.move(gameIndex, builtFiles.length - 1);
	for (var k = 0; k < builtFiles.length; k++) {
		builtFiles[k] = "<script src='" + builtFiles[k] + "'></script>";
	}
	htmlPage = htmlPage.replace(new RegExp("<% Scripts %>", "g"), builtFiles.join("\n\t\t"));
	fs.writeFileSync(rootDir + "build/Client/index.html", htmlPage);
});