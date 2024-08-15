const net = require('net');
const uuid = require('uuid');

class IDefaultGamePacket {
    constructor(sequence, opcode) {
        this.buffer = Buffer.alloc(16);
        this.buffer.writeUInt32LE(0x117b5a78, 0);
        this.buffer.writeUInt16LE(sequence, 4);
        this.buffer.writeUInt16LE(16, 6);  // Initial length, will be updated
        this.buffer.writeUInt32LE(0, 8);
        this.buffer.writeUInt32LE(opcode, 12);
    }

    static init(sequence, opcode) {
        return new IDefaultGamePacket(sequence, opcode);
    }

    pushBuffer(additionalBuffer) {
        this.buffer = Buffer.concat([this.buffer, additionalBuffer]);
        this.buffer.writeUInt16LE(this.buffer.length, 6);  // Update length
    }

    getBuffer() {
        return this.buffer;
    }
}

function send_packet(socket, packet) {
    socket.write(packet.getBuffer());
}

class Game {
    constructor() {
        this.sequence = 1;
    }

    getNextSequence() {
        return this.sequence++;
    }

    async send_NIdentity_SA_JoyGameLogin(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 1114386);
        const payload = Buffer.alloc(8);
        payload.writeInt16LE(0, 0); // error code
        payload.writeInt32LE(0, 2); // error reason
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NLock_SN_UserInfo(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2162945);
        const payload = Buffer.alloc(88);
        payload.write("serefsiz", 0, 'utf8');
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NChannel_SN_ServerList(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228488);
        const payload = Buffer.alloc(496);
        let offset = 1;
        const serverCount = 3;
        payload.writeUInt16LE(serverCount, offset);
        offset += 16;
        for (let i = 0; i < serverCount; i++) {
            offset += 4;
            payload[offset++] = 0x00;
            offset += payload.write(`Kanal ${i + 1}`, offset, 'utf8');
        }
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NChannel_SN_ServerInfo(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228481);
        const payload = Buffer.alloc(496);
        let offset = 1;
        const serverCount = 1;
        payload.writeUInt16LE(serverCount, offset);
        offset += 6;
        for (let i = 0; i < serverCount; i++) {
            offset += 4;
            payload[offset++] = 0x00;
            offset += payload.write(`127.0.0.1`, offset, 'utf8');
            offset += 2;
            offset += 5;
            offset += payload.write(`Server ${i + 1}`, offset, 'utf8');
            payload.writeUInt16LE(13000, 0x57);   //port
            payload.writeUInt16LE(30, 0x5f); 
            offset += 69;
        }
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NChannel_SN_ServerSelect(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228530);
        const payload = Buffer.alloc(52);
        let offset = 1;
        const serverCount = 1;
        payload.writeUInt16LE(serverCount, offset);
        offset += 6;
        for (let i = 0; i < serverCount; i++) {
            offset += 4;
            payload[offset++] = 0x00;
            payload[offset++] = 0x00;
            offset += 30;
        }
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NLock_SN_LockEnd(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2162977);
        const payload = Buffer.alloc(8);
        payload.writeInt16LE(0, 0); // error code
        payload.writeInt32LE(0, 2); // error reason
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NLock_SN_Record(socket, tpPercentage = 100) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2162961);
        const payload = Buffer.alloc(112);
        const values = [2111099, 1110099, 1140099, 1210099, 1310099, 1410099, 2111099, 0];
        payload.writeUint8(values.length, 1);
        let offset = 2;
        values.forEach(value => {
            payload.writeInt32LE(value, offset);
            offset += 4;
        });
        payload.writeInt32LE(0x38, offset); offset += 4;
        payload.writeInt32LE(0x40, offset);
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }
	
	async send_NMatchup_NPlay_SN_ItemList(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2162961);
        const payload = Buffer.alloc(1000);
        payload.fill(1);
        
        const yOffset = 0x10;
        const values = [2112001, 1110099, 1140099, 1210099, 1310099, 1410099, 2112001, 0,1110010,1110009,1110019,1110038,1110048,1120001,1210006,1310011];
        const baseOffset = 0x12;
        const step = 0x1b;
        
        payload.writeUint8(values.length, 0x11 - yOffset);
        
        for (let i = 0; i < values.length; i++) {
            payload.writeInt32LE(values[i], baseOffset + (step * i) - yOffset);
        }
        
        payload.writeInt32LE(1, 0x38 - yOffset);
        payload.writeInt32LE(1, 0x48 - yOffset);
        
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Item list sent");
    }

    async send_NMatchup_NPlay_SN_Inventory(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 0x210113);
        const payload = Buffer.alloc(512);
        const xoffset = 0x10;
        let index_1 = 5;
        let index_2 = 0;
        
        const inventoryItems = [
            2112001, // char
            1310011, // tüfek
            1210096, // tabanca
            1310095, // bıçak
            1410094, // bomba
            0,       // şapka saç
            0,       // üst
            0,       // alt
            0,
            0,
            0
        ];
        
        for (let i = 0; i < inventoryItems.length; i++) {
            payload.writeUint32LE(inventoryItems[i], (4 * (index_1 + i)) - xoffset);
        }
        
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Inventory info sent");
    }
	
	async send_NLock_SN_Record(socket, tpPercentage = 100) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2162947);
        const payload = Buffer.alloc(112);  // 128 - 16 (header size)
    
        let offset = 0;
        payload.writeUInt32LE(57, offset);
        offset += 4;
        payload.writeInt32LE(1, offset); offset += 4;
        payload.writeInt16LE(0, offset); offset += 4;
        
        const scaledTPValue = Math.floor((tpPercentage + 100) * 255 / 200);
        const clampedValue = Math.max(0, Math.min(255, scaledTPValue));
        payload.writeUInt8(clampedValue, offset);
        offset += 1;
        
        payload.writeUInt8(0, offset); offset += 1;
        payload.writeUInt16LE(0, offset); offset += 2;
        payload.writeUInt32LE(0, offset); offset += 4;
        payload.writeUInt32LE(11, offset); offset += 4;
        payload.writeUInt32LE(21, offset); offset += 4;
        payload.writeUInt32LE(31, offset); offset += 4;
        payload.writeUInt32LE(41, offset); offset += 4;
        payload.writeUInt32LE(51, offset); offset += 4;
    
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("NLock_SN_Record sent");
    }
	
	

    async sendLogin(socket) {
        await this.send_NIdentity_SA_JoyGameLogin(socket);
        await this.send_NLock_SN_UserInfo(socket);
        await this.send_NChannel_SN_ServerList(socket);
        await this.send_NChannel_SN_ServerInfo(socket);
        await this.send_NLock_SN_LockEnd(socket);
		await this.send_NMatchup_NPlay_SN_ItemList(socket);
		await this.send_NMatchup_NPlay_SN_Inventory(socket);
        await this.send_NLock_SN_Record(socket);
    }
}

const game = new Game();

function handleIncomingData(socket, data) {
    const hexData = data.toString('hex').match(/.{1,2}/g).join(' ');
    console.log(`Received packet: ${hexData}`);

    const opCode = data.readInt32LE(12);

    switch (opCode) {
        case 1114385:
            console.log("login request");
            game.sendLogin(socket).catch(error => {
                console.error('Error sending login success:', error);
            });
            break;
        case 2228513:
            console.log("search request");
            break;
        case 2228529:
            console.log("server select request");
            game.send_NChannel_SN_ServerSelect(socket).catch(error => {
                console.error('Error sending server select:', error);
            });
            break;
        case 2359585:
            const response = IDefaultGamePacket.init(game.getNextSequence(), 2359586);
            const payload = Buffer.alloc(8);
            payload.writeInt16LE(0, 0); // error code
            payload.writeInt32LE(0, 2); // error reason
            response.pushBuffer(payload);
            send_packet(socket, response);
            break;
        default:
            console.log(`Unknown packet opcode: ${opCode}`);
            break;
    }
}

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        handleIncomingData(socket, data);
    });
});

server.listen(12000, () => {
    console.log('Server started on port 12000.');
});