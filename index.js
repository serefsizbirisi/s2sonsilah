const ServerManager = require('./servermanager');

const manager = new ServerManager();

manager.startAuthServer(12000);

manager.startLobbyServer(13000);

console.log('auth ve lobby server start.');