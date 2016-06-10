import * as connect from './connect';
import * as $ from 'jquery';
import * as fs from 'fs';
import {ipcRenderer, remote} from 'electron';  // Module to control application life.

var socket = remote.getGlobal("socket");

function LoginReceiver(msg) {
    console.log(msg);
    $("#user").prop('disabled', true);
    $("#password").prop('disabled', true);
    //alert(JSON.stringify(msg));
    if (msg.type == connect.MessageType.RESPONSE) {
        if (msg.content.type == connect.MessageType.LOGIN) {
            if (msg.content.code == connect.ResponseCode.INVALID_LOGIN_INFO) {
                ipcRenderer.send('loadWindow', 2);
                alert("Los datos ingresados no son correctos!");
            }
            else if(msg.content.code == connect.ResponseCode.OK) {
                var rooms = {"rooms": msg.content.content};

                ipcRenderer.send('loadWindow', 3);
                fs.writeFile(__dirname + '/../../tmp/rooms.json', JSON.stringify(rooms, null, 4));
                //ipcRenderer.send('updateFile', {"data": msg.content.content, "type": "rooms"});
            }
         }

        console.log("Respuesta para:", connect.MessageType[msg.content.type]);
        console.log("Codigo de respuesta:", connect.ResponseCode[msg.content.code]);
    }
}

socket.on("receive", LoginReceiver);

$(function() {
    $('#register').click(function() {
        ipcRenderer.send('loadWindow', 1);
    });

    $('#login').submit(function() {
        var data = {
            "user": $('#user').val(),
            "password": $('#password').val()
        };

        var user = data.user;
        ipcRenderer.send('updateFile', {"data": user, "type": "user"});

        var msg = new connect.Message(connect.MessageType.LOGIN, data);
        socket.Send(msg);

    });
});
