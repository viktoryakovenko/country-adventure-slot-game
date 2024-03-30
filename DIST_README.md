### Pre-setup for local run

- Check that node.js [v18.18.*] is installed on local pc;
- Extract client sources from zip to `dist` folder; 
- `cd dist`;
- `npm install http-server`;
- `http-server -p 8080`;
- launch in browser: http://localhost:8080/?channel=desktop to open desktop game;
- launch in browser: http://localhost:8080/?channel=mobile to open mobile game; 
- launch in browser: http://localhost:8080/dev.html?channel=desktop to open desktop game with ability to force hooks in the game; 
- launch in browser: http://localhost:8080/dev.html?channel=mobile to open mobile game with ability to force hooks in the game.
