var path = require("path");
var root_dir = path.resolve(process.argv[1], "../../") + "/";
var UglifyJS = require("uglify-js");
var fs = require("fs");
var config = require(root_dir + "build_system/options.js");
var Minify = require(root_dir + "build_system/minifier.js");

function merge_object(object, container) {
	for (var attrname in object) {
		if (typeof object[attrname] === "object" && Array.isArray(object[attrname]) === false) {
			container[attrname] = merge_object(object[attrname], {})
		} else {
			container[attrname] = object[attrname];
		}
	}
	return container;
}

function merge_options(obj1, obj2) {
	var obj3 = merge_object(obj1, {});
	obj3 = merge_object(obj2, obj3);
	return obj3;
}

var options = config.options;
var global_defs = merge_options(config.options.compress.global_defs, config.constNames);
var engineOptions = config.engineNames;
var singleOptions = config.singleNames;

options.compress.global_defs = global_defs;

var default_options = {};
// Create copies of the options
var getUTF8Size = function(str) {
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

function unique(array) {
	array.reverse();
	var result = array.filter(function(e, i, array) {
		return array.indexOf(e, i + 1) === -1;
	}).reverse();
	array.reverse();
	return result;
}

var nameRegex = /(?:\/\/\s*name[s]?:\s*)([a-z]*)/gi;
var fileNameRegex = /(?:\/\/\s*filename[s]?:\s*)([a-z,]*)/gi;
var targetFolderRegex = /(?:\/\/\s*target[s]?:\s*)([a-z,]*)/gi;
var variableRegex = /(?:\/\/\s*variable[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*variable[s]?)/gi;
var functionRegex = /(?:\/\/\s*function[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*function[s]?)/gi;
var otherRegex = /(?:\/\/\s*other[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*other[s]?)/gi;
var returnRegex = /(?:\/\/\s*return[s]?)([\S\n\r\D]*)(?:\/\/\s*end\s*return[s]?)/gi;

var names = [];
var fileNames = [];
var targetFolders = [];
var variables = [];
var functions = [];
var others = [];
var returns = [];

var files = fs.readdirSync(root_dir);
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
		var string = fs.readFileSync(root_dir + file, "utf8");
		if (string.match(nameRegex) !== null) {
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
		var header = fs.readFileSync(root_dir + "build_system/" + id + "_head.js", "utf8");
		var footer = fs.readFileSync(root_dir + "build_system/" + id + "_foot.js", "utf8");
	} else {
		var header = fs.readFileSync(root_dir + "build_system/default_" + data.folder + "_head.js", "utf8");
		var footer = fs.readFileSync(root_dir + "build_system/default_" + data.folder + "_foot.js", "utf8");
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
	fs.writeFileSync(root_dir + "build/temp/" + data.folder + "/" + data.fileName + ".js", content);
	console.log("Wrote temporary file to " + root_dir + "build/temp/" + data.folder + "/" + data.fileName + ".js");

	with(UglifyJS) {
		options.parse.filename = root_dir + "build/temp/" + data.folder + "/" + data.fileName + ".js";
		var parse_options = defaults({}, options.parse);
		var compress_options = defaults({}, options.compress);
		var output_options = defaults({}, options.output);

		// parse_options = defaults(parse_options, default_options.parse, true);
		// compress_options = defaults(compress_options, default_options.compress, true);
		// output_options = defaults(output_options, default_options.output, true);

		// 1. Parse
		var fullCode = fs.readFileSync(root_dir + "build/temp/" + data.folder + "/" + data.fileName + ".js", "utf8");
		var toplevel_ast = parse(fullCode, parse_options);
		toplevel_ast.figure_out_scope();

		// 2. Compress
		var compressor = new Compressor(compress_options);
		var compressed_ast = toplevel_ast.transform(compressor);

		// 3. Mangle
		compressed_ast.figure_out_scope();
		compressed_ast.compute_char_frequency();
		// compressed_ast.mangle_names();

		// 4. Generate output
		var uglifiedCode = compressed_ast.print_to_string(output_options);
		var oldSize = getUTF8Size(fullCode);
		var newSize = getUTF8Size(uglifiedCode);
		var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
		console.log("Saved " + saved + " % of old size: " + oldSize + "B with new size: " + newSize + "B for "+data.fileName);
		// var minifiedCode = Minify(uglifiedCode);

		fs.writeFileSync(root_dir + "build/" + data.folder + "/" + data.fileName + ".js", uglifiedCode);
		console.log("Wrote final build to " + root_dir + "build/" + data.folder + "/" + data.fileName + ".js");
	}
}
/*
for (var i = 0; i < uniqueFileNames.length; i++) {
	var fileContents = "";

	var header = fs.readFileSync(root_dir + "build_system/engine_client_head.js", "utf8");
	var footer = fs.readFileSync(root_dir + "build_system/engine_client_foot.js", "utf8");
	for (var e = 0; e < fileNames.length; e++) {
		if (uniqueFileNames[i] === fileNames[e]) {

		}
	}
}
var header = fs.readFileSync(root_dir + "build_system/engine_client_head.js", "utf8");
var footer = fs.readFileSync(root_dir + "build_system/engine_client_foot.js", "utf8");
var engineClient = header + variables.join("\n\r") + functions.join("\n\r") + others.join("\n\r");
for (var i = 0; i < returns.length; i++) {
	engineClient += "window." + names[i] + "={" + returns[i] + "};\n\r";
}
engineClient += footer;

for (var attr in engineOptions) {
	if (engineClient.indexOf(attr) > -1) {
		engineClient = engineClient.replace(new RegExp(attr, "g"), engineOptions[attr]);
	}
}
fs.writeFileSync(root_dir + "build/client/Engine.full.js", engineClient);
console.log("Saved to build/client/Engine.full.js");

with(UglifyJS) {
	options.parse.filename = root_dir + "build/client/Engine.full.js";
	var parse_options = defaults({}, options.parse);
	var compress_options = defaults({}, options.compress);
	var output_options = defaults({}, options.output);

	// parse_options = defaults(parse_options, default_options.parse, true);
	// compress_options = defaults(compress_options, default_options.compress, true);
	// output_options = defaults(output_options, default_options.output, true);

	// 1. Parse
	var fullCode = fs.readFileSync(root_dir + "build/client/Engine.full.js", "utf8");
	var toplevel_ast = parse(fullCode, parse_options);
	toplevel_ast.figure_out_scope();

	// 2. Compress
	var compressor = new Compressor(compress_options);
	var compressed_ast = toplevel_ast.transform(compressor);

	// 3. Mangle
	compressed_ast.figure_out_scope();
	compressed_ast.compute_char_frequency();
	// compressed_ast.mangle_names();

	// 4. Generate output
	var uglifiedCode = compressed_ast.print_to_string(output_options);
	var oldSize = getUTF8Size(fullCode);
	var newSize = getUTF8Size(uglifiedCode);
	var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
	console.log("saved " + saved + " % old size: " + oldSize + "B new size: " + newSize + "B");
	// var minifiedCode = Minify(uglifiedCode);

	fs.writeFile(root_dir + "build/client/Engine.js", uglifiedCode, function(err) {
		if (err) throw err;
		console.log("Saved to build/client/Engine.js");
	});
}

var gameClient = fs.readFileSync(root_dir + "gameClient.js", "utf8");
for (var attr in singleOptions) {
	if (gameClient.indexOf(attr) > -1) {
		gameClient = gameClient.replace(new RegExp(attr, "g"), singleOptions[attr]);
	}
}



with(UglifyJS) {
	options.parse.filename = root_dir + "gameClient.js";
	var parse_options = defaults({}, options.parse);
	var compress_options = defaults({}, options.compress);
	var output_options = defaults({}, options.output);

	// parse_options = defaults(parse_options, default_options.parse, true);
	// compress_options = defaults(compress_options, default_options.compress, true);
	// output_options = defaults(output_options, default_options.output, true);

	// 1. Parse
	var toplevel_ast = parse(gameClient, parse_options);
	toplevel_ast.figure_out_scope();

	// 2. Compress
	var compressor = new Compressor(compress_options);
	var compressed_ast = toplevel_ast.transform(compressor);

	// 3. Mangle
	compressed_ast.figure_out_scope();
	compressed_ast.compute_char_frequency();
	// compressed_ast.mangle_names();

	// 4. Generate output
	var uglifiedCode = compressed_ast.print_to_string(output_options);
	var oldSize = getUTF8Size(fullCode);
	var newSize = getUTF8Size(uglifiedCode);
	var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
	console.log("saved " + saved + " % old size: " + oldSize + "B new size: " + newSize + "B");
	// var minifiedCode = Minify(uglifiedCode);

	fs.writeFile(root_dir + "build/client/Game.js", uglifiedCode, function(err) {
		if (err) throw err;
		console.log("Saved to build/client/Game.js");
	});
}*/

/*
with(UglifyJS) {
	fs.exists("build/", function(bool) {
		if (bool) {
			var parse_options = defaults({}, options.parse);
			var compress_options = defaults({}, options.compress);
			var output_options = defaults({}, options.output);

			// parse_options = defaults(parse_options, default_options.parse, true);
			// compress_options = defaults(compress_options, default_options.compress, true);
			// output_options = defaults(output_options, default_options.output, true);

			// 1. Parse
			var fullCode = fs.readFileSync(process.argv[2], "utf8");
			var toplevel_ast = parse(fullCode, parse_options);
			toplevel_ast.figure_out_scope();

			// 2. Compress
			var compressor = new Compressor(compress_options);
			var compressed_ast = toplevel_ast.transform(compressor);

			// 3. Mangle
			compressed_ast.figure_out_scope();
			compressed_ast.compute_char_frequency();
			compressed_ast.mangle_names();

			// 4. Generate output
			var uglifiedCode = compressed_ast.print_to_string(output_options);
			var oldSize = getUTF8Size(fullCode);
			var newSize = getUTF8Size(uglifiedCode);
			var saved = ((1 - newSize / oldSize) * 100).toFixed(2);
			console.log("saved " + saved + " % old size: " + oldSize + "B new size: " + newSize + "B");
			// var minifiedCode = Minify(uglifiedCode);

			var location, split;
			if (process.argv[3].indexOf("ClientServer") > -1) {
				split = "ClientServer";
				location = "client-server";
			} else if (process.argv[3].indexOf("Server") > -1) {
				split = "Server";
				location = "server";
			} else if (process.argv[3].indexOf("Client") > -1) {
				split = "Client";
				location = "client";
			} else {
				split = "";
				location = "server";
			}
			var name = process.argv[3].split(split).join("");
			fs.writeFile('build/' + location + "/" + name, uglifiedCode, function(err) {
				if (err) throw err;
				console.log('Saved to build/' + process.argv[3]);
			});
		} else {
			console.error("Wrong build location.")
		}
	});
}*/