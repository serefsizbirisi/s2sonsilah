function send_packet(socket, packet) {
    socket.write(packet.getBuffer());
}

module.exports = { send_packet };
