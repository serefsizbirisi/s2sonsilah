const net = require('net');
const AuthServer = require('./authserver');
const LobbyServer = require('./lobbyserver');

class ServerManager {
    constructor() {
        this.authServer = new AuthServer();
        this.lobbyServer = new LobbyServer();
    }

    startAuthServer(port) {
        const server = net.createServer((socket) => {
            console.log('New client connected to Auth Server');
            this.authServer.handleConnection(socket);
        });

        server.listen(port, () => {
            console.log(`Auth Server started on port ${port}`);
        });
    }

    startLobbyServer(port) {
        const server = net.createServer((socket) => {
            console.log('New client connected to Lobby Server');
            this.lobbyServer.handleConnection(socket);
        });

        server.listen(port, () => {
            console.log(`Lobby Server started on port ${port}`);
        });
    }
}

module.exports = ServerManager;