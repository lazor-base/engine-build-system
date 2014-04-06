		DRAW_ON("RenderReady", function() {
			SYSTEM_ON("systemReady", function() {
				Game.states();
				Game.setup();
				PLAYER_INIT(function() {
					Game.start();
				});
			});
			Game.systems();
		});
	});
}(navigator, window, document));