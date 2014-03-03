		DRAW_ON("RenderReady", function() {
			Game.setup();
			PLAYER_REGISTER(0, 0, -1);
			PLAYER_INIT();
			Game.start();
		});
	});
}(navigator, window, document));