const net = require('net');
const uuid = require('uuid');
const EventEmitter = require('events');
const readline = require('readline');
const winston = require('winston');

// Initialize logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'game-server.log' })
    ]
});

class Packet {
    constructor(data) {
        this.data = data;
        this.opCode = this.data.readInt32LE(12);
    }

    readString(offset, maxLength) {
        let result = '';
        for (let i = 0; i < maxLength; i++) {
            const char = this.data.readUInt8(offset + i);
            if (char === 0) break;
            result += String.fromCharCode(char);
        }
        return result;
    }
}

class GameServer extends EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.clients = new Map();
        this.database = new GameDatabase();
        this.packetHandlers = new Map();
        this.consoleCommands = new Map();
        this.initializePacketHandlers();
        this.initializeConsoleCommands();
    }

    async start() {
        this.server = net.createServer((socket) => this.handleNewConnection(socket));
        await new Promise((resolve) => {
            this.server.listen(this.port, () => {
                logger.info(`Game server started on port ${this.port}`);
                resolve();
            });
        });
        this.startConsoleInput();
    }

    initializePacketHandlers() {
        this.packetHandlers.set(1114385, this.handleLogin.bind(this));
        this.packetHandlers.set(2228529, this.handleServerSelect.bind(this));
        this.packetHandlers.set(2228737, this.handleCreateRoom.bind(this));
        this.packetHandlers.set(7667969, this.handleAntiCheat.bind(this));
    }

    initializeConsoleCommands() {
        this.consoleCommands.set('userlist', this.userListCommand.bind(this));
    }

    startConsoleInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', (input) => {
            this.handleConsoleInput(input);
        });
    }

    handleConsoleInput(input) {
        const [command, ...args] = input.split(' ');
        const handler = this.consoleCommands.get(command);
        if (handler) {
            handler(args);
        } else {
            logger.info(`Unknown command: ${command}`);
        }
    }

    userListCommand() {
        this.getUserList();
    }

    getUserList() {
        logger.info("Connected users:");
        this.clients.forEach(client => {
            if (client.user) {
                logger.info(`- ${client.user.username} (ID: ${client.id})`);
            }
        });
    }

    isValidClient(client) {
        return client && client.socket && !client.socket.destroyed && client.send && typeof client.send === 'function';
    }

    removeInvalidClient(clientId) {
        this.clients.delete(clientId);
        logger.info(`Removed invalid client: ${clientId}`);
    }

    handleNewConnection(socket) {
        const clientId = uuid.v4();
        const client = new GameClient(clientId, socket, this);
        this.clients.set(clientId, client);

        logger.info(`New client connected: ${clientId}`);

        socket.on('data', (data) => this.handleIncomingData(client, data));
        socket.on('end', () => this.handleDisconnect(client));
        socket.on('error', (err) => this.handleClientError(client, err));
    }

    handleIncomingData(client, data) {
        const packet = new Packet(data);
        const handler = this.packetHandlers.get(packet.opCode);
        if (handler) {
            handler(client, packet);
        } else {
            logger.info(`Unhandled packet: ${packet.opCode}`);
        }
    }

    handleDisconnect(client) {
        logger.info(`Client disconnected: ${client.id}`);
        this.clients.delete(client.id);
    }

    handleClientError(client, error) {
        console.error(`Error with client ${client.id}:`, error);
    }

    async handleLogin(client, packet) {
        const username = packet.readString(16, 33);
        const password = packet.readString(49, 33);

        logger.info(`Login attempt: username=${username}, password=${password}`);

        try {
            const user = await this.database.authenticateUser(username, password);
            if (user) {
                client.setUser(user);
                await this.sendLoginSuccess(client);
            } else {
                await this.sendLoginFailure(client);
            }
        } catch (err) {
            console.error('Login error:', err);
            await this.sendLoginFailure(client);
        }
    }

    async handleServerSelect(client, packet) {
        logger.info(`Server Select CQ`);
        logger.info(`Received Server Info Click packet. Opcode: ${packet.opCode}, Length: ${packet.data.length}`);
    }

    handleAntiCheat(client, packet) {
        // 
    }
    

    handleCreateRoom(client, packet) {
        logger.info(`Username: ${client.user.username}, Create Room Name: ${packet.readString(34, 40)}`);
    }


    async sendLoginSuccess(client) {
        await this.sendLoginAck(client);
        await this.sendUserInfo(client);
        await this.sendServerList(client);
        await this.sendServerInfo(client);
        await this.sendLockEnd(client);
    }

    async sendLoginAck(client) {
        const response = Buffer.alloc(33);
        response.writeInt32LE(1399145256, 0);
        response.writeInt16LE(client.sequenceNumber++, 4);
        response.writeInt16LE(33, 6);
        response.writeInt32LE(0, 8);
        response.writeInt32LE(1114386, 12);
        response.writeInt16LE(0, 16);
        response.writeInt32LE(0, 18);
        await client.send(response);
    }

    async sendUserInfo(client) {
        const packet = Buffer.alloc(104);
        packet.writeInt32LE(1399145256, 0);
        packet.writeInt16LE(client.sequenceNumber++, 4);
        packet.writeInt16LE(104, 6);
        packet.writeInt32LE(0, 8);
        packet.writeInt32LE(2162945, 12);
        packet.write(client.user.username, 16, 'utf8');
        await client.send(packet);
    }

    async sendServerList(client) {
        const header = Buffer.alloc(16);
        header.writeUInt32LE(0x117b5a78, 0);
        header.writeUInt16LE(client.sequenceNumber++, 4);
        header.writeUInt16LE(0, 6);
        header.writeUInt32LE(0, 8);
        header.writeUInt32LE(2228488, 12);
        
        const payload = Buffer.alloc(512);
        let offset = 1;

        const serverCount = 50;
        
        payload.writeUInt16LE(serverCount, offset);
        offset += 6;

        const trimmedPayload = payload.slice(0, offset);
        const packet = Buffer.concat([header, trimmedPayload]);

        packet.writeUInt16LE(packet.length, 6);

        await client.send(packet);
    }

    async sendServerInfo(client) {
        const packet = this.createServerListPacket(client);
        await client.send(packet);
    }

    createServerListPacket(client) {
        const header = Buffer.alloc(16);
        header.writeUInt32LE(0x117b5a78, 0);
        header.writeUInt16LE(client.sequenceNumber++, 4);
        header.writeUInt16LE(0, 6);
        header.writeUInt32LE(0, 8);
        header.writeUInt32LE(2228481, 12);

        const payload = Buffer.alloc(512);
        let offset = 1;

        const serverCount = 1;
        
        payload.writeUInt16LE(serverCount, offset);
        offset += 6;

        for (let i = 0; i < serverCount; i++) {
            offset += 4;
            payload[offset++] = 0x00;

            offset += payload.write(`127.0.0.${i + 1}`, offset, 'utf8');
            payload[offset++] = 0x00;

            payload.writeUInt16LE(12000, offset);
            offset += 2;

            offset += 4;

            offset += payload.write(`Server ${i + 1}`, offset, 'utf8');
            payload[offset++] = 0x00;

            offset += 68;
        }

        const trimmedPayload = payload.slice(0, offset);
        const packet = Buffer.concat([header, trimmedPayload]);

        packet.writeUInt16LE(packet.length, 6);

        return packet;
    }

    async sendLockEnd(client) {
        const packet = Buffer.alloc(31);
        packet.writeInt32LE(1399145256, 0);
        packet.writeInt16LE(client.sequenceNumber++, 4);
        packet.writeInt16LE(20, 6);
        packet.writeInt32LE(0, 8);
        packet.writeInt32LE(2162977, 12);
        packet.writeInt16LE(0, 16);
        packet.writeInt32LE(0, 18);
        await client.send(packet);
    }

    async sendLoginFailure(client) {
        const response = Buffer.alloc(33);
        response.writeInt32LE(1399145256, 0);
        response.writeInt16LE(client.sequenceNumber++, 4);
        response.writeInt16LE(33, 6);
        response.writeInt32LE(0, 8);
        response.writeInt32LE(1114386, 12);
        response.writeInt16LE(1, 16);
        response.writeInt32LE(0x210102, 18);
        await client.send(response);
    }
}

class GameClient {
    constructor(id, socket, server) {
        this.id = id;
        this.socket = socket;
        this.server = server;
        this.user = null;
        this.sequenceNumber = 1;
    }

    setUser(user) {
        this.user = user;
    }

    async send(data) {
        return new Promise((resolve, reject) => {
            if (this.socket && !this.socket.destroyed) {
                this.socket.write(data, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            } else {
                logger.info(`Cannot send to client ${this.id}: Socket is not available`);
                reject(new Error('Socket not available'));
            }
        });
    }
}

class GameDatabase {
    constructor() {
        this.users = new Map();
        this.users.set('serefsiz', { username: 'serefsiz', password: '123' });
        this.users.set('test', { username: 'test', password: '123' });
    }

    async authenticateUser(username, password) {
        return new Promise((resolve) => {
            const user = this.users.get(username);
            if (user && user.password === password) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    }
}

async function main() {
    const gameServer = new GameServer(12000);
    await gameServer.start();
}

main().catch(console.error);
