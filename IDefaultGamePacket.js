class IDefaultGamePacket {
    constructor(sequence, opcode) {
        this.buffer = Buffer.alloc(16);
        this.buffer.writeUInt32LE(0x117b5a78, 0);
        this.buffer.writeUInt16LE(sequence, 4);
        this.buffer.writeUInt16LE(16, 6);  // Initial length, will be updated
        this.buffer.writeUInt32LE(0, 8);
        this.buffer.writeUInt32LE(opcode, 12);
    }

    static init(sequence, opcode) {
        return new IDefaultGamePacket(sequence, opcode);
    }

    pushBuffer(additionalBuffer) {
        this.buffer = Buffer.concat([this.buffer, additionalBuffer]);
        this.buffer.writeUInt16LE(this.buffer.length, 6);  // Update length
    }

    getBuffer() {
        return this.buffer;
    }
}

module.exports = IDefaultGamePacket;
