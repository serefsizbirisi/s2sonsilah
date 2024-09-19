const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NLaunch_NLock_SN_LockEnd(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_LockEnd);
    const payload = Buffer.alloc(8);
    payload.writeInt16LE(0, 0);
    payload.writeInt32LE(0, 2);
    packet.pushBuffer(payload);
    send_packet(socket, packet);
    console.log("tPacket_NLaunch_NLock_SN_LockEnd Paketi Gönderildi");
}

module.exports = tPacket_NLaunch_NLock_SN_LockEnd;
