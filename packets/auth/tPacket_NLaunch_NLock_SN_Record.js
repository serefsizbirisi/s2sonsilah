const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NLaunch_NLock_SN_Record(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_Record);
    const payload = Buffer.alloc(112);
    let tpPercentage = 50
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
    console.log("tPacket_NLaunch_NLock_SN_Record Paketi Gönderildi");
}

module.exports = tPacket_NLaunch_NLock_SN_Record;