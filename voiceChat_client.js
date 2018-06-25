//
// Client-side version of the voiceChat feature
//



//
//  Variable(s)  BEGIN
//



// Constant(s)
const VOICECHAT_MAX_HEAR_DIST = 35.0;
const VOICECHAT_PROX_TIMER_INTERVAL = 1000;
const VOICECHAT_VOL_TIMER_INTERVAL = 120;

// Execution var(s)
let MAX_PLAYERS = 30;
let player_isVoicable = new Array(MAX_PLAYERS);
let player_isStreamingOtherPlayer = new Array(MAX_PLAYERS);
let player_isOtherPlayerReady = new Array(MAX_PLAYERS);
let player_isCloseToOtherPlayer = new Array(MAX_PLAYERS);
let player_lastVolumeSetForPlayer = new Array(MAX_PLAYERS);

// Entitie(s)

// Browser(s)
let voiceChat_browser = null;


//
//  Variable(s)  END
//


//
//  Function(s)  BEGIN
//

function voiceChat_PosDistanceFromPos(position1, position2) {

    return Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2) + Math.pow(position2.z - position1.z, 2));
}

//
//  Function(s)  BEGIN
//


//
//  Timer(s)  BEGIN
//

function voiceChat_volumeTimer(other_player) {
        
    if (
        other_player &&
        typeof other_player.type !== "undefined" &&
        other_player.type == 'player' &&
        player_isCloseToOtherPlayer[other_player.id]
    ) {

        // Init 
        let player = mp.players.local;

        let distance = voiceChat_PosDistanceFromPos(other_player.position, player.position);


        if (distance < VOICECHAT_MAX_HEAR_DIST) {

        let volume = 1.0 / VOICECHAT_MAX_HEAR_DIST * distance;
        volume = volume * -1 + 1.0;

        // Only set if data is new
        if (volume != player_lastVolumeSetForPlayer[other_player.id]) {

            player_lastVolumeSetForPlayer[other_player.id] = volume;
            voiceChat_browser.execute('SetOtherPlayerLevel(' + other_player.id + ', "' + volume + '");');
        }



        }
        else {
                if (player_lastVolumeSetForPlayer[other_player.id] != 0.0) {
                    voiceChat_browser.execute('SetOtherPlayerLevel(' + other_player.id + ', "0.0");');
                }
        }

        setTimeout(function () { voiceChat_volumeTimer(other_player); }, VOICECHAT_VOL_TIMER_INTERVAL);

    }

}

function voiceChat_proximityTimer(other_player) {

    if (
        other_player &&
        typeof other_player.type !== "undefined" &&
        other_player.type == "player" &&
        player_isStreamingOtherPlayer[other_player.id]
    ) {

        // Init 
        let player = mp.players.local;

        let distance = voiceChat_PosDistanceFromPos(other_player.position, player.position);

        if (distance < 100.0) {

            // MOVED
            if (
                !player_isCloseToOtherPlayer[other_player.id] &&
                player_isOtherPlayerReady[other_player.id]
            ) {

                // Actions
                player_isCloseToOtherPlayer[other_player.id] = true;

                voiceChat_browser.execute('InitCall(' + other_player.id + ');');

                voiceChat_volumeTimer(other_player);

            }

        }
        else {
            if (player_isCloseToOtherPlayer[other_player.id]) {
                // Actions
                player_isCloseToOtherPlayer[other_player.id] = false;
            }
        }

        setTimeout(function () { voiceChat_proximityTimer(other_player); }, VOICECHAT_PROX_TIMER_INTERVAL);
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

    // Var(s) 
    for (let i = 0; i < MAX_PLAYERS; i++) {

        player_isOtherPlayerReady[i] = false;
        player_isStreamingOtherPlayer[i] = false;
        player_isCloseToOtherPlayer[i] = false;
    }

    // Action(s)
    voiceChat_browser = mp.browsers.new('https://example.org/voiceChat/html/iframes.html?player_id=' + player.id + '&MAX_PLAYERS=' + MAX_PLAYERS + '&ran=' + Date.now());
    voiceChat_browser.active = true;

});

// Other player streams in
mp.events.add('entityStreamIn', (entity) => {

        // Init 
        let player = mp.players.local;

        if (entity.type == "player") {

            // Init
            let other_player = entity;

            // Actions
            player_isOtherPlayerReady[other_player.id] = false;
            player_isStreamingOtherPlayer[other_player.id] = true;

            voiceChat_browser.execute('AddOtherPlayerInRange(' + other_player.id + ', "' + other_player.name + '");');

            voiceChat_proximityTimer(other_player);

        }
});

//
mp.events.add('voiceChat_iframeReadyToInitOtherPlayer', (other_player_id) => {

	player_isOtherPlayerReady[other_player_id] = true;
    // Actions
    mp.events.callRemote("voiceChat_PlayerStreamPlayerIn", other_player_id);

});

//
mp.events.add('voiceChat_playerReadyToInitOtherPlayer', (other_player_id) => {


    // Actions
    player_isOtherPlayerReady[other_player_id] = true;

});
mp.events.add('voiceChat_otherPlayerDisconnects', (other_player_id) => {


    // Actions
    player_isStreamingOtherPlayer[other_player_id] = false;

    voiceChat_browser.execute('RemoveOtherPlayerInRange(' + other_player_id + ');');

});

// Other player streams out
mp.events.add('entityStreamOut', (entity) => {

    if (entity.type == "player") {

        // Init
        let other_player = entity;

        // Actions
        player_isStreamingOtherPlayer[other_player.id] = false;

        voiceChat_browser.execute('RemoveOtherPlayerInRange(' + other_player.id + ');');

        mp.events.callRemote("voiceChat_PlayerStreamPlayerOut", other_player);

    }
});

// Receive and echo any browser errors
mp.events.add('voiceChat_browserError', (error_text) => {

    mp.gui.chat.push('!{F00}Browser error: !{FFF}' + error_text);

});

//
//  Events(s)  END
//

