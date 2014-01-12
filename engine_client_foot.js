		GUI_ON("ready", function() {
			Game.setup();
			register(0, 0, -1);
			initPlayer();
			Game.start();
		});
	});
}(navigator, window, document));