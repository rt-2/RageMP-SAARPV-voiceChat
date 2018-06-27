# RageMP-SAARPV-voiceChat
A peer-to-peer in-game proximity voice chat for [RageMP](https://rage.mp/) developped for [San Andreas Advanced Roleplay V](https://v.sa-arp.net/)

This script use the [PeerJS API](https://github.com/peers/peerjs) which is based on [WebRTC](https://webrtc.org/).

**Installation:**
 - Place the content of `./html/` on your secure http server;
 - Run `npm install peer` in your RageMP server directory. This should add [PeerJS Server](https://github.com/peers/peerjs-server) and its dependendies in your 'node_modules' folder;
 - Include `./voiceChat_client.js` and `./voiceChat_server.js` into your script;
 - Change the default value in the files:
    - Your hostname [here](https://github.com/rt-2/RageMP-SAARPV-voiceChat/blob/master/voiceChat_client.js#L14) and [here](https://github.com/rt-2/RageMP-SAARPV-voiceChat/blob/master/html/iframe.html#L42);
    - Have a `MAX_PLAYERS` constant set on client and server side;
 - Restart your server
 - Enjoy?

This project is not near ready to release its first stable version, but as soon as it was presentable, I though it was best to put the code open source because of 2 reasons: for RageMP in general to improve, and for this plugin to develop faster.
There is a lot of cleaning to do bare with me, I released this so bugs can be fixed, I do not expect you guys to clean my code

I was aiming toward a VoIP version of this (server-side, not peer-to-peer), but if RAGE implements p2p on it's own there is no reason anymore to do so.

Thank you for your contribution:
                Kar.
Thank you for the help:
                Amata, Austin, BlackBlitch, Bouzigoloum, James Cole, Kiper, LukEL, Mos, StreetGT, Tobias.
