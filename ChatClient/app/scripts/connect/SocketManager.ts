import * as net from "net";
import * as events from "events";
import {Message} from "./Message"

export class SocketManager extends events.EventEmitter {
    address: { host: string; port: number };
    socket: net.Socket;
    data: Buffer;

    constructor() {
        super();
        this.socket = new net.Socket();
        this.data = new Buffer(0);
        // this.address = { host: "localhost", port: 9999 };

        this.socket.on("data", (new_data: Buffer) => {
            this.data = Buffer.concat([this.data, new_data]);
            while (true) {
                if (this.data.length < 4) break;
                var msg_size = this.data.readUInt32LE(0);

                var msg_bytes = this.data.slice(4, 4 + msg_size);
                var msg = Message.Decode(msg_bytes);
                this.data = this.data.slice(4 + msg_size, this.data.length);
                this.emit("receive", msg);
            }
        });

        this.socket.on("close", (had_error: boolean) => {
            this.emit("close", had_error);
        });

        this.socket.on("error", (err: Error) => {
            this.emit("error", err);
        });

        this.socket.on("timeout", () => {
            this.emit("timeout");
        });
    }

    Connect(host: string, port: number, connectionListener?: Function) {
        this.address = { host: host, port: port };
        this.socket.connect(port, host, connectionListener);
    }

    Send(msg: Message) {
        var data = Message.Encode(msg);

        var send_buffer = new Buffer(4);
        send_buffer.writeUInt32LE(data.length, 0);
        send_buffer = Buffer.concat([send_buffer, data]);

        this.socket.write(send_buffer);
    }
}
