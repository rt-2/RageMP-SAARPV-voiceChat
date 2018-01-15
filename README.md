# RageMP-SAARPV-voiceChat
A peer-to-peer in-game proximity voice chat for [RageMP](https://rage.mp/) developped for [San Andreas Advanced Roleplay V](https://v.sa-arp.net/)

This script use the [PeerJS API](https://github.com/peers/peerjs) which is based on [WebRTC](https://webrtc.org/).

**Installation:** 
 - Place the content of `./html/` on your secure http server;
 - Run `npm install peer` in your RageMP server directory. This should add [PeerJS Server](https://github.com/peers/peerjs-server) and its dependendies in your 'node_modules' folder;
 - Include `let voiceChat = require './voiceChat_client.js';` and `let voiceChat = require './voiceChat_server.js';` at the top of your scripts;
 - Change the default value in the files:
    - Your hostname [here](https://github.com/rt-2/RageMP-SAARPV-voiceChat/blob/master/html/iframe.html#L42) and [here](https://github.com/rt-2/RageMP-SAARPV-voiceChat/blob/master/voiceChat_client.js#L182);
    - Have a `MAX_PLAYERS` constant set on client and server side;
 - Restart your server
 - Enjoy?

**How to use:** 

The voice chat is always on by default, to disable it:
 - Client-side: ``voiceChat.Toggle(false);``;
 - Server-side: ``voiceChat.Toggle(player, false);``;

This project is not near ready to release its first stable version, but as soon as it was presentable, I though it was best to put the code open source because of 2 reasons: for RageMP in general to improve, and for this plugin to develop faster.
There is a lot of cleaning to do bare with me, I released this so bugs can be fixed, I do not expect you guys to clean my code

Also I am aiming toward a VoIP version of this (server-side, not peer-to-peer). I continue the project when possible.

Thank you for the help: Amata, Austin, BlackBlitch, Bouzigoloum, James Cole, Kiper, LukEL, Mos, StreetGT, Tobias.

**EDIT: A server-side version of this is coming up for SA-ARP, not sure if will be open source yet.**

**IMPORTANT: This plugin has NOT BEEN UPDATED since 'the bridge' because we are working on a server-side version. If you want to use the currently updated client-side one, contact me at rt-2( @ t )rt-2.net or on Discord (rt-2#6159).**
