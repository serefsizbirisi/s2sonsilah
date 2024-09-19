const IDefaultGamePacket = require('./../../IDefaultGamePacket');
const { PACKET_TYPES } = require('./../../PacketTypes');
const { send_packet } = require('./../sendPacket');

async function tPacket_NLaunch_NLock_SN_SlotInfo(socket, sequence) {
    const packet = IDefaultGamePacket.init(sequence, PACKET_TYPES.SN_SlotInfo);
    const payload = Buffer.alloc(512);
    
    const xoffset = 0x10;
    let index = 5;
    
    const inventoryItems = [
        2111099, // karakter
        2113099, // karakter 2
        1110099, // tüfek
        1140099, // keskin nişancı tüfeği
        1210099, // tabanca
        1310099, // bıçak
        1410099, // bomba
        2211035,       // boş slot (şapka/saç için)
        2311035,       // boş slot (üst giysi için)
        2411035,       // boş slot (alt giysi için)
        2311035        // ekstra boş slot
    ];

    for (let i = 0; i < inventoryItems.length; i++) {
        payload.writeUInt32LE(inventoryItems[i], (4 * (index + i)) - xoffset);
    }

    packet.pushBuffer(payload);
    send_packet(socket, packet);
    console.log("tPacket_NLaunch_NLock_SN_SlotInfo Paketi Gönderildi");
}

module.exports = tPacket_NLaunch_NLock_SN_SlotInfo;