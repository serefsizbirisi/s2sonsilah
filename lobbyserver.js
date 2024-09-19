const IDefaultGamePacket = require('./IDefaultGamePacket');
const { PACKET_TYPES } = require('./PacketTypes');
const { send_packet } = require('./packets/sendPacket');

class LobbyServer {
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
        const payload = Buffer.alloc(512); // 4 byte için buffer oluştur
        payload.fill(0);
       
        payload.writeInt16LE(0, 16); // error code
        payload.writeInt32LE(0, 18); // error reason

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
       
        const xOffset = 16;
   
        // Keeping the working fields in their original positions
        snInfo_body.writeInt8(roomInfo.roomType, 0x16 - xOffset);
        snInfo_body.writeInt8(roomInfo.maxPlayers, 0x1A - xOffset);
        snInfo_body.write(roomInfo.roomName, 0x41 - xOffset, roomInfo.roomName.length, 'utf8');
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BaseRoomInfo(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236689);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BaseUserList(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236690);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NPlay_SN_BattleInfo(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2236692);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;
        
        packet.pushBuffer(snInfo_body);
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NRoom_SN_UserList(socket, roomInfo) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228787);
        const snInfo_body = Buffer.alloc(512);
        snInfo_body.fill(0);
       
        const xOffset = 16;
        
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
        const payload = Buffer.alloc(8);
        payload.writeInt32LE(0, 0);
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Change Part response sent");
    }

    async send_NHangar_NEquipment_SA_Unequip(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359650);
        const payload = Buffer.alloc(8);
        payload.writeInt32LE(0, 0);
        packet.pushBuffer(payload);
        send_packet(socket, packet);
        console.log("Unequip response sent");
    }
	
	async send_NHangar_NPurchase_SA_CashBuy(socket, errorCode = 0, errorReason = 0) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359812);
        const payload = Buffer.alloc(256);
        
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

    async tPacket_NMatchup_NChannel_SN_UserList(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228499);
        const payload = Buffer.alloc(512);
        let offset = 1;
        const Count = 1;
        let username = "test";
        
        payload.writeUInt16LE(Count, offset);
        offset += 3;
        for (let i = 0; i < Count; i++) {
            offset += payload.writeUInt32LE(`57`, offset, 'utf8');
            offset += 4;
            offset += payload.write(username, offset, username.length, 'utf8');
            offset += 1;
        }
        packet.pushBuffer(payload.slice(0, offset));
        send_packet(socket, packet);
    }

    async tPacket_NMatchup_NChannel_SN_ChannelList(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228482);
        const payload = Buffer.alloc(512);
        let offset = 1;
        const serverCount = 1;
        
        payload.writeUInt16LE(serverCount, offset);
        offset += 6;
        for (let i = 0; i < serverCount; i++) {
            offset += 13;
            payload[offset++] = 0x00;
            offset += payload.write(`Kanal ${i + 1}`, offset, 'utf8');
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

    async tPacket_NMatchup_NChannel_SA_LeaveUser(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228501);
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

    async tPacket_NMatchup_NChannel_SN_LeaveUser(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2228502);
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

    async tPacket_NHangar_NEquipment_SA_Close(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), 2359556);
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

    handleConnection(socket) {
        socket.on('data', (data) => {
            this.handleIncomingData(socket, data);
        });

        socket.on('end', () => {
            console.log('Client disconnected from Lobby Server');
        });

        socket.on('error', (err) => {
            console.error('Socket error in Lobby Server:', err);
        });
    }

    handleIncomingData(socket, data) {
        const opCode = data.readInt32LE(12);

        switch (opCode) {
            case 2228497:
            console.log("Channel Select Req");
            this.tPacket_NMatchup_NChannel_SA_EnterUser(socket);
            break;
        case 1114404:
            console.log("server Select");
            this.tPacket_NMatchup_NChannel_SN_ChannelList(socket);
            this.tPacket_NMatchup_NChannel_SN_UserList(socket);
            this.tPacket_NAccount_NIdentity_SA_Join(socket);
            this.send_NLock_SN_LockEnd(socket);
            break;
		case 2359559:  // tPacket_NHangar_NEquipment_CQ_ChangePart
            console.log("Change Part request received");
            this.send_NHangar_NEquipment_SA_ChangePart(socket).catch(error => {
                console.error('Error sending Change Part response:', error);
            });
            break;
        case 2359649:  // tPacket_NHangar_NEquipment_CQ_Unequip
            console.log("Unequip request received");
            this.send_NHangar_NEquipment_SA_Unequip(socket).catch(error => {
                console.error('Error sending Unequip response:', error);
            });
            break;
			case 2359585:  // tPacket_NHangar_NEquipment_SA_ActiveItem
            console.log("Active Item request received");
            this.send_NHangar_NEquipment_SA_ActiveItem(socket).catch(error => {
                console.error('Error sending Active Item response:', error);
            });
            break;

        case 2359587:  // tPacket_NHangar_NEquipment_SA_DeleteItem
            console.log("Delete Item request received");
            this.send_NHangar_NEquipment_SA_DeleteItem(socket).catch(error => {
                console.error('Error sending Delete Item response:', error);
            });
            break;

        case 2359589:  // tPacket_Hanger_NEquiment_SA_UseItem
            console.log("Use Item request received");
            this.send_NHangar_NEquipment_SA_UseItem(socket).catch(error => {
                console.error('Error sending Use Item response:', error);
            });
            break;
        case 4260097:
            console.log("TheRawServer Connect");
			console.log(data.toString('utf8'));
            break;
       case 2359553:
            console.log("Received packet 2359553, responding with NHangar_NEquipment_SA_Open and LockEnd");
            this.handleEquipmentOpen(socket).catch(error => {
                console.error('Error handling equipment open:', error);
            });
            break;
		case 2359811:  // tPacket_NHangar_NPurchase_SA_CashBuy
            console.log("Cash Buy request received");
            this.send_NHangar_NPurchase_SA_CashBuy(socket).catch(error => {
                console.error('Error sending Cash Buy response:', error);
            });
            break;
        case 2228737:
            console.log("Create Room Req");
			console.log(data.toString('utf8'));
            const roomInfo = {
                roomName: "Test Room",
                mapID: 1001,
                roomType: 3,
                maxPlayers: 8,
            };
            this.sendRoom(socket, roomInfo).catch(error => {
                console.error('Error sending room creation packets:', error);
            });
            break;
        case 2228500:
            this.tPacket_NMatchup_NChannel_SA_LeaveUser(socket);
            this.tPacket_NMatchup_NChannel_SN_LeaveUser(socket);
            break;
        case 2359555:
            this.tPacket_NHangar_NEquipment_SA_Close(socket);
            break;
            default:
                console.log(`Unknown packet opcode in Lobby Server: ${opCode}`);
                break;
        }
    }
}

module.exports = LobbyServer;