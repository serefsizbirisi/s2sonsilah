const net = require('net');
const uuid = require('uuid');
const EventEmitter = require('events');
const readline = require('readline');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'game-server.log' })
    ]
});

class Packet {
    constructor(data) {
        this.data = data;
        this.opCode = this.data.readInt32LE(12);
    }

    readString(offset, maxLength) {
        let result = '';
        for (let i = 0; i < maxLength; i++) {
            const char = this.data.readUInt8(offset + i);
            if (char === 0) break;
            result += String.fromCharCode(char);
        }
        return result;
    }
}
