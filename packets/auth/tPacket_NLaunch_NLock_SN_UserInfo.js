const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NLaunch_NLock_SN_UserInfo(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_UserInfo);
    const payload = Buffer.alloc(88);
    payload.write("serefsiz", 0, 'utf8');
    packet.pushBuffer(payload);
    send_packet(socket, packet);
    console.log("tPacket_NLaunch_NLock_SN_UserInfo Paketi Gönderildi");
}

module.exports = tPacket_NLaunch_NLock_SN_UserInfo;
