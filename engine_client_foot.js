		DRAW_ON("RenderReady", function() {
			SYSTEM_ON("systemReady", function() {
				Game.states();
				Game.setup();
				PLAYER_REGISTER(0, 0, -1);
				PLAYER_INIT();
				Game.start();
			});
			Game.systems();
		});
	});
}(navigator, window, document));