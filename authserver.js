const IDefaultGamePacket = require('./IDefaultGamePacket');
const { PACKET_TYPES } = require('./PacketTypes');
const { send_packet } = require('./packets/sendPacket');
const { 
    tPacket_NAccount_NIdentity_SA_JoyGameLogin,
    tPacket_NLaunch_NLock_SN_UserInfo,
    tPacket_NLaunch_NLock_SN_Record,
    tPacket_NMatchup_NChannel_SN_ServerList,
    tPacket_NMatchup_NChannel_SN_ServerInfo,
    tPacket_NMatchup_NChannel_SN_ChannelList,
    tPacket_NLaunch_NLock_SN_ItemList,
    tPacket_NLaunch_NLock_SN_SlotInfo,
    tPacket_NLaunch_NLock_SN_LockEnd

} = require('./packets/auth');

function readStringFromBuffer(buffer, start, end) {
    let str = '';
    for (let i = start; i < end; i++) {
        const char = buffer.readUInt8(i);
        if (char === 0) {
            break;
        }
        str += String.fromCharCode(char);
    }
    return str;
}
class AuthServer {
    constructor() {
        this.sequence = 1;
    }

    getNextSequence() {
        return this.sequence++;
    }

    async sendLogin(socket) {
        await tPacket_NAccount_NIdentity_SA_JoyGameLogin(socket, this.getNextSequence());
        await tPacket_NLaunch_NLock_SN_UserInfo(socket, this.getNextSequence());
        await tPacket_NLaunch_NLock_SN_Record(socket, this.getNextSequence());
        await tPacket_NMatchup_NChannel_SN_ServerList(socket, this.getNextSequence());
        await tPacket_NMatchup_NChannel_SN_ServerInfo(socket, this.getNextSequence());
        await tPacket_NMatchup_NChannel_SN_ChannelList(socket, this.getNextSequence());
        await tPacket_NLaunch_NLock_SN_ItemList(socket, this.getNextSequence());
        await tPacket_NLaunch_NLock_SN_SlotInfo(socket, this.getNextSequence());
        await tPacket_NLaunch_NLock_SN_LockEnd(socket, this.getNextSequence());
    }

    async send_NChannel_SN_ServerSelect(socket) {
        const packet = IDefaultGamePacket.init(this.getNextSequence(), PACKET_TYPES.SA_AwayUser);
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
            console.log('Client disconnected from Auth Server');
        });

        socket.on('error', (err) => {
            console.error('Socket error in Auth Server:', err);
        });
    }

    handleIncomingData(socket, data) {
        const opCode = data.readInt32LE(12);

        switch (opCode) {
        case PACKET_TYPES.CQ_JoyGameLogin:
            const username = readStringFromBuffer(data, 16, 49);
            const password = readStringFromBuffer(data, 49, 82);
            const ip = readStringFromBuffer(data, 82, 98);
            console.log(`username:${username} pw:${password} ip:${ip}`);
            this.sendLogin(socket).catch(error => {
                console.error('Error sending login success:', error);
            });
            break;
        case PACKET_TYPES.CQ_AwayUser:
            console.log("server seçme.");
            this.send_NChannel_SN_ServerSelect(socket).catch(error => {
                console.error('Error sending server select:', error);
            });
            break;
        case 7667969:
            // anti cheat
            break;
            default:
                console.log(`Unknown opcode in Auth Server: ${opCode}`);
                break;
        }
    }
}

module.exports = AuthServer;