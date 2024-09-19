const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NAccount_NIdentity_SA_JoyGameLogin(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SA_JoyGameLogin);
    const payload = Buffer.alloc(8);
    payload.writeInt16LE(0, 0); // error code
    payload.writeInt32LE(0, 2); // error reason
    packet.pushBuffer(payload);
    send_packet(socket, packet);
    console.log("tPacket_NAccount_NIdentity_SA_JoyGameLogin Paketi Gönderildi");
}

module.exports = tPacket_NAccount_NIdentity_SA_JoyGameLogin;
