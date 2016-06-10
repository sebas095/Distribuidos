import * as bson from 'bson';

var BSON = new bson.BSONPure.BSON();


export class Message {
    type: any;
    content: any;

    constructor(type: any, content: any) {
        this.type = type;
        this.content = content;
    }

    static Encode(msg: Message) {
        var obj;
        if (msg.content == undefined) {
            obj = { type: msg.type }
        } else {
            obj = { type: msg.type, content: msg.content }
        }
        return BSON.serialize(obj, false, true, false);
    }

    static Decode(data: Buffer): Message {
        var obj = BSON.deserialize(data);
        if ("type" in obj) {
            return new Message(obj.type, obj.content);
        }
        return null
    }
}
