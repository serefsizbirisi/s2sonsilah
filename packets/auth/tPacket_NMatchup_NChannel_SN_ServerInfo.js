const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NMatchup_NChannel_SN_ServerInfo(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_ServerInfo);
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
    console.log("tPacket_NMatchup_NChannel_SN_ServerInfo Paketi Gönderildi");
}

module.exports = tPacket_NMatchup_NChannel_SN_ServerInfo;