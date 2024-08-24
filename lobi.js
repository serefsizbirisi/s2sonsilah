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

    async tPacket_NMatchup_NChannel_SA_EnterUser(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228498);
        const payload = Buffer.alloc(512);
        let offset = 1;
        const serverCount = 2;
        
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
        packet.pushBuffer(payload.slice(0, offset));
        send_packet(socket, packet);
    }
	
	async send_NHosting_SA_HostResponse(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 3541282);
        const payload = Buffer.alloc(16);  // Adjust size if needed
        
        // You might want to add some host-related data here
        payload.writeInt32LE(0, 0);  // Example: Host status (0 for success)
        payload.writeInt32LE(12345, 4);  // Example: Host ID or Room ID
        payload.writeInt16LE(8, 8);  // Example: Max players
        payload.writeInt16LE(1, 10);  // Example: Current players
        
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Host response sent");
    }

    async send_NHosting_NGuest_SN_HostConnect(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 4326147);
        const payload = Buffer.alloc(512);
        payload.fill(0);
        let server_ip = "127.0.0.1";
        let xOffset = 16;
        payload.writeInt16LE(3333, 0x10 - xOffset); //port
        payload.write(server_ip, 0x13 - xOffset, server_ip.length, 'utf8');   //server ip
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NHangar_NEquipment_SA_Open(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359554);
        const payload = Buffer.alloc(24);  // Adjust the size as needed
        payload.writeInt16LE(0x0, 0); // error code
        payload.writeInt32LE(0x0, 2); // error reason
		payload.writeUInt8(0x0, 3);
		payload.writeUInt8(0x0, 4);
		payload.writeUInt8(0x0, 5);
        payload.writeUInt8(0x1E, 6);
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NLock_SN_LockEnd(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359556);
        const payload = Buffer.alloc(8);
        payload.writeInt16LE(0, 0); // error code
        payload.writeInt32LE(0, 2); // error reason
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async handleEquipmentOpen(socket) {
        await this.send_NHangar_NEquipment_SA_Open(socket);
       // await this.send_NLock_SN_LockEnd(socket);
    }

    async send_NRoom_SA_Create(data, socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228738);
        const payload = Buffer.alloc(8);
        payload.writeInt16LE(0, 0); // error code
        payload.writeInt32LE(0, 2); // error reason
        packet.pushBuffer(payload);
        send_packet(socket, packet);
    }

    async send_NRoom_SN_Info(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228739);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;  // Assuming xOffset is 16 based on previous examples
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);

        // Experimenting with other field positions
        snInfo_body.writeInt32LE(roomInfo.mapID, 0x1E - xOffset);
        snInfo_body.writeInt8(roomInfo.gameMode, 0x1B - xOffset);
        snInfo_body.writeInt8(roomInfo.currentPlayers, 0x1C - xOffset);
        snInfo_body.writeInt8(roomInfo.gameType, 0x1F - xOffset);
        snInfo_body.writeInt16LE(roomInfo.objective, 0x1D - xOffset);
        snInfo_body.writeInt16LE(roomInfo.duration, 0x17 - xOffset);
        
        // Adding more experimental data
        snInfo_body.writeInt32LE(roomInfo.experiData1, 0x2B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData2, 0x2F - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData3, 0x21 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData4, 0x33 - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData5, 0X44 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData6, 0x55 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData7, 0x39 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData8, 0x3A - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData9, 0x3B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData10, 0x3F - xOffset);

        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BaseRoomInfo(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236689);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;  // Assuming xOffset is 16 based on previous examples
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);

        // Experimenting with other field positions
        snInfo_body.writeInt32LE(roomInfo.mapID, 0x20 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameMode, 0x24 - xOffset);
        snInfo_body.writeInt8(roomInfo.currentPlayers, 0x25 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameType, 0x26 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.objective, 0x27 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.duration, 0x29 - xOffset);
        
        // Adding more experimental data
        snInfo_body.writeInt32LE(roomInfo.experiData1, 0x2B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData2, 0x2F - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData3, 0x31 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData4, 0x32 - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData5, 0x33 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData6, 0x37 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData7, 0x39 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData8, 0x3A - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData9, 0x3B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData10, 0x3F - xOffset);

        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BaseUserList(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236690);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;  // Assuming xOffset is 16 based on previous examples
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);

        // Experimenting with other field positions
        snInfo_body.writeInt32LE(roomInfo.mapID, 0x20 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameMode, 0x24 - xOffset);
        snInfo_body.writeInt8(roomInfo.currentPlayers, 0x25 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameType, 0x26 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.objective, 0x27 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.duration, 0x29 - xOffset);
        
        // Adding more experimental data
        snInfo_body.writeInt32LE(roomInfo.experiData1, 0x2B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData2, 0x2F - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData3, 0x31 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData4, 0x32 - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData5, 0x33 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData6, 0x37 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData7, 0x39 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData8, 0x3A - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData9, 0x3B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData10, 0x3F - xOffset);

        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BattleInfo(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236692);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;  // Assuming xOffset is 16 based on previous examples
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);

        // Experimenting with other field positions
        snInfo_body.writeInt32LE(roomInfo.mapID, 0x20 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameMode, 0x24 - xOffset);
        snInfo_body.writeInt8(roomInfo.currentPlayers, 0x25 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameType, 0x26 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.objective, 0x27 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.duration, 0x29 - xOffset);
        
        // Adding more experimental data
        snInfo_body.writeInt32LE(roomInfo.experiData1, 0x2B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData2, 0x2F - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData3, 0x31 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData4, 0x32 - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData5, 0x33 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData6, 0x37 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData7, 0x39 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData8, 0x3A - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData9, 0x3B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData10, 0x3F - xOffset);

        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NRoom_SN_UserList(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228787);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;  // Assuming xOffset is 16 based on previous examples
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);

        // Experimenting with other field positions
        snInfo_body.writeInt32LE(roomInfo.mapID, 0x20 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameMode, 0x24 - xOffset);
        snInfo_body.writeInt8(roomInfo.currentPlayers, 0x25 - xOffset);
        snInfo_body.writeInt8(roomInfo.gameType, 0x26 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.objective, 0x27 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.duration, 0x29 - xOffset);
        
        // Adding more experimental data
        snInfo_body.writeInt32LE(roomInfo.experiData1, 0x2B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData2, 0x2F - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData3, 0x31 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData4, 0x32 - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData5, 0x33 - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData6, 0x37 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData7, 0x39 - xOffset);
        snInfo_body.writeInt8(roomInfo.experiData8, 0x3A - xOffset);
        snInfo_body.writeInt32LE(roomInfo.experiData9, 0x3B - xOffset);
        snInfo_body.writeInt16LE(roomInfo.experiData10, 0x3F - xOffset);

        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    

    async sendRoom(socket, roomInfo) {
        await this.send_NRoom_SA_Create(null, socket);
        await this.send_NRoom_SN_Info(socket, roomInfo);
        await this.tPacket_NMatchup_NPlay_SN_BaseRoomInfo(socket, roomInfo);
        await this.tPacket_NMatchup_NPlay_SN_BaseUserList(socket, roomInfo);
        await this.tPacket_NMatchup_NPlay_SN_BattleInfo(socket, roomInfo);
        await this.tPacket_NMatchup_NRoom_SN_UserList(socket, roomInfo);
    }
	
	async send_NHangar_NEquipment_SA_ChangePart(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359560);
        const payload = Buffer.alloc(8);  // Adjust size if needed
        payload.writeInt32LE(0, 0);  // You might want to add some data here
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Change Part response sent");
    }

    async send_NHangar_NEquipment_SA_Unequip(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359650);
        const payload = Buffer.alloc(8);  // Adjust size if needed
        payload.writeInt32LE(0, 0);  // You might want to add some data here
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Unequip response sent");
    }
	
	async send_NHangar_NPurchase_SA_CashBuy(socket, errorCode = 0, errorReason = 0) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359812);
        const payload = Buffer.alloc(256);  // Increased size to accommodate error reason
        
        payload.writeInt16LE(0, 0);
        payload.writeInt32LE(0, 2, 'utf8');
        
        if (errorCode === 0) {
            // If successful, include purchase details
            payload.writeInt32LE(1000, 64);  // Remaining cash balance
            payload.writeInt32LE(12345, 68);  // Item ID that was purchased
            payload.writeInt32LE(1, 72);  // Quantity purchased
        }
        
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log(`Cash Buy response sent (Error Code: ${errorCode})`);
    }
	
	async send_NHangar_NEquipment_SA_ActiveItem(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359586);
        const payload = Buffer.alloc(32);
        payload.writeInt16LE(0, 0);  // Error code (0 for success)
        payload.writeInt32LE(0, 2);  // Error reason (0 for no error)
        payload.writeInt32LE(12345, 6);  // Item ID that was activated
        payload.writeInt32LE(1, 10);  // Quantity activated
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Active Item response sent");
    }

    async send_NHangar_NEquipment_SA_DeleteItem(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359588);
        const payload = Buffer.alloc(32);
        payload.writeInt16LE(0, 0);  // Error code (0 for success)
        payload.writeInt32LE(0, 2);  // Error reason (0 for no error)
        payload.writeInt32LE(12345, 6);  // Item ID that was deleted
        payload.writeInt32LE(1, 10);  // Quantity deleted
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Delete Item response sent");
    }

    async send_NHangar_NEquipment_SA_UseItem(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359590);
        const payload = Buffer.alloc(32);
        payload.writeInt16LE(0, 0);  // Error code (0 for success)
        payload.writeInt32LE(0, 2);  // Error reason (0 for no error)
        payload.writeInt32LE(12345, 6);  // Item ID that was used
        payload.writeInt32LE(1, 10);  // Quantity used
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Use Item response sent");
    }

    async tPacket_NAccount_NIdentity_SA_Join(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 1114405);
        const payload = Buffer.alloc(52);
        let offset = 1;
        const serverCount = 1;
        payload.writeInt16LE(0, 0);  // Error code (0 for success)
        payload.writeInt32LE(0, 2);  // Error reason (0 for no error)
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
}

const game = new Game();
let counter = 4
function handleIncomingData(socket, data) {
    const opCode = data.readInt32LE(12);

    switch (opCode) {
        case 2228497:
            console.log("Channel Select Req");
            game.tPacket_NMatchup_NChannel_SA_EnterUser(socket);
            break;
        case 1114404:
            console.log("server Select okeyleme");
            game.tPacket_NAccount_NIdentity_SA_Join(socket);
            break;
		case 4325896:  // New host-related request
            console.log("Host-related request received");
			console.log(data.toString('utf8'));
            game.send_NHosting_SA_HostResponse(socket).catch(error => {
                console.error('Error sending host response:', error);
            });
            break;
		case 2359559:  // tPacket_NHangar_NEquipment_CQ_ChangePart
            console.log("Change Part request received");
            game.send_NHangar_NEquipment_SA_ChangePart(socket).catch(error => {
                console.error('Error sending Change Part response:', error);
            });
            break;
        case 2359649:  // tPacket_NHangar_NEquipment_CQ_Unequip
            console.log("Unequip request received");
            game.send_NHangar_NEquipment_SA_Unequip(socket).catch(error => {
                console.error('Error sending Unequip response:', error);
            });
            break;
			case 2359585:  // tPacket_NHangar_NEquipment_SA_ActiveItem
            console.log("Active Item request received");
            game.send_NHangar_NEquipment_SA_ActiveItem(socket).catch(error => {
                console.error('Error sending Active Item response:', error);
            });
            break;

        case 2359587:  // tPacket_NHangar_NEquipment_SA_DeleteItem
            console.log("Delete Item request received");
            game.send_NHangar_NEquipment_SA_DeleteItem(socket).catch(error => {
                console.error('Error sending Delete Item response:', error);
            });
            break;

        case 2359589:  // tPacket_Hanger_NEquiment_SA_UseItem
            console.log("Use Item request received");
            game.send_NHangar_NEquipment_SA_UseItem(socket).catch(error => {
                console.error('Error sending Use Item response:', error);
            });
            break;
        case 4260097:
            console.log("TheRawServer Connect");
			console.log(data.toString('utf8'));
            break;
       case 2359553:
            console.log("Received packet 2359553, responding with NHangar_NEquipment_SA_Open and LockEnd");
            game.handleEquipmentOpen(socket).catch(error => {
                console.error('Error handling equipment open:', error);
            });
            break;
		case 2359811:  // tPacket_NHangar_NPurchase_SA_CashBuy
            console.log("Cash Buy request received");
            game.send_NHangar_NPurchase_SA_CashBuy(socket).catch(error => {
                console.error('Error sending Cash Buy response:', error);
            });
            break;
        /*case 2229012:
            console.log("team change");
            game.send_NHosting_NGuest_SN_HostConnect(socket);
            break;*/
        case 2229521:
            console.log("wiper");
            game.send_NHosting_NGuest_SN_HostConnect(socket);
            break;
        case 2228737:
            console.log("Create Room Req");
			console.log(data.toString('utf8'));
            const roomInfo = {
                roomName: "Test Room",
                mapID: 1001,
                roomType: 3,
                gameMode: 2,
                maxPlayers: 8,
                currentPlayers: 1,
                gameType: 1,
                objective: 100,
                duration: 600,  // 10 minutes in seconds
                experiData1: 12345,
                experiData2: 678,
                experiData3: 90,
                experiData4: 11,
                experiData5: 22334,
                experiData6: 556,
                experiData7: 77,
                experiData8: 88,
                experiData9: 99001,
                experiData10: 234
            };
            game.sendRoom(socket, roomInfo).catch(error => {
                console.error('Error sending room creation packets:', error);
            });
            break;
            /*case 2228737:
                data.writeUInt16LE(3, 4);
                data.writeUInt32LE(2228739, 12);
                data.writeInt8(3, 0x16, 16);
                data.writeInt8(2, 0x1A, 17);
                data.writeInt8(2, 0x1B, 17);
                data.writeInt8(2, 0x1C, 17);
                data.writeInt8(2, 0x1E, 17);
                console.log(data.toString('hex'));
                socket.write(data);
                break;*/
            case 2229012:
                data.writeUInt16LE(counter, 4);
                data.writeUInt32LE(2229011, 12);
                console.log(data.toString('hex'));
                socket.write(data);
                counter++;
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

server.listen(13000, () => {
    console.log('Server started on port 13000.');
});
