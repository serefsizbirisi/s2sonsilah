const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NMatchup_NChannel_SN_ChannelList(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_ChannelList);
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
    console.log("tPacket_NMatchup_NChannel_SN_ChannelList Paketi Gönderildi");
}

module.exports = tPacket_NMatchup_NChannel_SN_ChannelList;
