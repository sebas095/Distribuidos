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
    else if (msg.type == connect.MessageType.NEW_CHAT && msg.content.room == 'default') {
        $('#chat').append(`<li><b>${msg.content.user}: </b>${msg.content.message}</li>`);
    }
});

$(function() {
    var user = "";
    $.getJSON('../../tmp/data.json', function(data) {
        user = data.user;
    });

    $('#send').click(function() {
        sendMsj(user);
    });

    $('#msj').keypress(function(ev) {
        var msj = $(this).val().trim();
        if (ev.which == 13 && msj.length > 0)
            sendMsj(user);
    });
});

function sendMsj(user) {
    var msj = $('#msj').val().trim();
    if (msj.length > 0) {
        $('#msj').val('');

        var data = {
            "user": user,
            "room": "default",
            "message": msj
        };

        var msg = new connect.Message(connect.MessageType.CHAT, data);
        socket.Send(msg);
    }
}
