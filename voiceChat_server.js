
//
//  Server-Side 'VoiceChat' script
//

// Dependencies
var fs = require('fs');
var PeerServer = require('peer').PeerServer;


//
//  Var(s)  BEGIN
//

// Execution Vars
let voiceChat_PlayerConnected = [MAX_PLAYERS];
let voiceChat_PlayerReadyForOtherPlayer = new Array(MAX_PLAYERS);

//
//  Var(s)  END
//


console.log('Initializing voiceChat script;');

for (let i = 0; i < voiceChat_PlayerReadyForOtherPlayer.length; i++) {

    voiceChat_PlayerReadyForOtherPlayer[i] = new Array(MAX_PLAYERS);

}

// Voice chat ID assignation server
var server = PeerServer({
    port: 9000,
    ssl: {
        key: fs.readFileSync('C:/Apache2/conf/v.sa-arp.net.key'),
        cert: fs.readFileSync('C:/Apache2/conf/v.sa-arp.net.crt')
    },
    path: '/saarpv'
});

console.log('Started PeerJS server at 9000 port.');


console.log('Completed voiceChat initializing;');



//
//  Event(s)  BEGIN
//

mp.events.add('playerJoin', (player) => {


    for (let i = 0; i < MAX_PLAYERS; i++) {

        voiceChat_PlayerReadyForOtherPlayer[player.id][i] = false;
        voiceChat_PlayerReadyForOtherPlayer[i][player.id] = false;

    }

    voiceChat_PlayerConnected[player.id] = true;

});

mp.events.add('playerQuit', (player, exitType, reason) => {


    voiceChat_PlayerConnected[player.id] = false;

    for (let i = 0; i < MAX_PLAYERS; i++) {

        if (voiceChat_PlayerReadyForOtherPlayer[i][player.id]) {
            let other_player = mp.players.at(i);
            other_player.call('voiceChat_otherPlayerDisconnects', player.id);
            voiceChat_PlayerReadyForOtherPlayer[i][player.id] = false;
        }

    }

});

//
//  Event(s)  END
//


//
//  Client call(s)  BEGIN
//

mp.events.add('voiceChat_PlayerStreamPlayerIn', (player, other_player_id) => {

    let other_player = mp.players.at(other_player_id);

    voiceChat_PlayerReadyForOtherPlayer[player.id][other_player.id] = true;

    if (voiceChat_PlayerReadyForOtherPlayer[other_player.id][player.id] == true)
    {
        player.call('voiceChat_playerReadyToInitOtherPlayer', other_player.id);

        other_player.call('voiceChat_playerReadyToInitOtherPlayer', player.id);

    }
});

mp.events.add('voiceChat_PlayerStreamPlayerOut', (player, other_player) => {


    voiceChat_PlayerReadyForOtherPlayer[player.id][other_player] = false;
    voiceChat_PlayerReadyForOtherPlayer[other_player][player.id] = false;

});

//
//  Client call(s)  END
//


