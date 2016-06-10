export enum MessageType {
    CHAT = 0,
    LOGIN = 1,
    REGISTER = 2,
    CREATE_ROOM = 3,
    REMOVE_ROOM = 4,
    RESPONSE = 100,
    NEW_ROOM = 110,
    NEW_CHAT = 111,
    DELETE_ROOM = 112,
    SERVER_CLOSE = 200
}

export enum ResponseCode {
    OK = 0,
    INVALID_MESSAGE = 1,
    INVALID_USERNAME = 2,
    INVALID_LOGIN_INFO = 3,
    USER_ALREADY_REGISTERED = 4,
    ROOM_ALREADY_CREATED = 5,
    NON_EXISTING_USER = 6,
    NON_EXISTING_ROOM = 7,
    NOT_ROOM_OWNER = 8
}
