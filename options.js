var options = {
	parse: {
		strict: false,
		filename: process.argv[2]
	},
	compress: {
		sequences: false,
		properties: true,
		dead_code: true,
		drop_debugger: false,
		unsafe: true,
		unsafe_comps: true,
		conditionals: true,
		comparisons: true,
		evaluate: true,
		booleans: true,
		loops: true,
		unused: true,
		hoist_funs: false,
		hoist_vars: false,
		if_return: true,
		join_vars: false,
		cascade: true,
		side_effects: true,
		negate_iife: true,
		screw_ie8: true,

		warnings: true,
		global_defs: {

		}
	},
	output: {
		indent_start: 0,
		indent_level: 4,
		quote_keys: false,
		space_colon: true,
		ascii_only: false,
		inline_script: true,
		width: 80,
		max_line_len: 32000,
		beautify: true,
		source_map: null,
		bracketize: true,
		semicolons: false,
		comments: false,
		preserve_line: true,
		screw_ie8: false
	}
};

var constNames = {
	/////////////
	// blocks //
	/////////////

	BLOCK_ENTRIES: 4,
	BLOCK_ID: 0,
	BLOCK_WIDTH: 1,
	BLOCK_HEIGHT: 2,
	BLOCK_DEPTH: 3,
	BLOCK_SIZE: 32,

	/////////////
	// Chunks //
	/////////////

	CHUNK_X: 0,
	CHUNK_Z: 1,
	CHUNK_LAST_UPDATED: 2,
	CHUNK_TIME_INHABITED: 3,
	OPERATION: 0,
	X_COORDINATE: 1,
	Z_COORDINATE: 2,
	BLOCK_ARRAY: 3,
	DATA_ARRAY: 4,
	HEIGHT_ARRAY: 5,
	DRAW_X: 6,
	DRAW_Z: 7,
	BUILD_CHUNK: 0,
	CHUNK_COMPLETE: 1,
	DEBUG: 2,
	CHUNK_DIMENTION: 16,
	CHUNK_HEIGHT: 16,

	///////////
	// List //
	///////////

	UINT4: 2,
	UINT8: 3,
	UINT12: 5,
	UINT16: 7,
	UINT32: 11,
	INT8: 6,
	INT16: 14,
	INT32: 22,
	FLOAT32: 33,
	FLOAT64: 13,

	///////////////
	// commands //
	///////////////

	COMMAND_REMOTE_ID: 0,
	COMMAND_PING: 1,
	COMMAND_TIMESTAMP: 2,
	COMMAND_ACTION: 3,
	COMMAND_VALUE: 4,

	///////////////
	// Controls //
	///////////////

	TIMESTAMP: 0,
	LOCALID: 0,
	REMOTEID: 1,
	MOUSE: 2,
	KEYBOARD: 3,
	GAMEPAD: 4,
	PING: 5,
	ACTIVE: 1,
	INACTIVE: 0,
	MOUSE_LEFT_CLICK: 1,
	MOUSE_MIDDLE_CLICK: 2,
	MOUSE_RIGHT_CLICK: 3,
	MOUSE_MOVE_X: 4,
	MOUSE_MOVE_Y: 5,
	MOUSE_WHEEL_X: 6,
	MOUSE_WHEEL_Y: 7,
	ESC_KEY_CODE:27,

	///////////////////
	// CONSTRUCTION //
	///////////////////

	IDLE_MODE: 0,
	PLACEMENT_MODE: 1,

	//////////////////////////
	// STRUCTURE DEFINITION //
	//////////////////////////

	STRUCTURE_DEFINITION_ENTRIES: 6,
	STRUCTURE_ID: 0,
	STRUCTURE_WIDTH: 1,
	STRUCTURE_HEIGHT: 2,
	STRUCTURE_DEPTH: 3,
	STRUCTURE_COLOR: 4,
	STRUCTURE_HEALTH: 5,

	///////////////
	// STRUCTURE //
	///////////////

	// STRUCTURE_ENTRIES:9,
	STRUCTURE_X: 6,
	STRUCTURE_Y: 7,
	STRUCTURE_Z: 8,

	//////////////
	// PHYSICS //
	//////////////

	PHYSICS_ENTRIES: 4,
	PHYSICS_X: 0,
	PHYSICS_Y: 1,
	PHYSICS_WIDTH: 2,
	PHYSICS_HEIGHT: 3,
	PHYSICS_ANGLE: 3,

	/////////////////////////
	// ENTITY HOST NAMES  //
	/////////////////////////

	BLOCK: 0,
	STRUCTURE: 1,

	/////////////////////////
	// ENTITY CHILD NAMES //
	/////////////////////////

	BLOCK0: 0,
	BLOCK1: 1,
	STRUCTURE0: 256,
	STRUCTURE1: 257,

	//////////////
	// Systems //
	//////////////

	S_SHAPE: 0,
	S_POSITION: 1,
	S_DESCRIPTION: 2,
	S_COLOR: 3,
	S_ID: 4,
	S_DRAW: 5,
	S_SYMBOL: 6,
	// S_VELOCITY: 6,
	// S_STABILITY: 7,
	MUTABLE: 0,
	DATA: 1,
	TYPE: 2,
	SETUP: 3,
	CLONE: 4,
	S_UNDEFINED: 0,
	S_TYPED_ARRAY: 1,
	S_ARRAY: 2,
	S_STRING: 3,
	S_NUMBER: 4,
	S_OBJECT: 5,
	S_FUNCTION: 6,

	///////////////////////
	// STRUCTURE SYSTEM //
	///////////////////////

	STRUCTURE_ENTRIES: 3,
	WIDTH: 0,
	HEIGHT: 1,
	DEPTH: 2,

	//////////////////////
	// POSITION SYSTEM //
	//////////////////////

	POSITION_ENTRIES: 3,
	X: 0,
	Y: 1,
	Z: 2,

	///////////////////
	// COLOR SYSTEM //
	///////////////////

	HEX: 0,
	DEC: 1,

	//////////////////
	// GAME STATES //
	//////////////////

	LOADING: 0,
	GAME: 1,
	MAIN_MENU: 2,
	GAME_INTERFACE:3,
	PAUSE_MENU:4,

	////////////////////////
	// GAME STATE DEPTHS //
	////////////////////////

	SETUP_DEPTH: 0,
	LOADING_DEPTH: 10,
	MAIN_MENU_DEPTH: 1,
	GAME_DEPTH: 2,
	GAME_INTERFACE_DEPTH:3,
	PAUSE_MENU_DEPTH: 4,


	//controller data
	CROSS: 0,
	CIRCLE: 1,
	TRIANGLE: 2,
	SQUARE: 3,
	LEFT_BUTTON: 4,
	RIGHT_BUTTON: 5,
	LEFT_TRIGGER: 6,
	RIGHT_TRIGGER: 7,
	SELECT: 8,
	START: 9,
	LEFT_ANALOGUE_STICK: 10,
	RIGHT_ANALOGUE_STICK: 11,
	PAD_TOP: 12,
	PAD_BOTTOM: 13,
	PAD_LEFT: 14,
	PAD_RIGHT: 15,

	LEFT_HORIZONTAL: 0,
	LEFT_VERTICAL: 1,
	RIGHT_HORIZONTAL: 2,
	RIGHT_VERTICAL: 3,

	// entity data
	// X: 0,
	// Y: 1,
	ANGLE: 2,
	// WIDTH: 3,
	// HEIGHT: 4,
	VELOCITY_X: 5,
	VELOCITY_Y: 6,
	TURNSPEED: 7,
	SPRITE_ID: 8,
	COLOR: 9,
	ALPHA: 10,

	// audio data
	CHUNKID: 0,
	CHUNKSIZE: 1,
	FORMAT: 2,
	SUBCHUNK1ID: 3,
	SUBCHUNK1SIZE: 4,
	AUDIOFORMAT: 5,
	NUMCHANNELS: 6,
	SAMPLERATE: 7,
	BYTERATE: 8,
	BLOCKALIGN: 9,
	BITSPERSAMPLE: 10,
	SUBCHUNK2ID: 11,
	SUBCHUNK2SIZE: 12,

	// actions
	TURNCW: 0,
	MOVEUP: 1,
	TURNCCW: 2,
	MOVEDOWN: 3,
	LIGHTING_X: 4,
	LIGHTING_Y: 5,
	CHANGE_TO_PROJECTION: 6,
	CHANGE_TO_CIRCLE: 7,
	CHANGE_TO_TRIANGLE: 8,
	CHANGE_TO_BEAM: 9,
	MOUSE_X: 0,
	MOUSE_Y: 1,
	MOUSE_LEFT: 2,
	MOUSE_RIGHT: 3,
	SCROLL_Y: 4,
	ESC:5,

	// polygon / light.js data
	R: 7,
	G: 8,
	B: 9,
	RADIUS: 10,
	// circle
	RANGE: 11,
	FALLOFF: 12,
	// viewport
	VIEWPORT_TYPE: 7,
	PROJECTION: 0,
	BEAM: 3,
	// other
	TRUE: 1,
	FALSE: 0
};

var remote = {
	EMIT_EVENT: "event.emit",
	BLOCK_MAKE: "Block.make",
	BLOCK_GET: "Block.get",
	BLOCK_SET: "Block.set",
	COMMAND_EACH: "Command.each",
	COMMAND_PROCESS: "Command.process",
	COMMAND_ON: "Command.on",
	COMMAND_OFF: "Command.off",
	COMMAND_PUSH: "Command.push",
	COMMAND_MAKE: "Command.make",
	CONFIG_INPUT: "Config.input",
	CONFIG_ACTION: "Config.action",
	CONFIG_MATCH_KEY: "Config.matchKey",
	CONFIG_BINDING: "Config.binding",
	CONFIG_UNBIND: "Config.unbind",
	CONFIG_BIND: "Config.bind",
	CONFIG_LENGTH: "Config.length",
	CONTROL_PREVENT_DEFAULT: "Control.preventDefault",
	CONTROL_GAMEPADS: "Control.gamepads",
	CONTROL_ON: "Control.on",
	CONTROL_OFF: "Control.off",
	CONTROL_LISTEN: "Control.listen",
	CONTROL_INIT: "Control.init",
	CONTROL_TRUE_MOUSE_DATA: "Control.mouseMove",
	GUI_TEMPLATE: "GUI.template",
	GUI_REMOVE: "GUI.remove",
	GUI_PUT: "GUI.put",
	GUI_GET: "GUI.get",
	GUI_MAKE: "GUI.make",
	GUI_SET: "GUI.set",
	GUI_DUPLICATE: "GUI.duplicate",
	GUI_ON: "GUI.on",
	GUI_OFF: "GUI.off",
	GUI_EMIT: "GUI.emit",
	DRAW_POLY: "Draw.poly",
	DRAW_MOVE: "Draw.move",
	DRAW_SETUP: "Draw.setup",
	DRAW_STAGE: "Draw.stage",
	DRAW_RENDERER: "Draw.renderer",
	DRAW_ON: "Draw.on",
	DRAW_OFF: "Draw.off",
	DRAW_RENDER: "Draw.render",
	HELP_ITEM_REMOVE: "Help.itemRemove",
	HELP_INDEX_REMOVE: "Help.indexRemove",
	HELP_HAS: "Help.has",
	HELP_SPLICE: "Help.splice",
	LIGHT_SOURCE: "Light.source",
	LIGHT_VIEW: "Light.view",
	LIGHT_WALL: "Light.wall",
	LIGHT_PARSE: "Light.parse",
	LIGHT_ADD_LIGHT: "Light.addLight",
	LIGHT_ADD_VIEW: "Light.addViewPort",
	LIGHT_ADD_WALL: "Light.addWall",
	LIST_CLEAN: "List.clean",
	LIST_SIZE: "List.size",
	LIST_GET: "List.get",
	LIST_PUT: "List.put",
	LIST_LINKED: "List.linked",
	LOOP_GO: "Loop.go",
	LOOP_EVERY: "Loop.every",
	LOOP_REMOVE: "Loop.remove",
	LOOP_QUEUE: "Loop.queue",
	CHUNK_MAKE: "Chunk.make",
	CHUNK_DRAW: "Chunk.draw",
	CHUNK_MOVE: "Chunk.move",
	CHUNK_HAS_SPACE: "Chunk.check",
	CHUNK_DIVIDE_SCREEN: "Chunk.divideScreen",
	CHUNK_ADD_STRUCTURE: "Chunk.addStruct",
	CHUNK_MAP_MOUSE: "Chunk.mapMouse",
	CHUNK_PLACE: "Chunk.place",
	PHYSICS_TEST: "Physics.test",
	PHYSICS_GET_VERTICES: "Physics.getVertices",
	PLAYER_LENGTH: "Player.length",
	PLAYER_REGISTER: "Player.register",
	PLAYER_FIND: "Player.find",
	PLAYER_INIT: "Player.init",
	PLAYER_IS_LOCAL: "Player.isLocal",
	PLAYER_TOGGLE_PLAYER: "Player.togglePlayer",
	RIFFWAVE_LENGTH: "RiffWave.length",
	RIFFWAVE_GET: "RiffWave.get",
	RIFFWAVE_MAKE: "RiffWave.make",
	STATE_DEACTIVATE: "State.deactivate",
	STATE_TOGGLE: "State.toggle",
	STATE_PREVIOUS: "State.previous",
	STATE_ACTIVATE: "State.activate",
	STATE_NEW: "State.newState",
	STATE_CHECK: "State.check",
	STRUCT_MAKE: "Struct.make",
	STRUCT_GET: "Struct.get",
	STRUCTURES_DEFINE: "Structures.define",
	STRUCTURES_PLACE: "Structures.set",
	STRUCTURES_GET: "Structures.get",
	STRUCTURES_EVENT: "Structures.event",
	STRUCTURES_EACH: "Structures.each",
	SYSTEM_DEFINE_SYSTEM: "System.system",
	SYSTEM_DEFINE_PARENT: "System.host",
	SYSTEM_DEFINE_CHILD: "System.child",
	SYSTEM_CLONE_ENTITY: "System.clone",
	SYSTEM_READY: "System.ready",
	SYSTEM_ON: "System.on",
	SYSTEM_OFF: "System.off",
	TIME_NOW: "Time.now",
	TIME_MICRO: "Time.micro",
};

var local = {
	Block: {
		BLOCK_MAKE: "makeBlock",
		BLOCK_GET: "getBlock",
		BLOCK_SET: "setBlock"
	},
	Command: {
		COMMAND_EACH: "eachCommand",
		COMMAND_PROCESS: "processCommand",
		COMMAND_ON: "event.on",
		COMMAND_OFF: "event.off",
		COMMAND_PUSH: "pushCommand",
		COMMAND_MAKE: "newCommand"
	},
	Control: {
		CONTROL_PREVENT_DEFAULT: "preventDefault",
		CONTROL_GAMEPADS: "gamepads",
		CONTROL_ON: "event.on",
		CONTROL_OFF: "event.off",
		CONTROL_LISTEN: "listen",
		CONTROL_INIT: "initControl",
		CONTROL_TRUE_MOUSE_DATA: "realMouseMoveData"
	},
	Config: {
		CONFIG_INPUT: "input",
		CONFIG_ACTION: "action",
		CONFIG_MATCH_KEY: "matchKey",
		CONFIG_BINDING: "binding",
		CONFIG_UNBIND: "unbind",
		CONFIG_BIND: "bind",
		CONFIG_LENGTH: "actions",
	},
	GUI: {
		GUI_TEMPLATE: "template",
		GUI_REMOVE: "removeGUI",
		GUI_PUT: "putGUI",
		GUI_GET: "getGUI",
		GUI_MAKE: "makeGUI",
		GUI_SET: "setGUI",
		GUI_DUPLICATE: "duplicate",
		GUI_ON: "event.on",
		GUI_OFF: "event.off",
		GUI_EMIT: "event.emit"
	},
	Draw: {
		DRAW_POLY: "poly",
		DRAW_MOVE: "reposition",
		DRAW_SETUP: "setupDraw",
		DRAW_STAGE: "stage",
		DRAW_RENDER: "drawStage",
		DRAW_RENDERER: "renderer",
		DRAW_ON: "event.on",
		DRAW_OFF: "event.off"
	},
	Game: {
		MAIN_MENU_STATE:"mainMenuState",
		LOADING_STATE:"loadScreenState",
		GAME_STATE:"gameState",
		PAUSE_STATE:"pauseState",
		GAME_INTERFACE_STATE:"gameInterfaceState",
		UI_BUTTON:"UIButton",
		UI_LOADING_PAGE:"UILoadingPage",
		UI_PAUSE_MENU:"UIPauseMenu",
		UI_GAME_INTERFACE:"UIGameInterface",
		UI_GAME_MAIN_MENU:"UIGameMainMenu"
	},
	Help: {
		HELP_ITEM_REMOVE: "itemRemove",
		HELP_INDEX_REMOVE: "indexRemove",
		HELP_HAS: "has",
		HELP_SPLICE: "splice"
	},
	Light: {
		LIGHT_SOURCE: "newLight",
		LIGHT_VIEW: "newViewPort",
		LIGHT_WALL: "newWall",
		LIGHT_PARSE: "parseLight",
		LIGHT_ADD_LIGHT: "addLight",
		LIGHT_ADD_VIEW: "addViewPort",
		LIGHT_ADD_WALL: "addWall"
	},
	List: {
		LIST_CLEAN: "cleanList",
		LIST_SIZE: "size",
		LIST_GET: "getList",
		LIST_PUT: "putList",
		LIST_LINKED: "linked"
	},
	Loop: {
		LOOP_GO: "go",
		LOOP_EVERY: "event.on",
		LOOP_REMOVE: "event.off",
		LOOP_QUEUE: "queue"
	},
	Chunk: {
		CHUNK_MAKE: "makeChunk",
		CHUNK_DRAW: "drawChunk",
		CHUNK_MOVE: "changeOffset",
		CHUNK_HAS_SPACE: "checkForSpace",
		CHUNK_ADD_STRUCTURE: "addStructure",
		CHUNK_DIVIDE_SCREEN: "divideScreen",
		CHUNK_MAP_MOUSE: "mapMouse",
		CHUNK_PLACE: "initPlacementMode"
	},
	Physics: {
		PHYSICS_TEST: "test",
		PHYSICS_GET_VERTICES: "getVertices"
	},
	Player: {
		PLAYER_LENGTH: "length",
		PLAYER_REGISTER: "register",
		PLAYER_FIND: "find",
		PLAYER_INIT: "initPlayer",
		PLAYER_IS_LOCAL: "isLocal",
		PLAYER_TOGGLE_PLAYER: "togglePlayer"
	},
	RiffWave: {
		RIFFWAVE_LENGTH: "length",
		RIFFWAVE_GET: "get",
		RIFFWAVE_MAKE: "make"
	},
	State: {
		STATE_DEACTIVATE: "deactivateState",
		STATE_TOGGLE: "toggleState",
		STATE_PREVIOUS: "previousState",
		STATE_ACTIVATE: "activateState",
		STATE_CHECK: "checkState",
		STATE_NEW: "newGameState"
	},
	Struct: {
		STRUCT_MAKE: "makeStruct",
		STRUCT_GET: "getStruct"
	},
	Structures: {
		STRUCTURES_DEFINE: "defineStructure",
		STRUCTURES_PLACE: "placeStructure",
		STRUCTURES_GET: "getStructure",
		STRUCTURES_EVENT: "eventListener",
		STRUCTURES_EACH: "eachStructure"
	},
	System: {
		SYSTEM_DEFINE_SYSTEM: "defineSystem",
		SYSTEM_DEFINE_PARENT: "hostEntity",
		SYSTEM_DEFINE_CHILD: "childEntity",
		SYSTEM_CLONE_ENTITY: "cloneChild",
		SYSTEM_READY: "systemReady",
		SYSTEM_ON: "event.on",
		SYSTEM_OFF: "event.off"
	},
	Time: {
		TIME_NOW: "nowTime",
		TIME_MICRO: "micro"
	}
};

for (var attr in local) {
	for (var property in local[attr]) {
		options.compress.global_defs[property] = local[attr][property];
	}
}

for (var attr in remote) {
	options.compress.global_defs[attr] = remote[attr];
}

for (var attr in constNames) {
	options.compress.global_defs[attr] = constNames[attr];
}

module.exports = {
	options: options,
	remote: remote,
	local: local,
	constNames: constNames
};