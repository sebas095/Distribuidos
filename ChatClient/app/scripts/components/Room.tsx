import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Button, Icon} from 'react-materialize';
import {ipcRenderer, remote} from 'electron';

interface RoomProps {
    owner: string;
    name: string;
}

interface RoomState {
    owner?: string;
    name?: string;
}

export class Room extends React.Component <RoomProps, RoomState> {
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

    exitRoom(ev) {
        ipcRenderer.send('loadWindow', 3);
        alert("BYE!!");
    }

    render() {
        return (
            <div>
                <div className>
                    <Icon className="roomColor">account_balance &nbsp;&nbsp;</Icon>
                    <label className="roomColor">{this.state.name}</label>
                </div>
                <div className="row center" id="exit">
                    <Button onClick={this.exitRoom.bind(this)} className="waves-effect waves-light bottonColor">EXIT ROOM</Button>
                </div>
            </div>
        );
    }
}
