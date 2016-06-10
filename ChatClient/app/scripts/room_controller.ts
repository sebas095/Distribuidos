import * as connect from './connect';
import * as $ from 'jquery';
import {ipcRenderer, remote} from 'electron';

var socket = remote.getGlobal("socket");

socket.on("receive", function(msg) {
    console.log(msg);
    if (msg.type == connect.MessageType.RESPONSE) {
        console.log("Respuesta para:", connect.MessageType[msg.content.type]);
        console.log("Codigo de respuesta:", connect.ResponseCode[msg.content.code]);
    }
    else if (msg.type == connect.MessageType.NEW_CHAT) {
        $.getJSON('../../tmp/room.json', (data) => {
            if (data.room.name == msg.content.room)
                $('#chat').append(`<li><b>${msg.content.user}: </b>${msg.content.message}</li>`);
        });
    }
});

$(function() {
    var user = "";
    var room = "";

    $.getJSON('../../tmp/data.json', function(data) {
        user = data.user;
    });

    $.getJSON('../../tmp/room.json', function(data) {
        room = data.room.name;
    });

    $('#send').click(function() {
        sendMsj(user, room);
    });

    $('#msj').keypress(function(ev) {
        var msj = $(this).val().trim();
        if (ev.which == 13 && msj.length > 0)
            sendMsj(user, room);
    });
});

function sendMsj(user, room) {
    var msj = $('#msj').val().trim();
    if (msj.length > 0) {
        $('#msj').val('');

        var data = {
            "user": user,
            "room": room,
            "message": msj
        };

        var msg = new connect.Message(connect.MessageType.CHAT, data);
        socket.Send(msg);
    }
}
