//
// Client-side version of the voiceChat feature
//

//
//  Variable(s)  BEGIN
//

// Constant(s)
const VOICECHAT_QUERYURL = "https://example.org/voicechat_dir/";
const MAX_HEARING_DIST = 35.0;
const PROXIMITY_TIMER_INTERVAL = 1000;
const VOLUME_TIMER_INTERVAL = 120;
const MAX_PLAYERS = 200;

// Execution var(s)
let _isVoiceToggled = true;
let _isStreamingOtherPlayer = new Array(MAX_PLAYERS);
let _isOtherPlayerReady = new Array(MAX_PLAYERS);
let _isInProximityOfOtherPlayer = new Array(MAX_PLAYERS);
let _lastVolumeSetForPlayer = new Array(MAX_PLAYERS);

// Entitie(s)

// Browser(s)
let voiceChat_browser = null;


//
//  Variable(s)  END
//


//
//  Function(s)  BEGIN
//

exports =
{
	toggleVoiceChat: function (value) {
		_isVoiceToggled = value;
	}
};

//
//  Function(s)  BEGIN
//

//
//  Timer(s)  BEGIN
//

function _volumeTimer(other_player_id) {

	let other_player = mp.players.atRemoteId(other_player_id);

	if (other_player && _isInProximityOfOtherPlayer[other_player.remoteId]) {

		// Init 
		let player = mp.players.local;

		let distance = mp.game.gameplay.getDistanceBetweenCoords(other_player.position.x, other_player.position.y, other_player.position.z, player.position.x, player.position.y, player.position.z, true);

		if (_isVoiceToggled && distance < MAX_HEARING_DIST) {

			let volume = 1.0 / MAX_HEARING_DIST * distance;
			volume = volume * -1 + 1.0;

			// Only set if data is new
			if (volume != _lastVolumeSetForPlayer[other_player.remoteId]) {

				_lastVolumeSetForPlayer[other_player.remoteId] = volume;
				voiceChat_browser.execute('SetOtherPlayerLevel(' + other_player.remoteId + ', "' + volume + '");');
			}

		} else {
			if (_lastVolumeSetForPlayer[other_player.remoteId] != 0.0) {
				voiceChat_browser.execute('SetOtherPlayerLevel(' + other_player.remoteId + ', "0.0");');
			}
		}

		setTimeout(function () { _volumeTimer(other_player_id); }, VOLUME_TIMER_INTERVAL);

	}
}

function _proximityTimer(other_player_id) {
	
	let other_player = mp.players.atRemoteId(other_player_id);

	if(other_player && _isStreamingOtherPlayer[other_player.remoteId]) {

		// Init 
		let player = mp.players.local;

		let distance = mp.game.gameplay.getDistanceBetweenCoords(other_player.position.x, other_player.position.y, other_player.position.z, player.position.x, player.position.y, player.position.z, true);

		if (distance < 100.0) {

			// MOVED
			if (!_isInProximityOfOtherPlayer[other_player.remoteId] &&_isOtherPlayerReady[other_player.remoteId]) {

				_isInProximityOfOtherPlayer[other_player.remoteId] = true;

				voiceChat_browser.execute('InitCall(' + other_player.remoteId + ');');

				_volumeTimer(other_player.remoteId);

			}

		} else {
			if (_isInProximityOfOtherPlayer[other_player.remoteId]) {
				// Was in proximity before

				_isInProximityOfOtherPlayer[other_player.remoteId] = false;
			}
		}

		setTimeout(function () { _proximityTimer(other_player_id); }, PROXIMITY_TIMER_INTERVAL);
	}

}

//
//  Timer(s)  END
//

//
//  Events(s)  BEGIN
//

// Client Init

mp.events.add('guiReady', () => {

	// Init 
	let player = mp.players.local;

	// Action(s)
	voiceChat_browser = mp.browsers.new(VOICECHAT_QUERYURL + '?player_id=' + player.remoteId + '&MAX_PLAYERS=' + MAX_PLAYERS + '&time=' + Date.now());
	if(voiceChat_browser) {
		voiceChat_browser.active = true;
	} else {
		mp.gui.chat.push('[VOICECHAT]: Browser creation failed.');
	}

});


// Other player streams in
mp.events.add('entityStreamIn', (entity) => {
	if (entity.type == "player" && voiceChat_browser != null) {
		// Init
		let player = mp.players.local;
		let other_player = entity;

		_isOtherPlayerReady[other_player.remoteId] = false;
		_isStreamingOtherPlayer[other_player.remoteId] = true;

		voiceChat_browser.execute('AddOtherPlayerInRange(' + other_player.remoteId + ', "' + other_player.name + '");');

		_proximityTimer(other_player.remoteId);
	}
});


mp.events.add('voiceChat_playerToggle', (value) => {
	toggleVoiceChat(value);
});


mp.events.add('voiceChat_iframeReadyToInitOtherPlayer', (other_player_id) => {
	mp.events.callRemote("voiceChat_PlayerStreamPlayerIn", other_player_id);
});


mp.events.add('voiceChat_iframeReadyToFixMouse', () => {
	//mp.gui.chat.push('voiceChat_iframeReadyToFixMouse');
	mp.gui.cursor.visible = false;
});


mp.events.add('voiceChat_playerReadyToInitOtherPlayer', (other_player_id) => {
	_isOtherPlayerReady[other_player_id] = true;
});


mp.events.add('voiceChat_otherPlayerDisconnects', (other_player_id) => {
	_isStreamingOtherPlayer[other_player_id] = false;
	voiceChat_browser.execute('RemoveOtherPlayerInRange(' + other_player_id + ');');
});

// Other player streams out
mp.events.add('entityStreamOut', (entity) => {
	if (entity.type == "player" && voiceChat_browser != null) {
		// Init
		let other_player = entity;

		_isStreamingOtherPlayer[other_player.remoteId] = false;

		voiceChat_browser.execute('RemoveOtherPlayerInRange(' + other_player.remoteId + ');');

		mp.events.callRemote("voiceChat_PlayerStreamPlayerOut", other_player.remoteId);
	}
});

// Receive and echo any browser errors
mp.events.add('voiceChat_browserError', (error_text) => {
	mp.gui.chat.push('!{F00}Browser error: !{FFF}' + error_text);
});

//
//  Events(s)  END
//