if (this.process && this.process.on) {
	process.on("uncaughtException", function(err) {
		console.error(err.message, err.stack);
	});
}
var gui = require('nw.gui');
gui.App.setCrashDumpDir(require('path').dirname(global.require.main.filename) + "/crashes/");
(function(navigator, window, document) {
	var arrayProto = Array.prototype;
	/**
	 * Converts functions into a module with events.
	 *
	 * @method Module
	 *
	 * @param  {Function} fn Uninitialized function to convert into a module.
	 */

	function Module(fn) {
		return fn({
			on: function(name, callback) {
				document.addEventListener(name, function(event) {
					if (event.detail === undefined) {
						callback();
					} else if (event.detail[0] !== undefined) {
						callback.apply(window, event.detail); // should be accessible as arguments, not as an array
					} else {
						callback.call(window, event.detail); // only one argument
					}
				}, false);
			},
			off: function(name, callback) {
				document.removeEventListener(name, callback);
			},
			emit: function(name) {
				var args = arrayProto.splice.call(arguments, 1, arguments.length - 1); // all arguments but the name
				var myEvent = new CustomEvent(name, {
					detail: args
				});
				document.dispatchEvent(myEvent);
			}
		});
	}
	window.Module = Module;
	return Module(function(event) {
		var absurd = Absurd();