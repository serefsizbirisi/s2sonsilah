const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NLaunch_NLock_SN_ItemList(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_ItemList);
    const payload = Buffer.alloc(1000);
    
    payload.fill(1);
    
    const yOffset = 0x10;
    const values = [2111099, 1110099, 1140099, 1210099, 1310099, 1410099, 2111099, 0];
    const baseOffset = 0x12;
    const step = 0x1b;
    
    payload.writeUint8(values.length, 0x11 - yOffset);
    
    for (let i = 0; i < values.length; i++) {
        payload.writeInt32LE(values[i], baseOffset + (step * i) - yOffset);
    }

    payload.writeUint8(1, 0x14 - yOffset); //item value
    
    payload.writeUint8(1, 0x16 - yOffset); //item value
    
    payload.writeInt32LE(1, 0x38 - yOffset);
    payload.writeUint8(1, 0x42 - yOffset); //item value
    payload.writeUint8(1, 0x46 - yOffset); //item value
    payload.writeInt32LE(1, 0x48 - yOffset);
    payload.writeUint8(1, 0x58 - yOffset); //item value
    
    packet.pushBuffer(payload);
    send_packet(socket, packet);
    console.log("tPacket_NLaunch_NLock_SN_ItemList Paketi Gönderildi");
}

module.exports = tPacket_NLaunch_NLock_SN_ItemList;