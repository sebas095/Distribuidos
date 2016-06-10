import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button, Icon} from 'react-materialize';
import {ipcRenderer, remote} from 'electron';
import * as $ from 'jquery';
import * as connect from '../connect';
import * as fs from 'fs';

var socket = remote.getGlobal("socket");

interface RoomProps {
    owner: string;
    name: string;
}

interface RoomState {
    owner?: string;
    name?: string;
}

class Room extends React.Component <RoomProps, RoomState> {
    constructor(props) {
        super(props);
        this.state = {
            owner: this.props.owner,
            name: this.props.name
        };
    }

    componentDidMount() {
        this.setState({
            owner: this.props.owner,
            name: this.props.name
        });
    }

    openRoom(ev) {
        var data = {
            "owner": this.state.owner,
            "name": this.state.name
        };

        ipcRenderer.send('updateFile', {"data": data, "type": "room"});
        ipcRenderer.send('loadWindow', 4);
    }

    render() {
        return (
            <a href="#" className="roomColor" onClick={this.openRoom.bind(this)}>{this.state.name}</a>
        );
    }
}

interface RoomListProps {
    data: Array<RoomProps>;
}

interface RoomListState {
    data?: Array<RoomProps>;
    tmp?: string;
}

export class RoomList extends React.Component <RoomListProps, RoomListState> {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            tmp: ""
        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data
        });
    }

    removeRoom(index: number) {
        var data = this.state.data;
        $.getJSON('../../tmp/data.json', (room) => {
            var name = {
                "owner": room.user,
                "name": data[index].name
            }
            var msg = new connect.Message(connect.MessageType.REMOVE_ROOM, name);
            socket.Send(msg);

            socket.once('receive', (msg) => {
                if (msg.type == connect.MessageType.RESPONSE) {
                    if (msg.content.type == connect.MessageType.REMOVE_ROOM) {
                        if (msg.content.code == connect.ResponseCode.OK) {
                            data.splice(index, 1);

                            this.setState({
                                data: data
                            });

                            ipcRenderer.send('updateFile', {"data": data, "type": "rooms"});
                            //alert(JSON.stringify(data));
                        }
                        else {
                            alert("No tienes permisos para borrar esta sala!");
                        }
                    }
                }
            });
        });

        //ipcRenderer.send('updateFile', {"data": this.state.data, "type": "rooms"});
    }

    update(ev) {
        // socket.on('receive', (msg) => {
        //     if (msg.type == connect.MessageType.NEW_ROOM) {
        //         var newRoom = msg.content;
        //         var rooms = this.state.data;
        //         rooms.push(newRoom);
        //
        //         this.setState({
        //             data: rooms
        //         });
        //     }
        // });
    }

    addRoom(ev) {
        $.getJSON('../../tmp/data.json', (user) => {
            var user = user.user;
            var data = this.state.data;
            var name = this.state.tmp;
            var ok = true;

            data.forEach(function(room) {
                if (room.name == name && name.length > 0) {
                    alert(`Ya existe una sala con el nombre "${name}", por favor elige otro nombre`);
                    ok = false;
                    return;
                }
            });

            if (this.state.tmp.length == 0) {
                ok = false;
                alert("Por favor lleva el campo!");
                return;
            }

            if (ok) {
                data.push({
                    owner: user,
                    name: name
                });

                this.setState({
                    data: data,
                    tmp: ""
                });

                var room = {
                    "owner": user,
                    "name": name
                };

                var msg = new connect.Message(connect.MessageType.CREATE_ROOM, room);
                socket.Send(msg);
            }
        });
    }

    editName(ev) {
        this.setState({
            tmp: ev.target.value
        });
    }

    render() {
        var rooms = this.state.data.map((room, index) => {
            return (
                <li>
                    <Icon className="roomColor">home &nbsp;&nbsp;</Icon>
                    <label><Room owner={room.owner} name={room.name}/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                    <label className="exit" onClick={this.removeRoom.bind(this, index)}>X</label>
                </li>
            );
        });

        return (
            <div>
                <div onChange={this.update.bind(this)}>
                    <ul>{rooms}</ul>
                    <input type="text" placeholder="Room Name" className="placeholderColor" value={this.state.tmp} onChange={this.editName.bind(this)}/>
                </div>
                <div className="row center">
                    <Button onClick={this.addRoom.bind(this)} className="waves-effect waves-light bottonColor">ADD</Button>
                </div>
            </div>
        );
    }
}
