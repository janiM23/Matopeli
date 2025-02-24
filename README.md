# Android-Worm-game
React Native + typescript worm game, that takes the high scores through a JavaScript backend in vercel cloud into a firebase using HTTP Post and Get. The game uses swipe controls and is downloadable on any android with these instructions:
- make an expo account
- Navigate in your terminal to the game folder and run these commands:
- npm install -g eas-cli
- eas login (login using your expo account credentials)
- eas build:configure (select android)
- eas build --platform android --profile preview
- after these commands you will get a URL-link. type this link into a browser on your android device to install the game.
