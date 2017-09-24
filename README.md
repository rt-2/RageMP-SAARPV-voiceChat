# RageMP-SAARPV-voiceChat
A peer-to-peer in-game proximity voice chat for RageMP.

This script use the [https://github.com/peers/peerjs](PeerJS API) which is based on [https://webrtc.org/](WebRTC).

**Installation:**
 - Place the content of `./html/` on your secure http server;
 - Run `npm install peer` in your RageMP server directory. This should add [https://github.com/peers/peerjs-server](PeerJS Server) and its dependendies in your 'node_modules' folder;
 - Include `./voiceChat_client.js` and `./voiceChat_server.js` into your script;
 - Change the default value in the files:
    - N/A
 - Restart your server
 - Enjoy?
